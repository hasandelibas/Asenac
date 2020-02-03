try{;

    ;var KaraKod_TopMenu = KaraKod_TopMenu || (KaraKod_TopMenu={});;
    KaraKod_TopMenu.View=(function(Self,Global){
    let ___that=this;
    let Keys={};
    let ___lastForKey=null;
    let Parent = document.createDocumentFragment();
    let ___idList=[];/*LINE:0, CODE:ul.top-menu */
    {
    let Element = document.createElement("ul");
    Element.className="top-menu";
    {
    let Parent=Element;
    /*LINE:1, CODE:li */
    {
    let Element = document.createElement("li");
    {
    let Parent=Element;
    /*LINE:2, CODE:-Element.onclick=function(e){window.location="/profile";} */
    Element.onclick=function(e){window.location="/profile";};
    /*LINE:3, CODE:i.fa.fa-angle-left */
    {
    let Element = document.createElement("i");
    Element.className="fa fa-angle-left";
    Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    /*LINE:4, CODE:.brand[drag]> White Code */
    {
    let Element = document.createElement("div");
    Element.className="brand";
    Element.setAttribute(`drag`,``);
    ___innerHTML = ` White Code`;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;{
    let Parent=Element;
    /*LINE:5, CODE:small> Asenac IDE */
    {
    let Element = document.createElement("small");
    ___innerHTML = ` Asenac IDE`;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    /*LINE:6, CODE::: $ */
    {
    let ___iterators= Self;let ___forKeyName=``;for (let ___key in ___iterators) {
    if (___iterators.hasOwnProperty(___key)) {
    Keys[___forKeyName]=___key;
    ___lastForKey=___key;
    let Self=___iterators[___key];
    /*LINE:7, CODE:li */
    {
    let Element = document.createElement("li");
    {
    let Parent=Element;
    /*LINE:8, CODE:-if(typeof $onclick!="undefined") Element.setAttribute("onclick",$onclick); */
    if(typeof Self["onclick"]!="undefined") Element.setAttribute("onclick",Self["onclick"]);;
    /*LINE:9, CODE:-if(typeof $title!="undefined") Element.title=$title; */
    if(typeof Self["title"]!="undefined") Element.title=Self["title"];;
    /*LINE:11, CODE::? val($menus,[]).length == 0 */
    if(val(Self["menus"],[]).length == 0){
    /*LINE:12, CODE:a */
    {
    let Element = document.createElement("a");
    {
    let Parent=Element;
    /*LINE:13, CODE:-if(typeof $href!="undefined") Element.href=$href; */
    if(typeof Self["href"]!="undefined") Element.href=Self["href"];;
    /*LINE:14, CODE::? $icon */
    if(Self["icon"]){
    /*LINE:15, CODE:i[class=$icon] */
    {
    let Element = document.createElement("i");
    Element.setAttribute(`class`,``+Self["icon"]+``);
    Parent.append(Element);
    };
    }/*LINE:16, CODE:span>{{val($text,"")}} */
    {
    let Element = document.createElement("span");
    ___innerHTML = ``+val(Self["text"],"")+``;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    }else{
    /*LINE:18, CODE:span */
    {
    let Element = document.createElement("span");
    {
    let Parent=Element;
    /*LINE:19, CODE::? $icon */
    if(Self["icon"]){
    /*LINE:20, CODE:i[class=$icon] */
    {
    let Element = document.createElement("i");
    Element.setAttribute(`class`,``+Self["icon"]+``);
    Parent.append(Element);
    };
    }/*LINE:21, CODE:span> $text */
    {
    let Element = document.createElement("span");
    ___innerHTML = ` `+Self["text"]+``;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    }/*LINE:23, CODE::? val($menus,[]).length != 0 */
    if(val(Self["menus"],[]).length != 0){
    /*LINE:24, CODE:div[menus] */
    {
    let Element = document.createElement("div");
    Element.setAttribute(`menus`,``);
    {
    let Parent=Element;
    /*LINE:25, CODE::: $menus */
    {
    let ___iterators= Self["menus"];let ___forKeyName=``;for (let ___key in ___iterators) {
    if (___iterators.hasOwnProperty(___key)) {
    Keys[___forKeyName]=___key;
    ___lastForKey=___key;
    let Self=___iterators[___key];
    /*LINE:26, CODE:li */
    {
    let Element = document.createElement("li");
    {
    let Parent=Element;
    /*LINE:27, CODE:-if(typeof $onclick!="undefined") Element.setAttribute("onclick",$onclick); */
    if(typeof Self["onclick"]!="undefined") Element.setAttribute("onclick",Self["onclick"]);;
    /*LINE:28, CODE::? val($menus,[]).length == 0 */
    if(val(Self["menus"],[]).length == 0){
    /*LINE:29, CODE:a */
    {
    let Element = document.createElement("a");
    {
    let Parent=Element;
    /*LINE:30, CODE:-if(typeof $href!="undefined") Element.href=$href; */
    if(typeof Self["href"]!="undefined") Element.href=Self["href"];;
    /*LINE:31, CODE::? $icon */
    if(Self["icon"]){
    /*LINE:32, CODE:i[class=$icon] */
    {
    let Element = document.createElement("i");
    Element.setAttribute(`class`,``+Self["icon"]+``);
    Parent.append(Element);
    };
    }/*LINE:33, CODE:span> $text */
    {
    let Element = document.createElement("span");
    ___innerHTML = ` `+Self["text"]+``;
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
    /*LINE:34, CODE:.center-menu[drag] */
    {
    let Element = document.createElement("div");
    Element.className="center-menu";
    Element.setAttribute(`drag`,``);
    Parent.append(Element);
    };
    /*LINE:35, CODE:.right-menu */
    {
    let Element = document.createElement("div");
    Element.className="right-menu";
    {
    let Parent=Element;
    /*LINE:36, CODE:li.debug#debug-button */
    {
    let Element = document.createElement("li");
    Element.className="debug";
    Element.id="debug-button";
    ___idList["debug-button"]=Element;{
    let Parent=Element;
    /*LINE:37, CODE:i.fa.fa-bug */
    {
    let Element = document.createElement("i");
    Element.className="fa fa-bug";
    Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    /*LINE:38, CODE:li.minimize#minimize-button */
    {
    let Element = document.createElement("li");
    Element.className="minimize";
    Element.id="minimize-button";
    ___idList["minimize-button"]=Element;{
    let Parent=Element;
    /*LINE:40, CODE:span>_ */
    {
    let Element = document.createElement("span");
    ___innerHTML = `_`;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    /*LINE:41, CODE:li.maximize#restore-button */
    {
    let Element = document.createElement("li");
    Element.className="maximize";
    Element.id="restore-button";
    ___idList["restore-button"]=Element;{
    let Parent=Element;
    /*LINE:43, CODE:span># */
    {
    let Element = document.createElement("span");
    ___innerHTML = `#`;
    if(___innerHTML instanceof Node) Element.append(___innerHTML); else Element.innerHTML=___innerHTML;Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    /*LINE:44, CODE:li.close#close-button */
    {
    let Element = document.createElement("li");
    Element.className="close";
    Element.id="close-button";
    ___idList["close-button"]=Element;{
    let Parent=Element;
    /*LINE:45, CODE:i.fa.fa-times */
    {
    let Element = document.createElement("i");
    Element.className="fa fa-times";
    Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    }
    Parent.append(Element);
    };
    return Parent;
    }
    );
    KaraKod_TopMenu.Json = [
        
        {	icon:"fa fa-save",title: "Save Project", onclick:'Karala_Project.Save()' },
        {	icon:"fa fa-play",title: "Complie Page", onclick:'Run()'},
        {	icon:"fa fa-flag",title: "Complie Project", onclick:'RunGlobal()'},
        
        { icon:"fa fa-eye", text:"View", menus:[
            {icon:"fa fa-file-o",text:"Page",onclick:'ViewPage()'},
            {icon:"fa fa-flag",text:"Project",onclick:'ViewProject()'}
        ]},
        { icon:"fa fa-archive", text:"Export",menus:[
            {icon:"fa fa-file-o",text:"Export Current Page",onclick:'ExportPlugin()'},
            {icon:"fa fa-flag",text:"Export Project",onclick:'ExportLibrary()'},
            {icon:"fa fa-flag",text:"Export Project w/Libraries",onclick:'ExportProject()'},
        ]},
        
    ];
    {
    /* CSS CONTENT */ var style=document.createElement('style');
     
     style.textContent=` ul.top-menu{padding:0px;margin:0px;box-sizing:border-box;	position:relative;user-select:none;-webkit-user-select:none;	background:#CCC;	color:#333;	height:50px;	display:flex;} ul.top-menu >*{display:inline-flex;	align-items:center;-webkit-align-items:center;} ul.top-menu .brand{font-weight:bold;padding:0px 10px} ul.top-menu li{white-space:nowrap;		display:flex;		cursor:pointer;position:relative;} ul.top-menu li a{color:inherit;text-decoration:inherit;} ul.top-menu li:hover{box-shadow:inset 0px 0px 0px 100px #0002;} ul.top-menu li:active{box-shadow:inset 0px 0px 0px 100px #0004;} ul.top-menu li [menus]{position:absolute;			top:100%;			left:0px;			font-size:.9em;			display:flex;			background:#CCC;			color:#333;		flex-direction:column;-webkit-flex-direction:column;			background:inherit;			min-width:100%;		box-shadow:1px 1px 8px #0008;-webkit-box-shadow:1px 1px 8px #0008;} ul.top-menu li [menus] li{padding:10px 15px;			transition:padding .25s;-webkit-transition:padding .25s;} ul.top-menu li [menus] li:hover{box-shadow:inset 0px 0px 0px 40px #FFF2;					padding-left:25px;					padding-right:5px;} ul.top-menu li [menus] li:active{box-shadow:inset 0px 0px 0px 40px #0002;					padding-left:25px;					padding-right:5px;} ul.top-menu li [menus]{visibility:hidden;		opacity:0;-webkit-opacity:0;					transition: all .25s;-webkit-transition: all .25s;		transition-delay: .25s;-webkit-transition-delay: .25s;} ul.top-menu li:hover [menus]{transition-delay:0s;			visibility:visible;		opacity:1;-webkit-opacity:1;			display:flex;} .top-menu{height:40px!important;box-sizing:border-box;-webkit-box-sizing:border-box;	width:100%;	padding:4px;display:flex;align-items:center;-webkit-align-items:center;} .top-menu [drag]{-webkit-app-region: drag;		cursor:move;} .top-menu .center-menu{flex:1;} .top-menu .brand{white-space: pre;    font-weight: bold;    text-overflow: ellipsis;} .top-menu *{z-index:7;		line-height:100%;} .top-menu >*{height:40px;		padding:10px 15px;		display:inline-flex;	box-sizing:border-box;-webkit-box-sizing:border-box;} .top-menu .right-menu li{display:flex;align-items:center;justify-content:center;		width:32px;		height:32px;	border-radius:100%;-webkit-border-radius:100%;} .top-menu li:hover{background:#4AF;		color:white;} .top-menu li:active{color:white;} .top-menu [menus] li{background:#CCC;			color:#222;} .top-menu [menus] li:hover{background:#4AF;			color:white;} .top-menu [menus] li:active{color:white;} .top-menu .close:hover{background:#F55;		color:white;}`;
    
    ;document.head.append(style);}
    }catch(e){ console.warn('Asenac: Error on Running KaraKod_TopMenu ');console.warn(e);}