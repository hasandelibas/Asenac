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
                const code = element.code.trimLeft(); //.trim();
                let child = {
                    code: code,
                    line: element.line,
                    children: [],
                    type: null
                };
                child.type = ToAsenaJson._Single(code);
                /*
                if(child.type.type=="Html" && child.type.html.trim()==""){
                    //@ts-ignore
                    child.type.html = child.children[0]
                    return;
                }
                */
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
                    let ifCondution = {
                        code: element.code,
                        line: element.line,
                        children: element.children,
                        type: {
                            type: "If",
                            ifParent: element.type.ifParent,
                            condution: element.type.condution
                        }
                    };
                    element.type =
                        {
                            type: "IfAll",
                            condutionChildren: [],
                            "ifParent": element.type.ifParent
                        };
                    element.children = [];
                    element.type.condutionChildren.push(ifCondution);
                    let ifAll = element.type;
                    for (let j = i + 1; j < children.length; j++) {
                        const element_else = children[j];
                        if (element_else.type.type == "Else" || element_else.type.type == "ElseIf") {
                            ifAll.condutionChildren.push(children.popAt(j));
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
        ToAsenaJson._Single = function (code) {
            let preCode = code.substr(0, 2);
            let afterCode = code.substr(2);
            let type;
            if (preCode == "::") {
                type = ToAsenaJson.For(code);
            }
            else if (preCode == ":?") {
                type = ToAsenaJson.If(code);
            }
            else if (preCode == ":!" && afterCode != "") {
                type = ToAsenaJson.ElseIf(code);
            }
            else if (preCode == ":!" && afterCode == "") {
                type = ToAsenaJson.Else(code);
            }
            else if (preCode == ":#") {
                type = ToAsenaJson.Replace(code);
            }
            else if (preCode == ":+") {
                type = ToAsenaJson.Append(code);
            }
            else if (preCode == ":>") {
                type = ToAsenaJson.SetSelector(code);
            }
            else if (preCode == "->") {
                type = ToAsenaJson.Goto(code);
            }
            else if (code.substr(0, 1) == ":") {
                type = ToAsenaJson.ReturnObject(code);
            }
            else if (code.substr(0, 1) == "-") {
                type = ToAsenaJson.Eval(code);
            }
            else if (code.substr(0, 1) == ">") {
                type = ToAsenaJson.Text(code);
            }
            else if (code.substr(0, 5) == "html.") {
                type = ToAsenaJson.Html(code);
            }
            else {
                type = ToAsenaJson.Crel(code);
            }
            return type;
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
            // Calc Inner HTML
            if ((mat = script.indexOf(">"))) {
                var _tagIndex = mat;
                var _removedBracket = script.toString();
                while ((mat = _removedBracket.matchRequirsive("[", "]")) != null) {
                    if (mat[2] > _tagIndex)
                        break;
                    _removedBracket = _removedBracket.replace(mat[0], "");
                    _tagIndex = _removedBracket.indexOf(">");
                }
                mat = _removedBracket.match(/\>(.*)$/);
                ret.innerHtml = cval(mat, [1], "");
                if (mat != null)
                    script = script.replace(mat[0], "");
            }
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
            let forParent = "";
            var mat = null;
            // :
            mat = decode.split(/(?<=[^\\]):/);
            forEval = mat[0];
            forKey = cval(mat, [1], "").trim();
            forParent = cval(mat, [2], "");
            let crelElement = forParent.trim() != "" ? ToAsenaJson.Crel(forParent) : null;
            return {
                forEval: forEval,
                forKey: forKey,
                forParent: crelElement,
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
            let splitted = decode.split(/(?<=[^\\]):/);
            ifStatement = splitted[0];
            var crelObj = null;
            createElement = cval(splitted, [1], "");
            if (createElement.trim() != "")
                crelObj = ToAsenaJson.Crel(createElement);
            return {
                condution: ifStatement,
                ifParent: crelObj,
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
                condution: decode,
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
            //var match = decode.match(/([^\>]*)\>(.*)/i)
            var splitted = decode.split(">");
            var gotoParam = splitted.popAt(0).trim();
            // contains bug
            var params = [splitted.join(">")];
            // var params = splitted;
            return {
                goto: gotoParam,
                params: params,
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
        ToAsenaJson.ReturnObject = function (code) {
            var list = code.split(":");
            list.popAt(0);
            var name = list.popAt(0).trim();
            var objStr = list.join(":").trimLeft();
            var obj = ToAsenaJson._Single(objStr);
            return {
                type: "ReturnObject",
                name: name,
                obj: obj
            };
        };
        ToAsenaJson.Html = function (code) {
            code = code.trim().substr(5);
            return {
                html: code.matchRequirsive("{", "}")[1],
                type: "Html"
            };
        };
        ToAsenaJson.Append = function (code) {
            var decode = code.substr(2).trim(); // -
            return {
                selector: decode,
                type: "Append"
            };
        };
        ToAsenaJson.SetSelector = function (code) {
            var decode = code.substr(2).trim(); // -
            return {
                selector: decode,
                type: "SetSelector"
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
            code = code.replaceAll(/\n\s*\.\./, "");
            var codes = code.splitOuter("\n", "{", "}");
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
        PreAsenac.ConvertScriptObject = ConvertScriptObject;
        function ConvertScriptTree(list, start = 0, index = 0) {
            //console.log( "--",start,index )
            let children = [];
            let continueAt = Infinity;
            for (let i = start; i < list.length; i++) {
                const element = list[i];
                if (continueAt < element.indent) {
                    continue;
                }
                if (element.code.trim() == "html.") {
                    continueAt = index;
                    children.push(element);
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
})(Asenac || (Asenac = {}));
