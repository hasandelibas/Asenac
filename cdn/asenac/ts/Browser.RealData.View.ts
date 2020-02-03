interface Node{
    _asenac_on_triggers : Array<{id:number,realdata:RealData.RealData}>
}
namespace Asenac{
    export namespace BrowserViewRealData{
        interface AsenaViewDataGram{
            data:any,datas:Array<any>,keys,lastKey,path:string
        }
        

        export const complie = function( page:string, ...datas ):DocumentFragment{
            let jsonAsena = Asenac.PagesJson[page];

            CrelObjs  = [];
            let doc = Complie(jsonAsena, {
                data: datas[0],
                datas: datas,
                keys: [],
                lastKey: null,
                path: ""
            });
            
            for (const key in CrelObjs) {
                if (CrelObjs.hasOwnProperty(key)) {
                    const element = CrelObjs[key];
                    this[key] = element;        
                }
            }

            return doc;
        }
        


        
        
        let CrelObjs = [];
        
        function Complie( code: Array<  Asenac.JsonAsenac.JsonAsena > , datagram:AsenaViewDataGram) : DocumentFragment {
            let list : DocumentFragment = document.createDocumentFragment()
        
        
        
            //console.log("AsenaView start")
        
            for (let i = 0; i < code.length; i++) {
                const jsonAsena = code[i];
                //console.log(jsonAsena.code)
                try{
        
                    let child= ComplieSingle(jsonAsena,datagram);
                    if(child!=null)
                        list.appendChild(child);
                    
                    //[ FOR, EVAL , IFALL , REPLACE, GOTO,"ReturnObject"]
                    //if( ["For","IfAll","Eval","Replace","Goto","ReturnObject"].indexOf(jsonAsena.type.type)  != -1 ){
                    if(jsonAsena.type.type=="Crel" || 
                        (jsonAsena.type.type=="ReturnObject" && jsonAsena.type.obj.type=="Crel" )
                    ){
                        if( jsonAsena.children.length>0 ){
                            let children = Complie(jsonAsena.children ,datagram )
                            //console.log(children)
                            list.lastChild.appendChild( children )
                            //Append( list[list.length-1] as HTMLElement , children  )
                        }
                    }
                }catch(e){
                    console.warn("Error Text\n",jsonAsena.code,"\nLine:",jsonAsena.line,);
                    console.error(e);
                }
            }
        
        
        
            return list;
        }
        
        
        function ComplieSingle(jsonAsena: Asenac.JsonAsenac.JsonAsena, datagram:AsenaViewDataGram):DocumentFragment|HTMLElement|Element|Text|Node{
        
            if( jsonAsena.type.type == "Crel" ){
                return CreateElement(jsonAsena.type ,datagram) 
            }else if( jsonAsena.type.type == "Text" ){
                return CreateText(jsonAsena.type ,datagram) 
            }else if( jsonAsena.type.type == "ReturnObject" ){
                
                let jsAsena:Asenac.JsonAsenac.JsonAsena = {
                    type:jsonAsena.type.obj,
                    line:jsonAsena.line,
                    code:jsonAsena.code,
                    children:jsonAsena.children
                }
                let el = ComplieSingle(jsAsena,datagram);
                CrelObjs[jsonAsena.type.name] = el;
                return el
            }else if( jsonAsena.type.type == "For" ){
                return For(jsonAsena, datagram);
                //continue
            }else if( jsonAsena.type.type=="Eval" && jsonAsena.type.lang=="-browser" ){
                EvalVariablesInner( jsonAsena.type.eval,datagram ).evaled as Iterable<any>
            }else if( jsonAsena.type.type == "IfAll" ){
                return If(jsonAsena.type, datagram)
                //continue
            }else if(jsonAsena.type.type=="Replace"){
                var idElement = document.getElementById(jsonAsena.type.replace);
                if(idElement==null) idElement = IdList[jsonAsena.type.replace];
                if(idElement){
                    idElement.empty();
                    idElement.appendChild( Complie( jsonAsena.children , datagram ) )
                }else{
                    console.warn("#",jsonAsena.type.replace," not found"); 
                }
                //continue
            }else if(jsonAsena.type.type=="Goto"){
                return Goto(jsonAsena,datagram);
                //continue
            }
            return null;
            
        }
        
        
        function CreateElement(params: Asenac.JsonAsenac._CrelJson,datagram:AsenaViewDataGram) : HTMLElement {
            let param   = params.crel;
            let element = document.createElement(param.tagName);
            let evaledVariables : Array<{path: string;realdata: RealData.RealData;}> = [];
            element.innerHTML="";
        
            element._asenac_on_triggers = [];
        
            if(param.id!="" && param.id != null){
                element.setAttribute("id", param.id);
                IdList[param.id] = element;
            }
            if(param.className!="" && param.className != null)
                element.setAttribute("class", param.className);
            if(param.attrs != null){
                for (let i = 0; i < param.attrs.length; i++) {
                    const attr = param.attrs[i];
                    let eval = EvalVariablesOuter( attr.value, datagram );
                    element.setAttribute ( attr.data ,  eval.evaled  )
                    evaledVariables = evaledVariables.concat(eval.variables);
                }
            }
            if( param.innerHtml != null &&  param.innerHtml!="" ){
                let evalHtml = EvalVariablesOuter( param.innerHtml , datagram );
                //@ts-ignore
                if(evalHtml.evaled instanceof Node){
                    element.append( evalHtml.evaled ) 
                }else{
                    element.innerHTML += evalHtml.evaled;
                    //element.append( evalHtml.evaled );
                    //element.appendChild( new Text( evalHtml.evaled ) ) 
                }
                evaledVariables = evaledVariables.concat(evalHtml.variables);
            }
        
            evaledVariables.distinct( (a,b)=>a.path==b.path );
            let vars = evaledVariables;
            for (let i = 0; i < vars.length; i++) {
                const key = vars[i];
                
                var id = key.realdata.on( key.path , function () {
                    UpdateElement(element,params,datagram )
                })
                element._asenac_on_triggers.push({ id: id, realdata:key.realdata} );
        
            }
        
            
            
            return element;
        }
        
        
        
