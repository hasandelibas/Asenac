/**
 * Asena View ( "sayfa ", nesne )
 * @param code
 * @param datagram
 */
function AsenaView(page, rd, ...globals) {
    let jsonAsena = Asenac.GetJsonAsenac(page);
    return AsenaView.Complie(jsonAsena, {
        data: {},
        global: globals,
        keys: [],
        lastKey: null,
        realData: rd,
        path: ""
    });
}
AsenaView.Complie = function (code, datagram) {
    let list = document.createDocumentFragment();
    //console.log("AsenaView start")
    for (let i = 0; i < code.length; i++) {
        const jsonAsena = code[i];
        //console.log(jsonAsena.code)
        if (jsonAsena.type.type == "Crel") {
            list.appendChild(AsenaView.CreateElement(jsonAsena.type, datagram, jsonAsena.code));
        }
        else if (jsonAsena.type.type == "Text") {
            list.appendChild(AsenaView.CreateText(jsonAsena.type, datagram));
        }
        else if (jsonAsena.type.type == "For") {
            list.appendChild(AsenaView.For(jsonAsena, datagram));
            continue;
        }
        else if (jsonAsena.type.type == "Eval" && jsonAsena.type.lang == "-browser") {
            AsenaView.EvalVariablesInner(jsonAsena.type.eval, datagram).evaled;
        }
        else if (jsonAsena.type.type == "IfAll") {
            list.appendChild(AsenaView.If(jsonAsena, datagram));
            continue;
        }
        else if (jsonAsena.type.type == "Replace") {
            var idElement = document.getElementById(jsonAsena.type.replace);
            if (idElement == null)
                idElement = AsenaView.IdList[jsonAsena.type.replace];
            if (idElement) {
                idElement.empty();
                idElement.appendChild(AsenaView.Complie(jsonAsena.children, datagram));
            }
            else {
                //console.warn("#",jsonAsena.type.replace," not found"); 
            }
            continue;
        }
        else if (jsonAsena.type.type == "Goto") {
        }
        if (jsonAsena.children.length > 0) {
            let children = AsenaView.Complie(jsonAsena.children, datagram);
            //console.log(children)
            list.lastChild.appendChild(children);
            //Append( list[list.length-1] as HTMLElement , children  )
        }
    }
    return list;
};
AsenaView.RemoveTriggers = function (el, rd, startMe = true) {
    if (startMe && el._asenac_on_triggers) {
        rd.removeEvent(el._asenac_on_triggers);
        el._asenac_on_triggers = [];
    }
    for (let i = 0; i < el.childNodes.length; i++) {
        const element = el.childNodes[i];
        rd.removeEvent(element._asenac_on_triggers);
        element._asenac_on_triggers = [];
        if (element instanceof Element)
            AsenaView.RemoveTriggers(element, rd);
    }
};
AsenaView.CreateElement = function (params, datagram, code) {
    let param = params.crel;
    let element = document.createElement(param.tagName);
    element._asenac_on_triggers = [];
    if (param.id != "" && param.id != null) {
        element.setAttribute("id", param.id);
        AsenaView.IdList[param.id] = element;
    }
    if (param.className != "" && param.className != null)
        element.setAttribute("class", param.className);
    if (param.attrs != null) {
        for (let i = 0; i < param.attrs.length; i++) {
            const attr = param.attrs[i];
            element.setAttribute(attr.data, attr.value);
        }
    }
    if (param.innerHtml != null && param.innerHtml != "") {
        let eval = AsenaView.EvalVariablesOuter(param.innerHtml, datagram);
        element.appendChild(new Text(eval.evaled));
        eval.variables.distinct();
        let vars = eval.variables;
        for (let i = 0; i < vars.length; i++) {
            const key = vars[i];
            var id = datagram.realData.on(key, function () {
                AsenaView.UpdateElement(element, params, datagram);
            });
            element._asenac_on_triggers.push(id);
        }
    }
    return element;
};
AsenaView.UpdateElement = function (element, params, datagram) {
    let param = params.crel;
    if (param.id != "" && param.id != null)
        element.setAttribute("id", param.id);
    if (param.className != "" && param.className != null)
        element.setAttribute("class", param.className);
    if (param.attrs != null) {
        for (let i = 0; i < param.attrs.length; i++) {
            const attr = param.attrs[i];
            element.setAttribute(attr.data, attr.value);
        }
    }
    if (param.innerHtml != "" && param.innerHtml != null) {
        element.firstChild.remove();
        element.prepend(new Text(AsenaView.EvalVariablesOuter(param.innerHtml, datagram).evaled));
    }
};
AsenaView.CreateText = function (param, datagram) {
    let evaled = AsenaView.EvalVariablesOuter(param.text, datagram);
    let node = document.createTextNode(evaled.evaled);
    node._asenac_on_triggers = [];
    let code = param.text;
    var vars = evaled.variables;
    vars.distinct();
    for (let i = 0; i < vars.length; i++) {
        const key = vars[i];
        var id = datagram.realData.on(key, function () {
            node.textContent = AsenaView.EvalVariablesOuter(param.text, datagram).evaled;
        });
        node._asenac_on_triggers.push(id);
    }
    return node;
};
AsenaView.If = function (jsonAsena, datagram) {
    //console.log(jsonAsena.type["ifCrel"]);
    let parent = AsenaView.CreateElement(jsonAsena.type["ifCrel"], datagram, jsonAsena.code);
    let condution = null;
    function UpdateIf() {
        //console.log("Update IF...")
        let evaled = AsenaView.EvalVariablesInner(jsonAsena.type['if'], datagram);
        let if_bool = evaled.evaled;
        if (jsonAsena.type.type == "IfAll") { // Mecburi
            if (if_bool) {
                if (condution !== -1) {
                    AsenaView.RemoveTriggers(parent, datagram.realData, false);
                    parent.empty();
                    parent.appendChild(AsenaView.Complie(jsonAsena.children, datagram));
                }
                condution = -1;
                return;
            }
            else {
                for (let i = 0; i < jsonAsena.type.elseChildren.length; i++) {
                    const element = jsonAsena.type.elseChildren[i];
                    if (element.type.type == "ElseIf") {
                        let if_bool_2 = AsenaView.EvalVariablesInner(element.type.elseif, datagram).evaled;
                        if (if_bool_2) {
                            if (condution !== i) {
                                AsenaView.RemoveTriggers(parent, datagram.realData, false);
                                parent.empty();
                                parent.appendChild(AsenaView.Complie(element.children, datagram));
                            }
                            condution = i;
                            return;
                        }
                    }
                    if (element.type.type == "Else") {
                        if (condution !== i) {
                            AsenaView.RemoveTriggers(parent, datagram.realData, false);
                            parent.empty();
                            parent.appendChild(AsenaView.Complie(element.children, datagram));
                        }
                        condution = i;
                        return;
                    }
                }
                AsenaView.RemoveTriggers(parent, datagram.realData, false);
                parent.empty();
            }
        }
    }
    UpdateIf();
    var vars = AsenaView.EvalVariablesInner(jsonAsena.type["if"], datagram).variables;
    for (let i = 0; i < jsonAsena.type.elseChildren.length; i++) {
        const element = jsonAsena.type.elseChildren[i];
        if (element.type.type == "ElseIf") {
            vars.concat(AsenaView.EvalVariablesInner(element.type.elseif, datagram).variables);
        }
    }
    vars.distinct();
    for (let i = 0; i < vars.length; i++) {
        const key = vars[i];
        let rp = datagram.path + "/" + key;
        //console.log("IF Variables:",rp)
        var id = datagram.realData.on(rp, function () {
            //console.log("Update Element", rp)
            UpdateIf();
        });
        parent._asenac_on_triggers.push(id);
    }
    return parent;
};
AsenaView.For = function (jsonAsena, datagram) {
    jsonAsena.type = jsonAsena.type;
    let forEval = jsonAsena.type.forEval;
    let forKey = jsonAsena.type.forKey;
    let forParent = jsonAsena.type.forParent;
    let parentNode = AsenaView.CreateElement(forParent, datagram, jsonAsena.code);
    let removeTrigger = null, newItemTrigger = null;
    let evaled = AsenaView.EvalVariablesInner(forEval, datagram);
    function ReCreateFor() {
        let evaled = AsenaView.EvalVariablesInner(forEval, datagram);
        let iterators = evaled.evaled;
        // For RealData
        let newPath = datagram.path;
        let evalVariables = evaled.variables;
        if (RealData._PATH_ in iterators) {
            newPath = iterators[RealData._PATH_];
        }
        let childrenList = [];
        for (let key in iterators) {
            if (iterators.hasOwnProperty(key)) {
                if (!isNaN(parseInt(key))) {
                    //@ts-ignore
                    key = parseInt(key);
                }
                const iter = iterators[key];
                let _keys = Object.assign({}, datagram.keys);
                _keys[forKey] = key;
                //datagram.keys[forKey] = key;
                let childPath;
                if (newPath != datagram.path) {
                    childPath = newPath + "/" + key;
                }
                else {
                    childPath = datagram.path;
                }
                //console.log("----------------------")
                let child = AsenaView.Complie(jsonAsena.children, {
                    data: iter,
                    global: datagram.global,
                    keys: _keys,
                    lastKey: key,
                    realData: datagram.realData,
                    path: childPath
                });
                let childrenArray = Array.from(child.children);
                childrenList.push(childrenArray);
                parentNode.appendChild(child);
            }
        }
        // For RealData remove item
        removeTrigger = datagram.realData.on(newPath + "/-", function (data, index, count) {
            console.log("Remove Element", count);
            for (let c = 0; c < count; c++) {
                if (index + c in childrenList)
                    for (let i = 0; i < childrenList[index + c].length; i++) {
                        const element = childrenList[index + c][i];
                        AsenaView.RemoveTriggers(element, datagram.realData);
                        element.remove();
                    }
            }
            childrenList.splice(index, count);
        });
        // For RealData add new item
        newItemTrigger = datagram.realData.on(newPath + "/+", function (data, index) {
            console.log("Add Element", data.length);
            if (data.length == 0)
                return;
            for (let c = 0; c < data.length; c++) {
                const element = data[c];
                let key = index + c;
                datagram.keys[forKey] = key;
                let child = AsenaView.Complie(jsonAsena.children, {
                    data: data[c],
                    global: datagram.global,
                    keys: datagram.keys,
                    lastKey: key,
                    realData: datagram.realData,
                    path: newPath + "/" + key
                });
                var childrenArray = Array.from(child.children);
                if (childrenList.length != 0 && key < childrenList.length) {
                    parentNode.insertBefore(child, childrenList[0][key]);
                }
                else {
                    parentNode.appendChild(child);
                }
                childrenList.splice(index, 0, childrenArray);
            }
        });
        parentNode._asenac_on_triggers.push(newItemTrigger);
        parentNode._asenac_on_triggers.push(removeTrigger);
    }
    ReCreateFor();
    for (let i = 0; i < evaled.variables.length; i++) {
        const path = evaled.variables[i];
        var id = datagram.realData.on(path, function (data) {
            console.log("Change For Element");
            datagram.realData.removeEvent(removeTrigger);
            datagram.realData.removeEvent(newItemTrigger);
            AsenaView.RemoveTriggers(parentNode, datagram.realData, false);
            parentNode.empty();
            ReCreateFor();
        });
        parentNode._asenac_on_triggers.push(id);
    }
    return parentNode;
};
AsenaView.Global = function (path, datagram) {
    var ret = null;
    for (let i = 0; i < datagram.global.length; i++) {
        const element = datagram.global[i];
        if ((ret = cval(element, path.split(/\/+/), null)) !== null) {
            return { evaled: ret, isGlobal: true };
        }
    }
    ret = datagram.realData.get("/" + path, null);
    return { evaled: ret, isGlobal: false };
};
/**
 * Convert {{  }}  to Evaling
 * Convert $   to Evaling
 */
