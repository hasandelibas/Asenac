namespace Asenac{


    export function GetJsonAsenac(code: string): Array<JsonAsenac.JsonAsena> {
        return JsonAsenac.GetJsonAsenac(code)
    }

    export namespace JsonAsenac{

        export function GetJsonAsenac( code:string ) : Array< JsonAsena > {
            return  ToAsenaJson( PreAsenac.GetPreAsenac(code) )
        }

        export interface JsonAsena{
            code : string,
            line : number,
            type : AsenaJsonType,
            children : Array<JsonAsena>
        }


        /**
         * Main ToAsenaJson Function
        */
        const ToAsenaJson  = function( list: Array< PreAsenac.CodeTree >  ) : Array<JsonAsena>{
            let children : Array<JsonAsena>= [] 
            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                const code = element.code.trimLeft();//.trim();
               
                let child: JsonAsena = {
                    code: code,
                    line: element.line,
                    children: [],
                    type:null
                }

                child.type = ToAsenaJson._Single(code);

                /*
                if(child.type.type=="Html" && child.type.html.trim()==""){
                    //@ts-ignore
                    child.type.html = child.children[0]
                    return;
                }
                */
                

                if(element.children.length>0)
                    child.children = ToAsenaJson(element.children)
                
                children.push(child);
            }

            // Update If, Else If, Else Condution

            let i = -1;
            while (i + 1 < children.length) {
                i++;

                const element = children[i];
                if(element.type.type =="If"){
                    let ifCondution : JsonAsena = {
                        code:element.code,
                        line:element.line,
                        children:element.children,
                        type:{
                            type:"If",
                            ifParent:element.type.ifParent,
                            condution:element.type.condution
                        }
                    }

                    element.type = 
                        {
                            type: "IfAll",
                            condutionChildren: [],
                            "ifParent": element.type.ifParent
                        };

                    element.children=[];
                    element.type.condutionChildren.push(ifCondution);
                    let ifAll = element.type;

                    for (let j = i+1; j < children.length; j++) {
                        const element_else = children[j];
                        if(element_else.type.type=="Else" || element_else.type.type=="ElseIf"){
                            ifAll.condutionChildren.push( children.popAt(j) )
                            j--;
                        }else{
                            break
                        }
                    }
                }
            }


            return children;
        }


        ToAsenaJson._Single = function(code:string):AsenaJsonType{
            let preCode = code.substr(0,2);
            let afterCode = code.substr(2);
            let type :AsenaJsonType;

            if(preCode=="::"){
                type = ToAsenaJson.For(code)
            }else if(preCode==":?"){
                type = ToAsenaJson.If(code)
            }else if(preCode==":!" && afterCode!=""){
                type = ToAsenaJson.ElseIf(code)
            }else if(preCode==":!" && afterCode==""){
                type = ToAsenaJson.Else(code)
            }else if(preCode==":#"){
                type = ToAsenaJson.Replace(code)            
            }else if(preCode==":+"){
                type = ToAsenaJson.Append(code)
            }else if(preCode==":>"){
                type = ToAsenaJson.SetSelector(code)
            }else if(preCode=="->"){
                type = ToAsenaJson.Goto(code)
            }else if(code.substr(0,1)==":"){
                type = ToAsenaJson.ReturnObject(code)
            }else if(code.substr(0,1)=="-"){
                type = ToAsenaJson.Eval(code)
            }else if(code.substr(0,1)==">"){
                type = ToAsenaJson.Text(code)
            }else if(code.substr(0,5)=="html."){
                type = ToAsenaJson.Html(code);
            }else{
                type = ToAsenaJson.Crel(code)
            }
            return type;
        }

        
        export interface _CrelJson{
            crel:{
                innerHtml       ?:string,
                tagName         ?:string,
                className       ?:string,
                id              ?:string,
                attrs           ?:Array<{data:string,value:string}>
            }
            type:"Crel"
        }

        /**
         * Create Element Object
         */
        ToAsenaJson.Crel = function (script:string) : _CrelJson{
            var realScript=script;
            //try{


            var retCrel : _CrelJson = { crel:{}, type:"Crel"  }
            var ret = retCrel.crel;

            var mat = null;

            // Calc Inner HTML
            if( (mat= script.indexOf(">")) ){
                var _tagIndex = mat;

                var _removedBracket = script.toString();
                while( (mat = _removedBracket.matchRequirsive("[","]"))!=null ){
                    if(mat[2]>_tagIndex) break;
                    _removedBracket = _removedBracket.replace(mat[0],"")
                    _tagIndex = _removedBracket.indexOf(">");
                }

                mat = _removedBracket.match(/\>(.*)$/)
                ret.innerHtml = cval( mat,[1],"")
                if(mat!=null)
                    script = script.replace(mat[0],"")
            }


            
            


            let attrList = [];
            mat = null;
            while( (mat = script.matchRequirsive("[","]"))!=null ){
                attrList.push(mat[1]);
                script = script.replace(mat[0],"")
            }

            ret.tagName = cval( script.match(/^([^\#\.\[\>]+)/), [0] , Asenac.DEFAULT_TAG );
            
            ret.id        = cval ( script.match(/\#([^\.\#\[\>]*)/) , [1] , null); 

            if ( ret.id !=null )
                ret.id = ret.id.replace("#", "") 
                    
            let classList = script.match(/\.([^\.\#\[\>]*)/gi)



            
            ret.className = null;
            if(classList!=null){
                for(var i = 0 ; i< classList.length ; i++){
                    classList[i] = classList[i].replace(".", "");
                }
                ret.className = classList.join(" ")
            }    

            ret.attrs = []

            if(attrList!=null){
                for(var i = 0 ; i< attrList.length ; i++){
                    var attr = attrList[i];
                    let data="",value=""
                    var equalIndex = attr.indexOf("=");
                    if(equalIndex==-1){
                        data = attr;
                    }else{
                        data = attr.substr(0,equalIndex).trim()
                        value = attr.substr(equalIndex+1)
                    }
                    ret.attrs.push({data:data,value:value});		
                }
            }

            
            
            /*
            }catch(e){
                console.warn("Crel: error in\n",realScript);
            }
            */
            
            if(ret.className==null) ret.className="";
            if(ret.id==null) ret.id="";
            if(ret.tagName==null) ret.tagName="";
            if(ret.innerHtml==null) ret.innerHtml="";
            
            ret.tagName = ret.tagName.trim()
            ret.id      = ret.id.trim()
            ret.className = ret.className.trim()
            return { crel: ret , type:"Crel" };


        }

        export interface _ForJson{
            forEval ?:string
            forKey  ?:string
            forParent?: _CrelJson | null
            type:"For"
        }
        /* #####################    FOR     ##########################
            :: iterator : key
        */
        ToAsenaJson.For = function(code:string): _ForJson{
            let decode = code.substr(2); // -> $forData
            let forEval = decode; // -> forEval
            let forKey = ""; // -> $$anahtar
            let forParent = "";
            var mat = null;
            // :
            mat = decode.split(/(?<=[^\\]):/);
            forEval = mat[0];
            forKey = cval(mat,[1],"").trim();
            
            forParent = cval(mat, [2], "");
            let crelElement = forParent.trim()!="" ? ToAsenaJson.Crel(forParent) : null ;
            
            
            return {
                forEval:forEval,
                forKey :forKey,
                forParent: crelElement,
                type:"For"
            }
        }


        export interface _IfAllJson{
            ifParent : _CrelJson;
            condutionChildren: Array<JsonAsena>
            type:"IfAll"
        }

        export interface _IfJson{
            condution ?:string,
            ifParent : _CrelJson | null
            type:"If"
        }

        /* #####################    IF     ##########################
            :? If Eval
        */
        ToAsenaJson.If = function(code:string): _IfJson{
            let decode = code.substr(2); // -
            decode = decode.trim();
            let ifStatement = "";
            let createElement = Asenac.DEFAULT_TAG;
            let splitted =decode.split(/(?<=[^\\]):/)
            ifStatement = splitted[0]
            
            var crelObj = null;
            createElement = cval(splitted, [1], "");
            if(createElement.trim()!="")
                crelObj = ToAsenaJson.Crel(createElement);
            return { 
                condution: ifStatement , 
                ifParent: crelObj, 
                type:"If" 
            }
        }



        interface _ElseIfJson{
            condution ?:string,
            type:"ElseIf"
        }
        /* #####################    ELSE IF     ##########################
            :! Else If Eval
        */
        ToAsenaJson.ElseIf = function(code:string): _ElseIfJson{
            var decode = code.substr(2); // -
            decode=decode.trim();
            return { 
                condution:decode ,
                type: "ElseIf"
            }
        }




        interface _ElseJson{
            else ?: true
            type:"Else"
        }
        /* #####################    ELSE     ##########################
            :!
        */
        ToAsenaJson.Else = function(code:string): _ElseJson{
            return  { 
                else: true,
                type: "Else"
            }
        }


        interface _EvalJson{
            lang?:"-php" | "-node" | "-browser",
            eval?:string;
            type:"Eval"
        }

        /* #####################    EVAL     ##########################
            - eval
            -php eval
            -node eval
            -browser eval
        */

        ToAsenaJson.Eval = function(code:string):_EvalJson{
            if(code.startsWith("-php") ){
                return { 
                    lang:"-php" , 
                    eval: code.replace("-php","").trim() ,
                    type:"Eval"
                }
            }
            if(code.startsWith("-node") ){
                return { 
                    lang:"-node" , 
                    eval: code.replace("-node","").trim() ,
                    type:"Eval"
                }
            }
            if(code.startsWith("-browser") ){
                return { 
                    lang:"-browser" , 
                    eval: code.replace("-browser","").trim() ,
                    type:"Eval"
                }
            }
            return { 
                lang: Asenac.DEFAULT_EVAL_LANG  , 
                eval: code.replace("-","").trim() ,
                type: "Eval"
            }
        }



        interface _ReplaceJson{
            replace ?:string,
            type:"Replace"
        }
        
        /* #####################    REPLACE     ##########################
            :# id_name
        */

        ToAsenaJson.Replace = function(code:string):_ReplaceJson{
            var decode = code.substr(2); // -
            return { 
                replace:decode, 
                type:"Replace" 
            }
        }


        interface _GotoJson{
            goto ?:string;
            params ?:string[],
            type:"Goto"
        }
        /* #####################    Goto     ##########################
            -> ViewName > ViewParameters
        */
        ToAsenaJson.Goto = function(code:string):_GotoJson{
            var decode = code.substr(2); // -
            //var match = decode.match(/([^\>]*)\>(.*)/i)
            var splitted = decode.split(">");
            var gotoParam = splitted.popAt(0).trim();
            
            // contains bug
            var params = [splitted.join(">")];
            // var params = splitted;

            return { 
                goto:gotoParam,
                params:params,
                type:"Goto"
            }
        
        }


        /* #####################    Text     ##########################
            > Hello World
        */
        export interface _TextJson{
            text ?:string,
            type:"Text"
        }
        ToAsenaJson.Text = function(code: string):_TextJson{
            let decode = code.trimLeft().substr(1);
            return {
                text:decode,
                type:"Text"
            }
        }

        /* #####################    Goto     ##########################
            : title : div.title> $title
        */
        export interface _ReturnObjectJson{
            name:string,
            obj : AsenaJsonType
            type:"ReturnObject"
        }
        
        ToAsenaJson.ReturnObject = function(code:string):_ReturnObjectJson{
            var list = code.split(":");
            list.popAt(0);
            var name = list.popAt(0).trim();
            var objStr = list.join(":").trimLeft();
            var obj = ToAsenaJson._Single(objStr)
            return {
                type:"ReturnObject",
                name: name,
                obj: obj
            }
        }

        /* #####################    Html     ##########################
            html.{
                <div> Hello World </div>
            }
        */
        export interface _HtmlJson{
            html:string
            type:"Html"
        }
        
        ToAsenaJson.Html = function(code:string):_HtmlJson{
            code = code.trim().substr(5);
            return{
                html: code.matchRequirsive("{","}")[1],
                type: "Html"
            }
        }

        /* #####################    Append     ##########################
            :+ #header (Css Selector)
                div> Append Header
        */
        export interface _AppendJson{
            selector:string
            type:"Append"
        }
        
        ToAsenaJson.Append = function(code:string):_AppendJson{
            var decode = code.substr(2).trim(); // -
            return { 
                selector:decode, 
                type:"Append" 
            }
        }

        /* #####################    Set Selector     ##########################
            :> ul.li
                > This is list 
        */
        export interface _SetSelectorJson{
            selector:string
            type:"SetSelector"
        }
        
        ToAsenaJson.SetSelector = function(code:string):_SetSelectorJson{
            var decode = code.substr(2).trim(); // -
            return { 
                selector:decode, 
                type:"SetSelector" 
            }
        }

        

        export type AsenaJsonType = _CrelJson | _TextJson |
                            _ForJson |
                            _IfAllJson | _IfJson | _ElseIfJson | _ElseJson |
                            _GotoJson |
                            _ReplaceJson | _AppendJson | _SetSelectorJson |
                            _EvalJson | 
                            _ReturnObjectJson |
                            _HtmlJson;


        


    }

    

    export namespace PreAsenac {


        /**
         * Return number of indent
         * @param line Code
         */

        function GetIndentCount(line: string): number {
            var defIndentLen = Asenac.DEFAULT_INDENT_LENGTH;
            var i = 0, j = 0;
            for (i = 0; i < line.length; i++) {
                if (line[i] == '\t') j += defIndentLen;
                else if (line[i] == " ") j += 1;
                else break;
            }
            return j / defIndentLen;
        }

        export function ConvertScriptObject(code: string):Array<CodeTree> {
            code = code.replaceAll(/\n\s*\.\./,"");
            var codes = code.splitOuter( "\n","{","}" );
            var scriptList: Array<CodeTree> = []
            for (let i = 0; i < codes.length; i++) {
                const element = codes[i];
                let indentCount = GetIndentCount(element)
                
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
                })
            }
            return scriptList;
        }

        
        /**
         * Asenac Code Tree Line Object
         */
        export interface CodeTree {
            line: number,
            code: string,
            indent: number,
            children: Array<CodeTree>
        }




        function ConvertScriptTree(list: Array<CodeTree>, start: number = 0, index: number = 0): Array<CodeTree> {
            //console.log( "--",start,index )
            let children: Array<CodeTree> = [];
            let continueAt = Infinity;
            for (let i = start; i < list.length; i++) {
                const element = list[i];
                if (continueAt < element.indent) {
                    continue;
                }
                if( element.code.trim()=="html." ){
                    continueAt=index;
                    children.push(element);
                    continue;
                }
                if (element.indent > index ) {
                    children[children.length - 1].children = ConvertScriptTree(list, i, element.indent);
                    continueAt = index
                }
                if (element.indent < index) {
                    break;
                }
                if (element.indent == index) {
                    children.push(element)
                    continueAt = Infinity;
                }
            }
            return children;
        }

        export function GetPreAsenac(code: string): Array<PreAsenac.CodeTree> {
            return ConvertScriptTree(ConvertScriptObject(code))
        }
     

    }

    


}