        function  UpdateElement(element: HTMLElement, params: Asenac.JsonAsenac._CrelJson,datagram:AsenaViewDataGram ) {
            let param   = params.crel;
            
            
            if(param.id!="" && param.id != null)
                element.setAttribute("id", param.id);
            if(param.className!="" && param.className != null)
                element.setAttribute("class", param.className);
            if(param.attrs != null){
                for (let i = 0; i < param.attrs.length; i++) {
                    const attr = param.attrs[i];
                    let eval = EvalVariablesOuter( attr.value, datagram );
                    element.setAttribute ( attr.data ,  eval.evaled  )
                }
            }
            if (param.innerHtml != "" && param.innerHtml != null ){
                element.firstChild.remove()
                element.prepend( new Text( EvalVariablesOuter( param.innerHtml,datagram ).evaled ) ) 
            }
            
        }
        
        
        
        
        function CreateText(param: Asenac.JsonAsenac._TextJson,datagram : AsenaViewDataGram ) : Text {
            let evaled = EvalVariablesOuter( param.text,datagram )
        
            let node = document.createTextNode( evaled.evaled )
            node._asenac_on_triggers =[];
            let code = param.text;
        
            var vars = evaled.variables
            vars.distinct( (a,b)=>a.path==b.path )
            for (let i = 0; i < vars.length; i++) {
                const key = vars[i];
        
                var id = key.realdata.on(key.path, function () {
                    node.textContent = EvalVariablesOuter(param.text, datagram).evaled
                })
                node._asenac_on_triggers.push({ id:id , realdata:key.realdata });
            }
        
            return node;
            
        }
        
        
        
