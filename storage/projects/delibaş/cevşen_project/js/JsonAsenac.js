var Asenac;
(function (Asenac) {
    function GetJsonAsenac(code) {
        return JsonAsenac.GetJsonAsenac(code);
    }
    Asenac.GetJsonAsenac = GetJsonAsenac;
    let JsonAsenac;
    (function (JsonAsenac) {
        function GetJsonAsenac(code) {
            return ToAsenaJson(PreAsenac.GetPreAsenac(code));
        }
        JsonAsenac.GetJsonAsenac = GetJsonAsenac;
        /**
         * Main ToAsenaJson Function
        */
        const ToAsenaJson = function (list) {
            let children = [];
            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                const code = element.code.trim();
                let preCode = code.substr(0, 2);
                let afterCode = code.substr(2);
                let child = {
                    code: code,
                    line: element.line,
                    children: [],
                    type: null
                };
                if (preCode == "::") {
                    child.type = ToAsenaJson.For(code);
                }
                else if (preCode == ":?") {
                    child.type = ToAsenaJson.If(code);
                }
                else if (preCode == ":!" && afterCode != "") {
                    child.type = ToAsenaJson.ElseIf(code);
                }
                else if (preCode == ":!" && afterCode == "") {
                    child.type = ToAsenaJson.Else(code);
                }
                else if (preCode == ":#") {
                    child.type = ToAsenaJson.Replace(code);
                }
                else if (preCode == "->") {
                    child.type = ToAsenaJson.Goto(code);
                }
                else if (code.substr(0, 1) == "-") {
                    child.type = ToAsenaJson.Eval(code);
                }
                else if (code.substr(0, 1) == ">") {
                    child.type = ToAsenaJson.Text(code);
                }
                else {
                    child.type = ToAsenaJson.Crel(code);
                }
                if (element.children.length > 0)
                    child.children = ToAsenaJson(element.children);
                children.push(child);
            }
            // Update If, Else If, Else Condution
            let i = -1;
            while (i + 1 < children.length) {
                i++;
                const element = children[i];
                if (element.type.type == "If") {
                    element.type =
                        {
                            type: "IfAll",
                            if: element.type.if,
                            elseChildren: [],
                            ifCrel: {
                                crel: { tagName: Asenac.DEFAULT_TAG },
                                type: "Crel"
                            }
                        };
                    let ifAll = element.type;
                    for (let j = i + 1; j < children.length; j++) {
                        const element_else = children[j];
                        if (element_else.type.type == "Else" || element_else.type.type == "ElseIf") {
                            ifAll.elseChildren.push(children.popAt(j));
                            j--;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            return children;
        };
        /**
         * Create Element Object
         */
        ToAsenaJson.Crel = function (script) {
            var realScript = script;
            //try{
            var retCrel = { crel: {}, type: "Crel" };
            var ret = retCrel.crel;
            var mat = null;
            mat = script.match(/\>(.*)$/);
            ret.innerHtml = cval(mat, [1], "");
            if (mat != null)
                script = script.replace(mat[0], "");
            let attrList = [];
            mat = null;
            while ((mat = script.matchRequirsive("[", "]")) != null) {
                attrList.push(mat[1]);
                script = script.replace(mat[0], "");
            }
            ret.tagName = cval(script.match(/^([^\#\.\[\>]+)/), [0], Asenac.DEFAULT_TAG);
            ret.id = cval(script.match(/\#([^\.\#\[\>]*)/), [1], null);
            if (ret.id != null)
                ret.id = ret.id.replace("#", "");
            let classList = script.match(/\.([^\.\#\[\>]*)/gi);
            ret.className = null;
            if (classList != null) {
                for (var i = 0; i < classList.length; i++) {
                    classList[i] = classList[i].replace(".", "");
                }
                ret.className = classList.join(" ");
            }
            ret.attrs = [];
            if (attrList != null) {
                for (var i = 0; i < attrList.length; i++) {
                    var attr = attrList[i];
                    let data = "", value = "";
                    var equalIndex = attr.indexOf("=");
                    if (equalIndex == -1) {
                        data = attr;
                    }
                    else {
                        data = attr.substr(0, equalIndex).trim();
                        value = attr.substr(equalIndex + 1);
                    }
                    ret.attrs.push({ data: data, value: value });
                }
            }
            /*
            }catch(e){
                console.warn("Crel: error in\n",realScript);
            }
            */
            if (ret.className == null)
                ret.className = "";
            if (ret.id == null)
                ret.id = "";
            if (ret.tagName == null)
                ret.tagName = "";
            if (ret.innerHtml == null)
                ret.innerHtml = "";
            ret.tagName = ret.tagName.trim();
            ret.id = ret.id.trim();
            ret.className = ret.className.trim();
            return { crel: ret, type: "Crel" };
        };
        /* #####################    FOR     ##########################
            :: iterator : key
        */
        ToAsenaJson.For = function (code) {
            let decode = code.substr(2); // -> $forData
            let forEval = decode; // -> forEval
            let forKey = ""; // -> $$anahtar
            let createElement = Asenac.DEFAULT_TAG;
            var mat = null;
            mat = code.split(":");
            forEval = mat[2];
            forKey = cval(mat, [3], "").trim();
            createElement = cval(mat, [4], Asenac.DEFAULT_TAG);
            /*
            if( (mat =decode.match(/\:([\w\ ]+)$/))!=null ){  // ::$veriler$deneme :anahtar
                forKey = mat[1];
                forEval = decode.replace(mat[0],"");
            }
            */
            return {
                forEval: forEval,
                forKey: forKey,
                forParent: ToAsenaJson.Crel(createElement),
                type: "For"
            };
        };
        /* #####################    IF     ##########################
            :? If Eval
        */
        ToAsenaJson.If = function (code) {
            let decode = code.substr(2); // -
            decode = decode.trim();
            let ifStatement = "";
            let createElement = Asenac.DEFAULT_TAG;
            ifStatement = decode.split(":")[0];
            createElement = cval(decode.split(":"), [1], Asenac.DEFAULT_TAG);
            return {
                if: ifStatement,
                ifCrel: ToAsenaJson.Crel(createElement),
                type: "If"
            };
        };
        /* #####################    ELSE IF     ##########################
            :! Else If Eval
        */
        ToAsenaJson.ElseIf = function (code) {
            var decode = code.substr(2); // -
            decode = decode.trim();
            return {
                elseif: decode,
                type: "ElseIf"
            };
        };
        /* #####################    ELSE     ##########################
            :!
        */
        ToAsenaJson.Else = function (code) {
            return {
                else: true,
                type: "Else"
            };
        };
        /* #####################    EVAL     ##########################
            - eval
            -php eval
            -node eval
            -browser eval
        */
        ToAsenaJson.Eval = function (code) {
            if (code.startsWith("-php")) {
                return {
                    lang: "-php",
                    eval: code.replace("-php", "").trim(),
                    type: "Eval"
                };
            }
            if (code.startsWith("-node")) {
                return {
                    lang: "-node",
                    eval: code.replace("-node", "").trim(),
                    type: "Eval"
                };
            }
            if (code.startsWith("-browser")) {
                return {
                    lang: "-browser",
                    eval: code.replace("-browser", "").trim(),
                    type: "Eval"
                };
            }
            return {
                lang: Asenac.DEFAULT_EVAL_LANG,
                eval: code.replace("-", "").trim(),
                type: "Eval"
            };
        };
        /* #####################    REPLACE     ##########################
            :# id_name
        */
        ToAsenaJson.Replace = function (code) {
            var decode = code.substr(2); // -
            return {
                replace: decode,
                type: "Replace"
            };
        };
        /* #####################    Goto     ##########################
            -> ViewName > ViewParameters
        */
        ToAsenaJson.Goto = function (code) {
            var decode = code.substr(2); // -
            var match = decode.match(/([^\>]*)\>(.*)/i);
            if (match) {
                return {
                    goto: match[1].trim(),
                    params: match[2].trim(),
                    type: "Goto"
                };
            }
            return {
                goto: decode.trim(),
                params: null,
                type: "Goto"
            };
        };
        ToAsenaJson.Text = function (code) {
            let decode = code.trimLeft().substr(1);
            return {
                text: decode,
                type: "Text"
            };
        };
    })(JsonAsenac = Asenac.JsonAsenac || (Asenac.JsonAsenac = {}));
    let PreAsenac;
    (function (PreAsenac) {
        /**
         * Return number of indent
         * @param line Code
         */
        function GetIndentCount(line) {
            var defIndentLen = Asenac.DEFAULT_INDENT_LENGTH;
            var i = 0, j = 0;
            for (i = 0; i < line.length; i++) {
                if (line[i] == '\t')
                    j += defIndentLen;
                else if (line[i] == " ")
                    j += 1;
                else
                    break;
            }
            return j / defIndentLen;
        }
        function ConvertScriptObject(code) {
            code = code.replaceAll(/\n[\ \t]*\.\./, "");
            let codes = code.split("\n");
            var scriptList = [];
            for (let i = 0; i < codes.length; i++) {
                const element = codes[i];
                let indentCount = GetIndentCount(element);
                let c = element.replace(/^[\ ]*/, "");
                if (c.trim() == "")
                    continue;
                if (c.trim().substr(0, 2) == "//")
                    continue;
                scriptList.push({
                    indent: indentCount,
                    code: c,
                    line: i,
                    children: []
                });
            }
            return scriptList;
        }
        function ConvertScriptTree(list, start = 0, index = 0) {
            //console.log( "--",start,index )
            let children = [];
            let continueAt = Infinity;
            for (let i = start; i < list.length; i++) {
                //console.log( "----",index,i )
                const element = list[i];
                if (continueAt < element.indent) {
                    continue;
                }
                if (element.indent > index) {
                    children[children.length - 1].children = ConvertScriptTree(list, i, element.indent);
                    continueAt = index;
                }
                if (element.indent < index) {
                    break;
                }
                if (element.indent == index) {
                    children.push(element);
                    continueAt = Infinity;
                }
            }
            return children;
        }
        function GetPreAsenac(code) {
            return ConvertScriptTree(ConvertScriptObject(code));
        }
        PreAsenac.GetPreAsenac = GetPreAsenac;
    })(PreAsenac = Asenac.PreAsenac || (Asenac.PreAsenac = {}));
    exports = {};
    exports.JsonAsena = GetJsonAsenac;
})(Asenac || (Asenac = {}));
