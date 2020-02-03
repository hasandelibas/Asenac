//@ts-ignore
if (typeof process != "undefined")
    esprima = require('esprima');
var Asenac;
(function (Asenac) {
    Asenac.PagesText = {};
    Asenac.PagesJson = {};
    Asenac.PagesFunction = {};
    /**
     * Load Asenac View Engine
     */
    function Load(script, name, type = "asenac/function") {
        // Load All 
        if (script == null) {
            let scripts = document.getElementsByTagName("script");
            for (let i = 0; i < scripts.length; i++) {
                const script = scripts[i];
                if (["asenac/realdata", "asenac/function"].indexOf(script.getAttribute("type")) < 0)
                    continue;
                let name = script.getAttribute("name").trim();
                let code = script.textContent;
                Asenac.PagesText[name] = code;
                Asenac.PagesJson[name] = Asenac.GetJsonAsenac(code);
                if (script.type == "asenac/realdata") {
                }
                if (script.type == "asenac/function") {
                    BrowserView.complie(code);
                }
            }
        }
        else {
            Asenac.PagesText[name] = script;
            Asenac.PagesJson[name] = Asenac.GetJsonAsenac(script);
            if (type == "asenac/realdata") {
            }
            if (type == "asenac/function") {
                Asenac.PagesFunction[name] = BrowserView.complie(script);
            }
        }
    }
    Asenac.Load = Load;
    function Complie(pageName, ...parameters) {
        if (pageName in Asenac.PagesFunction) {
            return ComplieBrowserFunction.bind(this)(pageName, ...parameters);
        }
        else {
            return ComplieBrowserRealData.bind(this)(pageName, ...parameters);
        }
    }
    Asenac.Complie = Complie;
    function ComplieBrowserFunction(pageName, ...parameters) {
        return Asenac.PagesFunction[pageName].bind(this)(...parameters);
    }
    Asenac.ComplieBrowserFunction = ComplieBrowserFunction;
    function ComplieBrowserRealData(pageName, ...parameters) {
        return Asenac.BrowserViewRealData.complie.bind(this)(pageName, ...parameters);
    }
    Asenac.ComplieBrowserRealData = ComplieBrowserRealData;
    let BrowserView;
    (function (BrowserView) {
        function complie(asena) {
            let fn = null;
            if (typeof (asena) == "string") {
                asena = Asenac.GetJsonAsenac(asena);
            }
            var fnStr = CreateFunctionMain(asena);
            if (typeof fnStr == "string") {
                fn = eval(fnStr);
            }
            else {
                fn = function (Self, Global) {
                    return document.createDocumentFragment();
                };
            }
            return fn;
        }
        BrowserView.complie = complie;
        /**
         *
         * @param asena
         * @param page For Error Throw asenac page name
         */
        function complieFunctionString(asena, page) {
            if (typeof (asena) == "string") {
                asena = Asenac.GetJsonAsenac(asena);
            }
            var fnStr = "(" + CreateFunctionMain(asena) + ")";
            try {
                //@ts-ignore
                esprima.parseScript(fnStr, { tolerant: true });
                return "(" + CreateFunctionMainTry(asena, page) + ")";
            }
            catch (e) {
                var lineNumber = e.lineNumber;
                var index = e.index;
                var commentStart = fnStr.lastIndexOf("/*LINE:", index);
                var commentCode = fnStr.substr(commentStart + 2, fnStr.indexOf("*/", commentStart) - commentStart - 2);
                var errorMessage = e.message + "\n" + "\nPAGE:" + page + " " + commentCode;
                var line = commentCode.match(/LINE\:(\d+)/m)[1];
                var code = commentCode.match(/CODE\:(.*)$/m)[1];
                return { error: {
                        page: page,
                        line: line,
                        code: code,
                        message: `ERROR:${e.message}\nPAGE:${page}\nLINE:${line}\nCODE:${code}`.replaceAll("${", "$\\{")
                    } };
            }
        }
        BrowserView.complieFunctionString = complieFunctionString;
        /**
         * CreateFunctionMain
         * @param {string} name Page global page name
         */
        function CreateFunctionMainTry(asena, name) {
            let code = "function(Self,Global){\n";
            code += "try{";
            code += "if(Global==void 0) Global=Self;";
            code += "let ___that=this;\n";
            code += "let Keys={};\n";
            code += "let ___lastForKey=null;\n";
            code += "let Parent = document.createDocumentFragment();\n";
            code += "Asenac.Docs.push(Parent);\n";
            code += CreateFunction(asena);
            code += "return Parent;\n";
            code += `}catch(e){ console.warn('Runtime Error. Page: ${name}\\n',e)}`;
            code += "}\n";
            return code;
        }
        /**
         * CreateFunctionMain
         */
        function CreateFunctionMain(asena) {
            let code = "function(Self,Global){\n";
            code += "if(Global==void 0) Global=Self;";
            code += "let ___that=this;\n";
            code += "let Keys={};\n";
            code += "let ___lastForKey=null;\n";
            code += "let Parent = document.createDocumentFragment();\n";
            code += "Asenac.Docs.push(Parent);\n";
            code += CreateFunction(asena);
            code += "return Parent;\n";
            code += "}\n";
            return code;
        }
        BrowserView.CreateFunctionMain = CreateFunctionMain;
        /**
         * CreateFunctionMain using on Replace function
         */
        function CreateFunctionChildren(asena) {
            let code = "function(Self,Global){\n";
            code += "if(Global==void 0) Global=Self;";
            code += "let Parent = document.createDocumentFragment();\n";
            code += "Asenac.Docs.push(Parent);\n";
            code += CreateFunction(asena);
            code += "return Parent;\n";
            code += "};";
            return code;
        }
        /**
         * CreateFunction
         */
        function CreateFunction(asena) {
            let code = "";
            for (let i = 0; i < asena.length; i++) {
                const single = asena[i];
                code += "/*LINE:" + single.line + ", CODE:" + single.code + " */\n";
                /// TEXT
                if (single.type.type == "Text") {
                    code += "{\n" + Text(single.type);
                    code += "Parent.append(Element);\n}\n";
                }
                /// CREL
                if (single.type.type == "Crel") {
                    code += "{\n" + Crel(single.type);
                    if (single.children.length) {
                        code += "{\n";
                        code += "let Parent=Element;\n";
                        code += CreateFunction(single.children);
                        code += "}\n";
                    }
                    code += "Parent.append(Element);\n};\n";
                }
                /// IF
                if (single.type.type == "IfAll") {
                    code += If(single.type);
                }
                /// FOR
                if (single.type.type == "For") {
                    code += For(single);
                }
                /// REPLACE
                if (single.type.type == "Replace") {
                    code += Replace(single);
                }
                /// APPEND
                if (single.type.type == "Append") {
                    code += Append(single);
                }
                /// APPEND
                if (single.type.type == "SetSelector") {
                    code += SetSelector(single);
                }
                /// GOTO
                if (single.type.type == "Goto") {
                    code += Goto(single);
                }
                /// HTML
                if (single.type.type == "Html") {
                    code += Html(single.type);
                }
                /// EVAL
                if (single.type.type == "Eval") {
                    code += Eval(single);
                }
                /// RETURN OBJECT + CREL
                if (single.type.type == "ReturnObject" && single.type.obj.type == "Crel") {
                    code += "{\n" + Crel(single.type.obj);
                    if (single.children.length) {
                        code += "{\n";
                        code += "let Parent=Element;\n";
                        code += CreateFunction(single.children);
                        code += "}\n";
                    }
                    code += "___that[" + EvalOuter(single.type.name) + "]=Element;\n";
                    code += "Parent.append(Element);\n};\n";
                }
            }
            return code;
        }
        function Text(asena) {
            let code = "";
            code += "let Element = document.createTextNode(" + EvalOuter(asena.text) + ");\n";
            return code;
        }
        function Crel(asena) {
            let code = "";
            code += "let Element = document.createElement(" + str(asena.crel.tagName) + ");\n";
            if (asena.crel.className)
                code += "Element.className=" + str(asena.crel.className) + ";\n";
            if (asena.crel.id) {
                code += "Element.id=" + str(asena.crel.id) + ";\n";
            }
            for (var i = 0; i < asena.crel.attrs.length; i++) {
                let value = EvalOuter(asena.crel.attrs[i].value);
                let data = EvalOuter(asena.crel.attrs[i].data);
                if (data.substr(0, 2) == "`@") {
                    data = "`" + data.substr(2);
                    code += "let ___data=" + value + ";if(___data.trim()!='') Element.setAttribute(" + data + "," + value + ");\n";
                }
                else {
                    code += "Element.setAttribute(" + data + "," + value + ");\n";
                }
            }
            if (asena.crel.innerHtml) {
                code += "___innerHTML = " + EvalOuter(asena.crel.innerHtml) + ";\n";
                code += "if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;";
                //code += "Element.innerHTML =" + EvalOuter(asena.crel.innerHtml) + ";\n"
            }
            return code;
        }
        /**
         * If
         */
        function If(asena) {
            let code = "";
            /*
            code += "if("+this.EvalInner(asena.condution)+"){\n";
            code += this.Crel(asena.ifCrel);
            code +="}";
            */
            for (let i = 0; i < asena.condutionChildren.length; i++) {
                const c = asena.condutionChildren[i];
                if (c.type.type == "If") {
                    code += "if(" + EvalInner(c.type.condution) + "){\n";
                }
                if (c.type.type == "ElseIf") {
                    code += "else if(" + EvalInner(c.type.condution) + "){\n";
                }
                if (c.type.type == "Else") {
                    code += "else{\n";
                }
                code += CreateFunction(c.children);
                code += "}";
            }
            return code;
        }
        /**
         * For
         */
        function For(asena) {
            let code = "{\n";
            if (asena.type.type == "For") {
                if (asena.type.forParent) {
                    code += Crel(asena.type.forParent);
                    code += "Parent.append(Element);\n";
                    code += "{\n let Parent=Element;\n";
                }
                code += "let ___iterators=" + EvalInner(asena.type.forEval) + ";";
                code += "let ___forKeyName=" + EvalOuter(asena.type.forKey) + ";";
                code += "for (let ___key in ___iterators) {\n";
                code += "if (___iterators.hasOwnProperty(___key)) {\n";
                code += "Keys[___forKeyName]=___key;\n";
                code += "___lastForKey=___key;\n";
                code += "let Self=___iterators[___key];\n";
                code += CreateFunction(asena.children);
                if (asena.type.forParent) {
                    code += "}\n";
                }
                code += "}\n";
                code += "}\n";
                code += "};\n";
            }
            return code;
        }
        /**
         * Replace
         */
        function Replace(asena) {
            let code = "{\n";
            if (asena.type.type == "Replace") {
                code += "let ___replaceEl=document.getElementById(" + str(asena.type.replace) + ")\n";
                code += "let ___replaceFunction=" + CreateFunctionChildren(asena.children);
                code += "if(___replaceEl){\n";
                code += "___replaceEl.empty();\n";
                code += "___replaceEl.append( ___replaceFunction(Self,Global) );";
                code += "}\n";
            }
            return code + "};\n";
        }
        /**
         * Append
         */
        function Append(asena) {
            let code = "{\n";
            if (asena.type.type == "Append") {
                code += "let ___appendEl=Asenac.Query(" + str(asena.type.selector) + ");\n";
                //code+="let ___appendEl=document.getElementById("+ str(asena.type.append) +")\n";
                code += "let ___replaceFunction=" + CreateFunctionChildren(asena.children);
                code += "for(___el of ___appendEl){\n";
                code += "___el.append( ___replaceFunction(Self,Global) );";
                code += "}\n";
            }
            return code + "};\n";
        }
        /**
         * Append
         */
        function SetSelector(asena) {
            let code = "{\n";
            if (asena.type.type == "SetSelector") {
                code += "let ___appendEl=Asenac.Query(" + str(asena.type.selector) + ");\n";
                //code+="let ___appendEl=document.getElementById("+ str(asena.type.append) +")\n";
                code += "let ___replaceFunction=" + CreateFunctionChildren(asena.children);
                code += "for(___el of ___appendEl){\n";
                code += "___el.empty();\n";
                code += "___el.append( ___replaceFunction(Self,Global) );";
                code += "}\n";
            }
            return code + "};\n";
        }
        function Goto(asena) {
            let code = "";
            if (asena.type.type == "Goto") {
                code += "Parent.append( Asenac(" + str(asena.type.goto) + "," + EvalInner(asena.type.params[0]) + ") );";
            }
            return code;
        }
        function Html(asena) {
            let code = "{\n";
            code += "let ___temp = document.createElement('div');\n ";
            code += "___temp.innerHTML = " + EvalOuter(asena.html) + ";\n";
            code += "while (___temp.firstChild) Parent.append(___temp.firstChild);\n}\n";
            return code;
        }
        /**
         * Eval
         */
        function Eval(asena) {
            if (asena.type.type == "Eval") {
                return EvalInner(asena.type.eval) + ";\n";
            }
            return "";
        }
        /**
         * Eval Standarts
         * $val$val$val
         * $$$global_var
         * $$keyval
         *
         * $   -> self
         * $$  -> array self
         * $$$ -> global self
         *
         * @$   -> string or htmlElement
         * @$$$ -> string or htmlElement
         *
         *
         * Global   -> global data
         * Self     -> self data. change in { self= xyz }
         * Keys      -> for each keys
         * ___lastForKey   -> Last For Key
         *
         * {{  }}  -> complie previusly
         *
         * -----------------------------------------------------------
         */
        /**
         * EvalOuter
         */
        function EvalOuter(script) {
            // {{ previusly }}
            var mat = null;
            // @$$$var
            if ((mat = script.match(/\@\$\$\$([\w\_]+)/))) {
                return "Global[" + str(mat[0]) + "]";
            }
            // @$$var
            if ((mat = script.match(/\@\$([\w\_]+)/))) {
                return "Self[" + str(mat[0]) + "]";
            }
            // @{{ var }}
            if ((mat = script.match(/\@\{\{/))) {
                mat = script.matchRequirsive("{{", "}}");
                return EvalInner(mat[1]);
            }
            while ((mat = script.matchRequirsive("{{{", "}}}"))) {
                script = script.replace(mat[0], "\`+" + EvalInner(mat[1]) + "+\`");
            }
            while ((mat = script.matchRequirsive("{{", "}}"))) {
                script = script.replace(mat[0], "\`+" + EvalInner(mat[1]) + "+\`");
            }
            for (let i = 0; i < EvalChangeList.length; i++) {
                let ch = EvalChangeList[i];
                script = EvalChange(ch.reg, script, "\`+" + ch.prev, ch.next + "+\`", ch.split, ch.join);
            }
            return "\`" + script + "\`";
        }
        /**
         * Eval Inner Return variables
         */
        function EvalInner(script) {
            // {{ previusly }}
            var mat = null;
            while ((mat = script.matchRequirsive("{{{", "}}}"))) {
                script = script.replace(mat[0], EvalInner(mat[1]));
            }
            for (let i = 0; i < EvalChangeList.length; i++) {
                let ch = EvalChangeList[i];
                script = EvalChange(ch.reg, script, ch.prev, ch.next, ch.split, ch.join);
            }
            while ((mat = script.matchRequirsive("{{", "}}"))) {
                script = script.replace(mat[0], EvalInner(mat[1]));
            }
            return script;
        }
        const EvalChangeList = [{
                reg: /\$\$\$([\w\_\$\.]+)/,
                prev: "Global",
                split: /[\$\.]/,
                join: "\"][\"",
                next: ""
            }, {
                reg: /\$\$\$([\w\_]+)/,
                prev: "Global",
                next: ""
            }, {
                reg: /\$\$([\w\_]+)/,
                prev: "Keys",
                next: ""
            }, {
                reg: /\$\$/,
                prev: "___lastForKey",
                next: ""
            }, {
                reg: /\$([\w\_\$\.]+)/,
                prev: "Self",
                split: /[\$\.]/,
                join: "\"][\"",
                next: ""
            }, {
                reg: /\$([\w\_]+)/,
                prev: "Self",
                next: ""
            }, {
                reg: /\$/,
                prev: "Self",
                next: ""
            }];
        function EvalChange(reg, script, prev, next, split = null, join = "") {
            var mat = null;
            while ((mat = script.match(reg)) != null) {
                if (mat.length > 1) {
                    var list = mat[1];
                    if (split != null)
                        list = list.split(split).join(join);
                    script = script.replace(mat[0], prev + "[\"" + list + "\"]" + next);
                    // selfData['name']
                }
                else {
                    script = script.replace(mat[0], prev + next);
                }
            }
            return script;
        }
        /**
         * str
         */
        function str(string) {
            return "\"" + string.toString().replaceAll("\"", "\\\"") + "\"";
        }
    })(BrowserView = Asenac.BrowserView || (Asenac.BrowserView = {}));
})(Asenac || (Asenac = {}));