        function If(jsonAsena: Asenac.JsonAsenac._IfAllJson, datagram: AsenaViewDataGram): Element | DocumentFragment{
            
            //if(jsonAsena.type.type=="IfAll"){

        
            
            let parent : Element | DocumentFragment = null;
            let isDocumentFragment = false; 
            if( jsonAsena.ifParent) {
                parent = CreateElement(jsonAsena.ifParent,datagram);
            }else{
                parent = document.createDocumentFragment();
                isDocumentFragment=true;
            } 
            let condution = null;
        
        
            function UpdateIf(){
                parent = <Element> parent;

                for (let i = 0; i < jsonAsena.condutionChildren.length; i++) {
                    const element = jsonAsena.condutionChildren[i];

                    if(element.type.type=="If" ||  element.type.type=="ElseIf"){
                        let if_bool_2 = EvalVariablesInner(element.type.condution, datagram).evaled;
                        if(if_bool_2){
                            if(condution!==i){
                                RemoveTriggers(parent, false);
                                parent.empty();
                                parent.appendChild(Complie(
                                    element.children,
                                    datagram
                                ))
                            }
                            condution = i;
                            return;
                        }
                    }
                    if(element.type.type=="Else"){
                        if(condution!==i){
                            RemoveTriggers(parent, false);
                            parent.empty();
                            parent.appendChild(Complie(
                                element.children,
                                datagram
                            ))
                        }
                        condution  =i;
                        return;
                    }
                }
                condution=null;
                RemoveTriggers(parent, false);
                parent.empty()

            }
        
            UpdateIf();
            
            if(isDocumentFragment==false){
                var vars = [];
                for (let i = 0; i < jsonAsena.condutionChildren.length; i++) {
                    const element = jsonAsena.condutionChildren[i];
                    if( element.type.type=="If" || element.type.type=="ElseIf"){
                        vars.concat( EvalVariablesInner(element.type.condution, datagram).variables )
                    }
                    
                }
            
                vars.distinct( (a,b)=>a.path==b.path )
                for (let i = 0; i < vars.length; i++) {
                    const key = vars[i];
                    
                    //console.log("IF Variables:",rp)
                    var id = key.realdata.on(key.path, function () {
                        //console.log("Update Element", rp)
                        UpdateIf()
                    })
                    parent._asenac_on_triggers.push({id:id,realdata:key.realdata});
                }
            
            }
        
            
        
            return parent;

        

        }
        
        
        function For(jsonAsena: Asenac.JsonAsenac.JsonAsena, datagram: AsenaViewDataGram): Element | DocumentFragment {
        
            jsonAsena.type = jsonAsena.type as Asenac.JsonAsenac._ForJson;
        
            let forEval = jsonAsena.type.forEval;
            let forKey = jsonAsena.type.forKey;
            let forParent = jsonAsena.type.forParent;
        
            let parentNode : Element | DocumentFragment = document.createDocumentFragment();
            if(forParent!=null)
                parentNode = CreateElement(forParent, datagram);
            
            let removeTrigger : number  = null, newItemTrigger : number = null;
            
            let evaled = EvalVariablesInner(forEval, datagram);
            function ReCreateFor(){
                let evaled = EvalVariablesInner(forEval, datagram);
        
                let iterators = evaled.evaled  as Iterable<any>;
            
                // For RealData
                let newPath = datagram.path;
                let evalVariables = evaled.variables;
                let isRealDataVariable = false;
                let realData = null;
                
        
                if( iterators!=null && typeof(iterators)=="object" && RealData._PATH_ in iterators ){
                    newPath = iterators[RealData._PATH_];
                    isRealDataVariable = true;
                    realData = iterators[RealData._REAL_DATA_];
                }
                
                let childrenList = []
                for (let key in iterators) {
                    if (iterators.hasOwnProperty(key)) {
                        if( !isNaN( parseInt(key) )  ) {
                            //@ts-ignore
                            key = parseInt(key);
                        }
                        const iter = iterators[key];
                        let _keys = Object.assign({}, datagram.keys);
                        _keys[forKey] = key;
            
                        //datagram.keys[forKey] = key;
                        
                        let childPath;
                        if( isRealDataVariable ){
                            childPath = newPath + "/" + key
                        }else{
                            childPath = datagram.path;
                        }
                        //console.log("----------------------")
                    
            
                        let child = Complie(jsonAsena.children, {
                            data: iter,
                            datas: datagram.datas,
                            keys: _keys,
                            lastKey: key,
                            path: childPath
                        })
                        let childrenArray = Array.from(child.children)
                        childrenList.push(childrenArray)
            
                        parentNode.appendChild(child)
            
                    }
                }
                
                if( isRealDataVariable && forParent!=null ){
        
                
                                    
                        // For RealData remove item
                        removeTrigger = realData.on(newPath + "/-", function (data, index, count) {
                            console.log("Remove Element", count)
                            for (let c = 0; c < count; c++) {
                                if (index + c in childrenList)
                                    for (let i = 0; i < childrenList[index + c].length; i++) {
                                        const element = childrenList[index + c][i];
                                        RemoveTriggers(element)
                                        element.remove()
                                    }
                            }
                            childrenList.splice(index, count)
                        })
                    
                        // For RealData add new item
                        newItemTrigger = realData.on(newPath + "/+", function (data, index) {
                            console.log("Add Element", data.length)
                            if (data.length == 0) return;
                    
                            for (let c = 0; c < data.length; c++) {
                                const element = data[c];
                                let key = index + c
                                datagram.keys[forKey] = key;
                    
                                let child = Complie(jsonAsena.children, {
                                    data: data[c],
                                    datas: datagram.datas,
                                    keys: datagram.keys,
                                    lastKey: key,
                                    path: newPath + "/" + key
                                })
                    
                                var childrenArray = Array.from(child.children)
                                if (childrenList.length != 0 && key < childrenList.length ) {
                                    parentNode.insertBefore(child, childrenList[0][key]);
                                } else {
                                    parentNode.appendChild(child)
                                }
                                childrenList.splice(index, 0, childrenArray)
                    
                            }
                    
                        })
                        parentNode._asenac_on_triggers.push({id:newItemTrigger,realdata:realData});
                        parentNode._asenac_on_triggers.push({id:removeTrigger,realdata:realData});
        
        
        
                }
                
            
            }
            
            
        
            ReCreateFor();
            if(parentNode instanceof Element){
                for (let i = 0; i < evaled.variables.length; i++) {
                    const key = evaled.variables[i];
                    var id = key.realdata.on( key.path , function (data) {
                        key.realdata.removeEvent(removeTrigger);
                        key.realdata.removeEvent(newItemTrigger);
                        //@ts-ignore
                        RemoveTriggers(parentNode,false)
                        parentNode.empty();
                        ReCreateFor();
                    })
                    parentNode._asenac_on_triggers.push({id:id,realdata:key.realdata})
                }    
            }
        
            return parentNode;
        
        }
        
        
        function Goto(jsonAsena: Asenac.JsonAsenac.JsonAsena, datagram: AsenaViewDataGram): Node | DocumentFragment{
            if(jsonAsena.type.type=="Goto"){
                if(jsonAsena.type.goto in PagesJson){
                    var evalObj = {evaled:null,variables:[]}
                    var params = []
                    for (let i = 0; i < jsonAsena.type.params.length; i++) {
                        const element = jsonAsena.type.params[i];
                        params.push(
                            EvalVariablesInner(element,datagram).evaled
                        )
                    }
                    
                    
                    if( evalObj.evaled!=null && typeof(evalObj.evaled)=="object" && RealData._PATH_ in evalObj.evaled ){
                        // Update
                    }
        
                    let evalPage = EvalVariablesOuter(jsonAsena.type.goto,datagram);
                    let code =  PagesJson[ evalPage.evaled ];
                    //let parent = CreateElement({type:"Crel",crel:{tagName:Asenac.DEFAULT_TAG}},datagram);
                    let parent = document.createDocumentFragment();
                    
                    if(params.length==0){
                        params = datagram.datas;    
                    }
                    
                    parent.appendChild( Complie(code,{
                        data: params[0],
                        datas: params,
                        path: datagram.path,
                        lastKey:null,
                        keys:[] 
                    }));
                    
                    /*
                    for (let i = 0; i < evalObj.variables.length; i++) {
                        const element = evalObj.variables[i];
                        var id = datagram.realData.on(element,function(){
                            RemoveTriggers(parent,datagram.realData,false)
                            parent.empty()
                            parent.appendChild( Complie(code,datagram) );
                        })
                        parent._asenac_on_triggers.push(id);
                    }
                    */
        
                    return parent;
        
                    //AsenaView(jsonAsena.type)
                }else{
                    console.warn(jsonAsena.type.goto +" not found in pages");
                }
            }
        }
        
        
        
