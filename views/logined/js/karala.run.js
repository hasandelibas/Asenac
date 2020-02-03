/**
 * ExportPlugin     // Return JS Plugin                                 /export-plugin
 * ExportLibrary    // Return JS Library                                /export-library
 * ExportProject    // Return {"index.html","libs.x":"JS FİLE", ...}    /export-project
 * Page             // Return Page Html                                 /page
 * Project          // Return Project Html                              /project
 */

const Karala_Run = {

    //host:"http://localhost",
    host:"",
/*
    error_html:`
<script>
(function(){
    var originalLog = console.log;
    console.log = function(...arg){

        if(window.parent!=window.parent){
            try{
                window.parent.window.ConsoleLogFromIframe.apply({},arguments);
            }catch(e){}
        }else{
            $.ajax({
                url: location.protocol + "//" + location.hostname + ":9001",
                data:{log:JSON.stringify(arguments),type:"log",loc:location.href},
                type:"post"
            });
        }

        originalLog.apply(console,arguments);
    };
})();



window.onerror = function(){

    if(window.parent!=window.parent){
        try{
            window.parent.window.ConsoleLogError.apply({},arguments);   
        }catch(e){}
    }else{
        $.ajax({
            url: location.protocol + "//" + location.hostname + ":9001",
            data:{log:JSON.stringify(arguments),type:"error",loc:location.href},
            type:"post"
        });
    }

};
</script>`
,
*/
    

    view:`
;window.cval = function(obj, arr, defVal) {
    if (defVal === undefined)
        defVal = cval.defValue;
    if (obj == null) {
        return defVal;
    }
    if (arr.length == 0) {
        return obj;
    }
    else {
        var index = arr.popAt(0);
        if (typeof (obj) == "object" && index in obj) {
            return cval(obj[index], arr, defVal);
        }
        else {
            return defVal;
        }
    }
};
var Asenac = Asenac || (Asenac=function(p,j){
    var pages = p.split(/\\/|\\./);
    var page = cval(window,pages,{View:e=>e,Json:{}});
    return page.View(j || page.Json );
});
Asenac.Docs = [];
Asenac.QuerySingle = function(selector){
    var docs = [document].concat(Asenac.Docs);
    var ret = null;
    for(let i=0; i<docs.length ; i++ ){
        if( (ret = docs[i].querySelector(selector)) != null){
            return ret;
        } 
    }
    return null;
};
Asenac.Query = function(selector){
    var docs = Asenac.Docs.concat([document]);
    var ret = [];
    for(let i=docs.length-1; i>-1 ; i-- ){
        ret = ret.concat(Array.from(docs[i].querySelectorAll(selector)));
        if(docs[i]!=document && docs[i].firstChild==null){
            Asenac.Docs.splice(i,1);
        }
    }
    return ret;
};`,



    plugins : `
<link rel="stylesheet" type="text/css" href="/css/font-awesome/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="/cdn/fontawesome.5.12/css/all.min.css">
<script src="/js/jquery.min.js"></script>

<link rel="stylesheet" type="text/css" href="/cdn/animate/animate.min.css">
<script src="/cdn/animate/animate.jquery.js"></script>

<!--<script src="/cdn/require.js"></script>
<script>
require(['/cdn/socket.io/socket.io.js'], e=> io =e );
</script>
-->
`
    ,

    /**
     * Convert Lss to Css
     * @param {*} files 
     * @returns {string} Return Css String
     */
    GetAllLss: function(files){
        var totalLss = "";
        var lssList = TreeFilter(files,e=>true,e=>e._data.css)
        var lssMulti = Lss.Multi(lssList);
        for (let i = 0; i < lssMulti.length; i++) {
            const element = lssMulti[i];
            totalLss += "<style>"+ lssMulti[i] +"</style>";
        }
        return totalLss;
    },

    /**
     * Export as Plugin 
     * @param {*} file single file
     * @param {*} name splitted name Example """Project.Lib.Modal"""
     * @returns {string} Returns javaScript code
     */
    ExportPlugin(file,name){
        let code = "";
        try {
            code += "try{";
            // JS
            code += ";\n"+file._data.js;
            // DEFINE
            if(name.indexOf(".")==-1){
                code += `;var ${name} = ${name} || (${name}={});`;
            }else{
                code += `;${name} = ${name} || (${name}={});`;
            }
            // ASENAC
            var fn = Asenac.BrowserView.complieFunctionString(file._data.asena,name);
            if(typeof fn !="string"){
                fn="function(Self,Global){ throw `"+fn.error.message+"` }";
            }
            code += ";\n"+name+".View="+fn;
            // JSON
            code += `;\n${name}.Json = ` + file._data.json;
            // CSS
            var lss = Lss.Multi([file._data.css])[0];
            code += ";\n{\n/* CSS CONTENT */ var style=document.createElement('style');\n "
            code += "\n style.textContent=`"+lss.replaceAll("`","\`").replaceAll("\n","") + "`;\n"
            code += "\n;document.head.append(style);}\n"
            // TRY-CATCH
            code += `}catch(e){ console.warn('Asenac: Error on Running ${name} ');console.warn(e);}`
        } catch (e) {
            console.warn("Error On:"+name);
            console.error(e);
            return ";throw `Error On:"+name+" "+e.toString()+"`;";
        }
        return code;
    },
    /***
     * Export Library as Javascript code
     * @param files All Project Files
     * @returns {string} Returns javascript code
     */
    ExportLibrary(files){
        let code = "/* EXPORT LIBRARY*/"
        TreeFilter(files,(file,text,id)=>{
            code += this.ExportPlugin(file,text.join("."));
        })
        return code;
    },
    

    /**
     * Export Project index.html & lib.js & libraries...js
     * @param {} files 
     * @param {} libraries List of files
     */
    ExportProject(files,libraries){
        var project= {};

        // Scripts
        var scripts = files[0].scripts;
        scripts = scripts.replace(/@project(.*)@end/s,"$1");

        // LIBRARIES
        var libraryScript = "";
        for (const key in libraries) {
            if (libraries.hasOwnProperty(key)) {
                const element = libraries[key];
                var fileName = key+".lib.js";
                project[fileName] = this.ExportLibrary(element);
                libraryScript += "<script src='"+fileName+"'></script>\n";
            }
        }
        

        
        project["lib.js"] = this.ExportLibrary(files);
        project["lib.js"]+= this.view;

        project["index.html"] = `<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="/src/fontawesome.5.12/css/all.min.css" rel="stylesheet" type="text/css">
        <link href="/src/animate/animate.min.css" rel="stylesheet" type="text/css">
        <script src="/src/jquery.min.js"></script>
        <script src="/src/animate/animate.jquery.js"></script>
        <script src="/src/delibas.js"></script>
        `+ scripts + `
        `+ libraryScript + `
        <script src='lib.js'></script>
    </head>
    <body>
        
    </body>
</html>`;
        return project;
    },

    
    /**
     * Returns Single Page HTML
     * @param {*} files 
     * @param {*} path 
     */
    Page:function(files,path) {
        var project = this.ExportProject(files,[]);
        
        // Scripts
        var scripts = files[0].scripts;
        scripts = scripts.replace(/@project(.*)@end/s,"");

        // Library <script>
        var libraryScript = "";
        var library = JSON.parse(files[0].library)
        for (let i = 0; i < library.length; i++) {
            const element = library[i];
            var fileName = this.host+"/view/export-library/"+element;
            libraryScript += "<script src='"+fileName+"'></script>\n";
        }
        
        var code = "";
        code = `<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="/src/fontawesome.5.12/css/all.min.css" rel="stylesheet" type="text/css">
        <link href="/src/animate/animate.min.css" rel="stylesheet" type="text/css">
        <script src="/src/jquery.min.js"></script>
        <script src="/src/animate/animate.jquery.js"></script>
        <script src="/src/delibas.js"></script>
        `+ libraryScript + `
        <script>
        `+ project["lib.js"] + `
        </script>
        `+ scripts + `
        <script> 
        $(function(){
            document.body.append(Asenac("${path}"));
        })
        </script>
    </head>
    <body>
        
    </body>
</html>`;
        return code;
    },

    
    /**
     * Returns Project HTML
     * @param {*} files 
     */
    Project:function(files) {
        var project = this.ExportProject(files,[]);
        
        // Scripts
        var scripts = files[0].scripts;
        scripts = scripts.replace(/@project(.*)@end/s,"$1");

        
        // Library <script>
        var libraryScript = "";
        var library = JSON.parse(files[0].library)
        for (let i = 0; i < library.length; i++) {
            const element = library[i];
            var fileName = this.host+"/view/export-library/"+element;
            libraryScript += "<script src='"+fileName+"'></script>\n";
        }
        
        var code = "";
        code = `<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="/src/fontawesome.5.12/css/all.min.css" rel="stylesheet" type="text/css">
        <link href="/src/animate/animate.min.css" rel="stylesheet" type="text/css">
        <script src="/src/jquery.min.js"></script>
        <script src="/src/animate/animate.jquery.js"></script>
        <script src="/src/delibas.js"></script>
        `+ libraryScript + `
        <script>
        `+ project["lib.js"] + `
        </script>
        `+ scripts + `
    </head>
    <body>
        
    </body>
</html>`;
        return code;
    }

    
    ,
    /**
     * Convert all page per page complie
     * @param {*} files 
     */
    GlobalPageAsenaJsJson: function(files){
        let that = this;
        let totalCode = "<script> json = {} </script>"
        TreeFilter(files,e=>true, function (e,textList,idList) {
            let code = e._data.asena;
            code = code.replaceAll("\\","\\\\");
            code = code.replaceAll("{","\\{");
            let name = textList.join("/");
            if(e._data.asenacType=="asenac/plugin"){
                totalCode += "<!--===================================-->\n"
                totalCode += "<!-- "+ name +" Export Plugin  -->\n";
                totalCode += "<script>\n";
                totalCode += that.ExportPlugin(e,e._text);
                totalCode += "</script>\n";
                totalCode += "<!--------------------------------------->\n"

            }else{
                totalCode += "<!--===================================-->\n"
                totalCode += "<!-- "+ name +" Asenac  -->\n";
                totalCode += "<script>\n";
                totalCode += "Asenac.Load(`" + code + "`,'"+ name +"');\n";
                totalCode += "</script>\n";
                totalCode += "<!-- "+ name +" JavaScript  -->\n";
                totalCode += "<script>" + e._data.js + "</script>\n";
                totalCode += "<!-- "+ name +" JSON  -->\n";
                totalCode += "<script> json['"+name+"'] = " + e._data.json + "</script>\n";
                totalCode += "<!--------------------------------------->\n"
            }
        })
        
        
        return totalCode;
        
    },



    /**
    * Get All Asena to JS Script
    * @param {*} files
    * @returns {string} Return Asena String
    */
    GetAllAsena: function(files){
        let totalAsena = "";
        TreeFilter(files,e=>true, function (e,textList,idList) {
            let code = e._data.asena;
            code = code.replaceAll("\\","\\\\");
            code = code.replaceAll("{","\\{");
            let name = textList.join("/");
            totalAsena += "Asenac.Load(`"+ code +"`,'"+ name +"');\n";
        });
        return totalAsena;
    },

    /**
     * 
     * @param {*} files Tree strcuture {_text,_id,_children,_data}
     * @param {*} useErrorDebug 
     * @returns {string}
     */
    GlobalHtml: function(files){
        /**
         * For filter
         * e._children.length==0
         */

        var library = files[0].library || "";

        let totalLss = this.GetAllLss(files);

        let totalAsenaJsJson = this.GlobalPageAsenaJsJson(files);


        var host = this.host;
    
        var html_string =  `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="`+host+`/cdn/asenac/js/delibas.js"></script>
                <script src="`+host+`/cdn/asenac/js/JsonAsenac.js"></script>
                <script src="`+host+`/cdn/asenac/js/Asenac.js"></script>
                <script src="`+host+`/cdn/asenac/js/RealData.js"></script>
                <script src="`+host+`/cdn/asenac/js/Browser.View.js"></script>
                <script src="`+host+`/cdn/asenac/js/Browser.RealData.View.js"></script>` +
                this.plugins +
                library +
                `
            </head>
            ` +
            totalLss +
        `   
            <body>
            </body>
            `  + totalAsenaJsJson  + `    
        </html>`;

        return html_string;
    }
    ,


    SingleHtmlPlugin(file){
        
        
        
        var pageName = file._text;
        var plugin = this.ExportPlugin(file,pageName)

    
        var host = this.host;
    


        var html_string =  `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="`+host+`/cdn/asenac/js/delibas.js"></script>
                <script src="`+host+`/cdn/asenac/js/JsonAsenac.js"></script>
                <script src="`+host+`/cdn/asenac/js/Asenac.js"></script>
                <script src="`+host+`/cdn/asenac/js/RealData.js"></script>
                <script src="`+host+`/cdn/asenac/js/Browser.View.js"></script>
                <script src="`+host+`/cdn/asenac/js/Browser.RealData.View.js"></script>
                `+ this.plugins + `
            </head>
            <body>
            </body>
            <script>
                (function(){
                    var originalLog = console.log;
                    console.log = function(...arg){
                        window.parent.window.ConsoleLogFromIframe.apply({},arguments);
                        originalLog.apply(console,arguments);
                    }
                })();
                
                window.onerror = function(){
                    window.parent.window.ConsoleLogError.apply({},arguments);   
                }
            </script>
            <script>
                ` + plugin + `
            </script>
            <script defer=defer>
                document.body.appendChild(
                    `+pageName+`(`+file._data.json+`)
                )
            </script>
            
        </html>`;
    
        return html_string
    },
    /**
     * Return Single Page Html
     * @param {*} files All Files
     * @param {*} file Single Node File
     */

    SingleHtml(files,file){
        var js  = file._data.js;
        var json = file._data.json;

        var asena = file._data.asena;
        asena = asena.replaceAll("\\","\\\\");
        asena = asena.replaceAll("{","\\{");

        var pageName = "";
        TreeFilter(files,e=>true, function (e,textList,idList) {
            if(e._id==file._id){
                pageName = textList.join("/");
            }
        });
        
        var library = files[0].library;

        var totalAsena = this.GetAllAsena(files);
        asena = asena.replaceAll("$","\\$");
    
        var host = this.host;
    
        var totalLss = this.GetAllLss(files);

        var html_string =  `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="`+host+`/cdn/asenac/js/delibas.js"></script>
                <script src="`+host+`/cdn/asenac/js/JsonAsenac.js"></script>
                <script src="`+host+`/cdn/asenac/js/Asenac.js"></script>
                <script src="`+host+`/cdn/asenac/js/RealData.js"></script>
                <script src="`+host+`/cdn/asenac/js/Browser.View.js"></script>
                <script src="`+host+`/cdn/asenac/js/Browser.RealData.View.js"></script>
                `+ this.plugins + library + `
            </head>` +
            totalLss +  `<body>
            </body>
            <script>
                (function(){
                    var originalLog = console.log;
                    console.log = function(...arg){
                        window.parent.window.ConsoleLogFromIframe.apply({},arguments);
                        originalLog.apply(console,arguments);
                    }
                })();
                
                window.onerror = function(){
                    window.parent.window.ConsoleLogError.apply({},arguments);   
                }
            </script>
            <script>
                var json = `+ json +`;
                var rd = new RealData.RealData( json );
            </script>
            <script>` +
                 totalAsena + ` 
            </script>
            <script>
                var asena = \``+ asena +`\`;
            </script>
            <script>
                `+js+`
            </script>
            <script defer=defer>
                document.body.appendChild(
                    Asenac.Complie( '`+pageName+`' , rd.data )
                )
            </script>
            
        </html>`;
    
        return html_string
    }
    ,



    /**
     * iframe inside embed html
     * @param {Node} iframe 
     * @param {string} html 
     */
    ShowInIframe : function (iframe,html){
        var runParent = iframe.parentNode;
        iframe.remove();
        iframe = document.createElement("iframe");
        iframe.id = "run";
        runParent.appendChild(iframe);
    
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.close();
        iframe.src = "about:blank";
        
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();
    }
}





exports.Karala_Run = Karala_Run;

