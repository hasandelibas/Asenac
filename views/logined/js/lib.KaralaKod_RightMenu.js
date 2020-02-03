/* EXPORT LIBRARY*/try{;

    ;var KaraKod_RightMenu = KaraKod_RightMenu || (KaraKod_RightMenu={});;
    KaraKod_RightMenu.View=function(Self,Global){
    let ___that=this;
    let Keys={};
    let ___lastForKey=null;
    let Parent = document.createDocumentFragment();
    let ___idList=[];/*LINE:0, CODE:"ul.top-menu" */
    {
    let Element = document.createElement("ul");
    Element.className="top-menu";
    {
    let Parent=Element;
    /*LINE:1, CODE:":: $" */
    {
    let ___iterators= Self;let ___forKeyName=``;for (let ___key in ___iterators) {
    if (___iterators.hasOwnProperty(___key)) {
    Keys[___forKeyName]=___key;
    ___lastForKey=___key;
    let Self=___iterators[___key];
    /*LINE:2, CODE:"li[style=background:{{ val($color,\"inherit\") }}]" */
    {
    let Element = document.createElement("li");
    Element.setAttribute(`style`,`background:`+ val(Self['color'],"inherit") +``);
    {
    let Parent=Element;
    /*LINE:3, CODE:"-if(typeof $onclick!=\"undefined\") Element.setAttribute(\"onclick\",$onclick);" */
    if(typeof Self['onclick']!="undefined") Element.setAttribute("onclick",Self['onclick']);;
    /*LINE:4, CODE:"-if(typeof $title!=\"undefined\") Element.title=$title;" */
    if(typeof Self['title']!="undefined") Element.title=Self['title'];;
    /*LINE:6, CODE:":? val($menus,[]).length == 0" */
    if(val(Self['menus'],[]).length == 0){
    /*LINE:7, CODE:"a" */
    {
    let Element = document.createElement("a");
    {
    let Parent=Element;
    /*LINE:8, CODE:"-if(typeof $href!=\"undefined\") Element.href=$href;" */
    if(typeof Self['href']!="undefined") Element.href=Self['href'];;
    /*LINE:9, CODE:":? $icon" */
    if(Self['icon']){
    /*LINE:10, CODE:"i[class=$icon]" */
    {
    let Element = document.createElement("i");
    Element.setAttribute(`class`,``+Self['icon']+``);
    Parent.append(Element);
    };
    }/*LINE:11, CODE:"span>{{val($text,\"\")}}" */
    {
    let Element = document.createElement("span");
    ___innerHTML = ``+val(Self['text'],"")+``;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    }else{
    /*LINE:13, CODE:"span" */
    {
    let Element = document.createElement("span");
    {
    let Parent=Element;
    /*LINE:14, CODE:":? $icon" */
    if(Self['icon']){
    /*LINE:15, CODE:"i[class=$icon]" */
    {
    let Element = document.createElement("i");
    Element.setAttribute(`class`,``+Self['icon']+``);
    Parent.append(Element);
    };
    }/*LINE:16, CODE:"span> $text" */
    {
    let Element = document.createElement("span");
    ___innerHTML = ` `+Self['text']+``;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    /*LINE:17, CODE:"div[menus]" */
    {
    let Element = document.createElement("div");
    Element.setAttribute(`menus`,``);
    {
    let Parent=Element;
    /*LINE:18, CODE:":: $menus" */
    {
    let ___iterators= Self['menus'];let ___forKeyName=``;for (let ___key in ___iterators) {
    if (___iterators.hasOwnProperty(___key)) {
    Keys[___forKeyName]=___key;
    ___lastForKey=___key;
    let Self=___iterators[___key];
    /*LINE:19, CODE:"li[style=background:{{ val($color,\"inherit\") }}]" */
    {
    let Element = document.createElement("li");
    Element.setAttribute(`style`,`background:`+ val(Self['color'],"inherit") +``);
    {
    let Parent=Element;
    /*LINE:20, CODE:"-if(typeof $onclick!=\"undefined\") Element.setAttribute(\"onclick\",$onclick);" */
    if(typeof Self['onclick']!="undefined") Element.setAttribute("onclick",Self['onclick']);;
    /*LINE:21, CODE:":? val($menus,[]).length == 0" */
    if(val(Self['menus'],[]).length == 0){
    /*LINE:22, CODE:"a" */
    {
    let Element = document.createElement("a");
    {
    let Parent=Element;
    /*LINE:23, CODE:"-if(typeof $href!=\"undefined\") Element.href=$href;" */
    if(typeof Self['href']!="undefined") Element.href=Self['href'];;
    /*LINE:24, CODE:":? $icon" */
    if(Self['icon']){
    /*LINE:25, CODE:"i[class=$icon]" */
    {
    let Element = document.createElement("i");
    Element.setAttribute(`class`,``+Self['icon']+``);
    Parent.append(Element);
    };
    }/*LINE:26, CODE:"span> $text" */
    {
    let Element = document.createElement("span");
    ___innerHTML = ` `+Self['text']+``;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    }}
    Parent.append(Element);
    };
    }
    }
    };
    }
    Parent.append(Element);
    };
    }}
    Parent.append(Element);
    };
    }
    }
    };
    }
    Parent.append(Element);
    };
    return Parent;
    };
    KaraKod_RightMenu.Json = [
        
        {	icon:"fa fa-play",title: "Complie Page", onclick:'Run()'},
        {	icon:"fa fa-flag",title: "Complie Project", onclick:'RunGlobal()'},
        
        { icon:"fa fa-eye", text:"View", color:"#e55", menus:[
            {icon:"fa fa-file-o",text:"Page",onclick:'ViewPage()'},
            {icon:"fa fa-flag",text:"Project",onclick:'ViewProject()'}
        ]},
        { icon:"fa fa-archive", text:"Export",color:'#49F',menus:[
            {icon:"fa fa-file-o",text:"Export Current Page",onclick:'ExportPlugin()'},
            {icon:"fa fa-flag",text:"Export Project",onclick:'ExportLibrary()'},
            {icon:"fa fa-flag",text:"Export Project w/Libraries",onclick:'ExportProject()'},
        ]},
        {	icon:"fa fa-save",title: "Save Project", onclick:'Karala_Project.Save()' },
        
    ];
    {
    /* CSS CONTENT */ var style=document.createElement('style');
     
     style.textContent=` ul.top-menu{padding:0px;margin:0px;box-sizing:border-box;box-shadow:0px 0px 10px #000;-webkit-box-shadow:0px 0px 10px #000;	position:relative;user-select:none;-webkit-user-select:none;	background:#222;	color:#EEE;	height:50px;	display:flex;} ul.top-menu >*{display:inline-block;padding:15px 12px;} ul.top-menu .brand{font-weight:bold;} ul.top-menu li{white-space:nowrap;display:flex;align-items:center;				cursor:pointer;		display:inline-block;position:relative;} ul.top-menu li a{color:inherit;text-decoration:inherit;} ul.top-menu li:hover{box-shadow:inset 0px 0px 0px 100px #0003;} ul.top-menu li [menus]{position:absolute;			top:100%;			left:0px;			font-size:.9em;			display:flex;		flex-direction:column;-webkit-flex-direction:column;			background:inherit;			min-width:100%;		box-shadow:1px 1px 8px #0008;-webkit-box-shadow:1px 1px 8px #0008;} ul.top-menu li [menus] li{padding:10px 15px;			transition:box-shadow .25s,transform .25s,padding .25s;-webkit-transition:box-shadow .25s,transform .25s,padding .25s;} ul.top-menu li [menus] li:hover{box-shadow:inset 0px 0px 0px 40px #FFF2;					padding-left:25px;					padding-right:5px;} ul.top-menu li [menus]{visibility:hidden;		opacity:0;-webkit-opacity:0;					transition: all .25s;-webkit-transition: all .25s;		transition-delay: .25s;-webkit-transition-delay: .25s;} ul.top-menu li:hover [menus]{transition-delay:0s;			visibility:visible;		opacity:1;-webkit-opacity:1;			display:flex;} .top-menu{height:unset!important;	display:flex;align-items:center;-webkit-align-items:center;} .top-menu *{z-index:7;} .top-menu .fa{line-height:unset;} .top-menu li{padding:10px 20px;}`;
    
    ;document.head.append(style);}
    }catch(e){ console.warn('Asenac: Error on Running KaraKod_RightMenu ');console.warn(e);}