        function Global(path:string,datagram:AsenaViewDataGram):{evaled:any,isRealData:boolean,realdata?:RealData.RealData} {
            var ret = null;
            for (let i = 0; i < datagram.datas.length; i++) {
                const element = datagram.datas[i];
                if( element!=null && typeof(element)=="object" && RealData._PATH_ in element ){
                    var realData = element[RealData._REAL_DATA_];
                    if( (ret=realData.get("/"+path)) != RealData._NONE_ ){
                        return { evaled: ret, isRealData:true , realdata:realData  }
                    }
                }else{
                    var pathArray = path.split(/\/+/).filter(e=>e.trim()!="");
                    if( (ret =cval(element, pathArray , null ) ) !==null ){
                        return {evaled: ret , isRealData:false};
                    }
                }
            }
            return { evaled: null, isRealData:false} ;
        }
        
        
        
        
        function RemoveTriggers(el:Element,startMe:boolean=true) {
            if( startMe &&  el._asenac_on_triggers){ 
                for (let i = 0; i < el._asenac_on_triggers.length; i++) {
                    const trigger = el._asenac_on_triggers[i];
                    trigger.realdata.removeEvent(trigger.id);
                }
                el._asenac_on_triggers = []
            }
            for (let i = 0; i < el.childNodes.length; i++) {
                const element = el.childNodes[i];
                /*
                for (let i = 0; i < element._asenac_on_triggers.length; i++) {
                    const trigger = element._asenac_on_triggers[i];
                    trigger.realdata.removeEvent(trigger.id);
                }
                element._asenac_on_triggers = []
                */
                if(element instanceof Element)
                    RemoveTriggers(element,true);
            }
        }

        
        
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
        