/**
 * $$ self key in obj
 * $ -> self
 *
 * $
 * $adı  -> $['adı']
 * $kisi$adi -> $['kisi']['adi']
 * $$$GLOBAL_DATA
 * @param ___script -> $no + 15
 * @param ___D -> Datas
 * @param ___FK -> Foreach Keys
 * @param ___LFK -> Last Foreach Key
 */
/**
 * Get Single Eval Variables Of Object
 */
/**
 * Convert {{  }}  to Evaling
 * Convert $ to Evaling
 * Eval outer is a string.
 */
AsenaView.EvalVariablesOuter = function (___script, datagram) {
    let ___D = datagram.realData.get(datagram.path), ___G = datagram.global, ___FK = datagram.keys, ___LFK = datagram.lastKey;
    var mat;
    var ret = [];
    // {{ $name }}
    while ((mat = ___script.matchRequirsive("{{", "}}")) != null) {
        var ___e = AsenaView.EvalVariablesInner(mat[1], datagram);
        ___script = ___script.replace(mat[0], ___e.evaled);
        ret = ret.concat(___e.variables);
    }
    // Global Keys
    while ((mat = ___script.match(/\$\$\$([\w\_\$]+)/)) != null) {
        var m = mat[1];
        var path = m.split(/[\$\.]/).join("/");
        var __evaled = AsenaView.Global(path, datagram);
        ___script = ___script.replace(mat[0], __evaled.evaled);
        if (__evaled.isGlobal == false)
            ret.push("/" + path);
    }
    // Foreach Keys
    while ((mat = ___script.match(/\$\$([\w\_\$]+)/)) != null) {
        var m = mat[1];
        ___script = ___script.replace(mat[0], AsenaView.EvalVariablesInner(mat[0], datagram).evaled);
    }
    // Name is : $name
    while ((mat = ___script.match(/\$([^ ]+)/)) != null) {
        var ___e = AsenaView.EvalVariablesInner(mat[0], datagram);
        ___script = ___script.replace(mat[0], ___e.evaled);
        ret = ret.concat(___e.variables);
    }
    if (___script.includes("$")) {
        ret.push("/");
    }
    // SELF DATA Auto Eval
    ___script = ___script.replaceAll("$", ___D);
    return { evaled: ___script, variables: ret };
};
/**
 * Eval value is any object
 * $$ self key in obj
 * $ -> self
 *
 * $
 * $adı  -> $['adı']
 * $kisi$adi -> $['kisi']['adi']
 * $$$GLOBAL_DATA
 * @param ___script -> $no + 15
 * @param ___D -> Datas
 * @param ___FK -> Foreach Keys
 * @param ___LFK -> Last Foreach Key
 */