        function EvalVariablesOuter(___script:string,datagram:AsenaViewDataGram):{ evaled:string, variables:Array<{path:string,realdata:RealData.RealData}> }{
            let ___D:any = datagram.data , // First Data
                ___G:any = datagram.datas , // Globals
                ___FK:{ [key:string] : string} = datagram.keys,
                ___LFK:string = datagram.lastKey;
            
            
            var mat;
            //  @$$$  Global DOM Element Or String
            if( (mat=___script.match(/\@\$\$\$([\w\_\$]*)/)) ){
                var ___path = datagram.path  + "/" + mat[1].split(/[\$\.]/).join("/");
        
                let ___evaled = Global(___path,datagram);
                
                let varlist= [];
                if( ___evaled.isRealData ){
                    varlist.push( { path:___path , realdata:___evaled.realdata});
                }
                return { evaled:___evaled.evaled, variables:varlist };
            }
        
            //  @{{{ NODE | String }}} |   DOM Element Or String
            if( (mat=___script.indexOf("@{{{")) > -1 ){
                let decode = ___script.substr(mat+1);
                return EvalVariablesInner( decode.matchRequirsive("{{{","}}}")[1] , datagram);
             }
             //  @{{ NODE | String }} |   DOM Element Or String
             if( (mat=___script.indexOf("@{{")) > -1 ){
                let decode = ___script.substr(mat+1);
                let ret = EvalVariablesInner( decode.matchRequirsive("{{","}}")[1] , datagram);
                ret.variables = [];
                return ret;
             }
             /*
             if( (mat=___script.match(/\@\$([\w\_\$]*)/)) ){
                var ___path = datagram.path  + "/" + mat[1].split(/[\$\.]/).join("/");
                //@ts-ignore
                let ___evaled = Global(___path, { datas:[datagram.data] } );
                let varlist= [];
                if( ___evaled.isRealData ){
                    varlist.push( { path:___path , realdata:___evaled.realdata});
                }
                return { evaled:___evaled.evaled, variables:varlist };
            }
            */
        
            
            var ret: Array<{path:string,realdata:RealData.RealData}> = [];
        
            // {{{ $name }}} with real data options
            while( (mat = ___script.matchRequirsive("{{{","}}}") ) != null ){
                var ___e = EvalVariablesInner(mat[1],datagram);
                ___script = ___script.replace(mat[0] , ___e.evaled);
                ret = ret.concat(___e.variables);
            }
        
            // {{ $name }} with out real data options
            while( (mat = ___script.matchRequirsive("{{","}}") ) != null ){
                var ___e = EvalVariablesInner(mat[1],datagram);
                ___script = ___script.replace(mat[0] , ___e.evaled);
            }
        
        
        
            // Global Keys
            while( (mat = ___script.match(/\$\$\$([\w\_\$]+)/) ) != null ){
                var m = mat[1] as string;
                var path = m.split(/[\$\.]/).join("/") 
                var __evaled = Global(path,datagram);
                ___script = ___script.replace(mat[0],__evaled.evaled);
                if(__evaled.isRealData==true)
                    ret.push( { path: "/"+path , realdata:__evaled.realdata }  );
            }    
        
            // Foreach Keys
            while( (mat = ___script.match(/\$\$([\w\_\$]+)/) ) != null ){
                var m = mat[1] as string;
                ___script = ___script.replace(mat[0], EvalVariablesInner(mat[0],datagram).evaled );
            }
        
        
            // Name is : $name
            while( (mat = ___script.match(/\$([^ ]+)/) ) != null ){
                var ___e = EvalVariablesInner( mat[0] ,datagram )
                ___script = ___script.replace(mat[0],___e.evaled);
                ret = ret.concat(___e.variables);
            }
        
        
        
            if(___script.includes("$")){
                if( cval(datagram.datas,[0],{}) instanceof RealData.RealData ){
                    ret.push({ path: datagram.path , realdata:datagram.datas[0] });
                }
            }
            // SELF DATA Auto Eval
            ___script = ___script.replaceAll("$",___D);
        
            return {evaled:___script,variables:ret}
        }
        
        
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
        
        function EvalVariablesInner(___script:string,datagram:AsenaViewDataGram):{ evaled:any, variables:Array<{path:string,realdata:RealData.RealData}> } {
            
            
            let ___D:any = datagram.data ,
            ___G:any = datagram.datas ,
            ___FK:{ [key:string] : string} = datagram.keys,
            ___LFK:string = datagram.lastKey
        
        
        
            //var replaces : Array<{o:string,n:string}> = [];
            var mat;
            var ret : Array<{path:string,realdata:RealData.RealData}> = [];
        
            // {{{  $$$ASD{{ $ + 1 }}  }}} with realdata opt
            while( (mat = ___script.matchRequirsive("{{{","}}}") ) != null ){
                var ___e = EvalVariablesInner(mat[1],datagram);
                ___script = ___script.replace(mat[0] , ___e.evaled);
                ret = ret.concat(___e.variables);
            }    
        
            // {{  $$$ASD{{ $ + 1 }}  }}
            while( (mat = ___script.matchRequirsive("{{","}}") ) != null ){
                var ___e = EvalVariablesInner(mat[1],datagram);
                ___script = ___script.replace(mat[0] , ___e.evaled);
            }
            
        
            // Global Keys
            while( (mat = ___script.match(/\$\$\$([\w\_\$\.]+)/) ) != null ){
                var m = mat[1] as string;
                var path = m.split(/[\$\.]/).join("/") 
                var ___evaled = Global(path,datagram);
                ___script = ___script.replace(mat[0],"Global('"+path+"',datagram).evaled");
                if( ___evaled.isRealData==true){
                    ret.push( { path: "/"+path , realdata: ___evaled.realdata }  );
                }
            }
        
            // Foreach Keys
            while( (mat = ___script.match(/\$\$([\w\_\$]+)/) ) != null ){
                var m = mat[1] as string;
                ___script = ___script.replace(mat[0],"___FK['"+m+"']");
            }
        
            // Self Foreach Key
            ___script = ___script.replaceAll("$$",'___LFK');
        
        
            // Normal Datas
            while( (mat = ___script.match(/\$([\w\_\$\.]+)/) ) != null ){
                var m = mat[1] as string;
                m = m.split(/[\$\.]/).join("']['");
                ___script = ___script.replace(mat[0],"___D['"+m+"']");
                var ___path = datagram.path + "/" + mat[1].split(/[\$\.]/).join("/");
                //ret.push( )
                
                var ___evaled = Global(___path,datagram);
                
                if( ___evaled.isRealData ){
                    ret.push( { path:___path , realdata:___evaled.realdata});
                }
            }
        
             // Self Data
             if(___script.includes("$")){
                ___script = ___script.replaceAll("$","___D");
                if( cval(datagram.datas,[0],{}) instanceof RealData.RealData ){
                    ret.push({ path: datagram.path , realdata:datagram.datas[0] });
                }
            }
            var evalStr = eval("("+___script.toString()+")")
            
            return {evaled:evalStr,variables:ret}
        }
        
        
        
        
        let IdList = {} as { [x: string]: HTMLElement }
        
        
        
        
        
        
        
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
        
        
        
        
        
        
        
        
    }
}