AsenaView.EvalVariablesInner = function (___script, datagram) {
    let ___D = datagram.realData.get(datagram.path), ___G = datagram.global, ___FK = datagram.keys, ___LFK = datagram.lastKey;
    //var replaces : Array<{o:string,n:string}> = [];
    var mat;
    var ret = [];
    // {{  $$$ASD{{ $ + 1 }}  }}
    while ((mat = ___script.matchRequirsive("{{", "}}")) != null) {
        var ___e = AsenaView.EvalVariablesInner(mat[1], datagram);
        ___script = ___script.replace(mat[0], ___e.evaled);
        ret = ret.concat(___e.variables);
    }
    // Global Keys
    while ((mat = ___script.match(/\$\$\$([\w\_\$]+)/)) != null) {
        var m = mat[1];
        var path = m.split(/[\$\.]/).join("/");
        ___script = ___script.replace(mat[0], "AsenaView.Global('" + path + "',datagram).evaled");
        if (AsenaView.Global(path, datagram).isGlobal == false) {
            ret.push("/" + path);
        }
    }
    // Foreach Keys
    while ((mat = ___script.match(/\$\$([\w\_\$]+)/)) != null) {
        var m = mat[1];
        ___script = ___script.replace(mat[0], "___FK['" + m + "']");
    }
    // Self Foreach Key
    ___script = ___script.replaceAll("$$", '___LFK');
    // Normal Datas
    while ((mat = ___script.match(/\$([\w\_\$]+)/)) != null) {
        var m = mat[1];
        m = m.split(/[\$\.]/).join("']['");
        ___script = ___script.replace(mat[0], "___D['" + m + "']");
        ret.push(datagram.path + "/" + mat[1].split(/[\$\.]/).join("/"));
    }
    // Self Data
    if (___script.includes("$")) {
        ___script = ___script.replaceAll("$", "___D");
        ret.push("");
    }
    var evalStr = eval("(" + ___script.toString() + ")");
    return { evaled: evalStr, variables: ret };
};
AsenaView.IdList = {};
AsenaView.Pages = {};
/**
 * Eval Biçimi
 *
 * EvalOuter
 *  Dışarıyı eval eder dönen değer bir stringdir.
 * EvalInner
 *  içeriyi eval eder dönen değer bir js nesne tabanlı bir şeydir.
 *
 * $ -> kendisi
 * $$ -> son anahtarı
 * $$$ -> global keyleri
 *
 * $str -> o['str']
 * $str$str  -> o['str']['str']
 * -----------------------------
 * $str.str
 * $str['str']
 *
 * $str['{{ '$'+$$$test }}']
 *
 */
