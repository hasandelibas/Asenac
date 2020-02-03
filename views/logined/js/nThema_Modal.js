function Modal(options,...optionsArg){
	
	// Appending Arguments
	for(var i = 0;i< optionsArg.length;i++){
		Object.assign(options, optionsArg[optionsArg.length-i-1] );
	}
	
	// Assign Defaults Values
	options = Object.assign( {} , Modal.defaults, options); 
	
	// Node Element Text
	let textNode = options.text instanceof Node ? options.text : null;
	// Footer Element Text
	let footerNode = options.footer instanceof Node ? options.footer : null;
	
	// Create AsenaViewObj
	let objs = {};
	//var doc = Asenac.Complie.bind(objs)("Project/Comp/Modal",options);
	var doc = Modal.View.bind(objs)(options);
	
	// Destroy Modal Function
	function Destroy(){
		CloseModal();
		objs.parent.remove();
	}
	
	// Close Modal Function
	function CloseModal(){
		objs.parent.classList.add("closing");
		setTimeout(e=>{objs.parent.style.display="none";},30);
		if(options.onClose) options.onClose();
	}
	
	// Close Modal Function From Outside Click
	function CloseModalFromOutside(e){
		if( e.target==objs.parent ){
			CloseModal();
		}
	}
	
	// Expand Function
	function Expand(){					
		objs.parent.classList.toggle("expanded");
	}
	
	// Show Function
	function Show(){
		objs.parent.style.display="block";
		setTimeout(e=>{ objs.parent.classList.remove("closing"); },30);
	}
	
	// Button Event Adding
	if(objs.close) objs.close.onclick = CloseModal;
	if(objs.expand) objs.expand.onclick = Expand;
	objs.parent.onclick = CloseModalFromOutside;
	
	// Set Style of Modal
	objs.parent.classList.add(options.style)
	
	// Fullscreen on start
	if(options.fullscreen) objs.parent.classList.add("expanded")
	
	// Width & Height
	objs.inside.style.width=options.width;
	objs.inside.style.height=options.height;
	
	// Text & Footer Node append in modal
	if(textNode) objs.text.appendChild(textNode);
	if(footerNode) objs.footer.appendChild(footerNode);
	
	// Append in Document new Modal
	document.body.appendChild( doc);
	
	// Creating Modal Object
	let ModalObj = {
		_doc: doc,
		_objs: objs,
		close:CloseModal,
		expand:Expand,
		destroy:Destroy,
		show:Show
	};
	
	// Add into modals list new Modal Object
	Modal.modals.push(ModalObj);
	
	return ModalObj;
}

Modal.defaults = {
	title: "",
	text:"",
	footer:"",
	icon:"none",
	style:"modal-2",
	
	expand: false,
	close:true,
	
	fullscreen: false,
	show: true,
	
	width:null,
	height:null,
	onClose:null
};
Modal.modals = [];

Modal.close = function(){
	for(var i=0;i<Modal.modals.length;i++){
		Modal.modals[i].close();
	}
}
Modal.expand = function(){
	for(var i=0;i<Modal.modals.length;i++){
		Modal.modals[i].expand();
	}
}

Modal.show = function(){
	for(var i=0;i<Modal.modals.length;i++){
		Modal.modals[i].show();
	}
}


Modal.destroy = function(){
	for(var i=Modal.modals.length-1;i>-1;i--){
		Modal.modals[i].destroy();
		delete Modal.modals[i];
		Modal.modals.pop();
	}
}


Modal.help = function(){
	let modalHelp = {
		title: "Modal Help",
		footer:"",
		icon:"info",
		fullscreen:true
	}
	modalHelp.text =  `<style>#modal-help i,#modal-help b{width:100px;display:inline-block;}#modal-help i{width:300px;}</style>`;
	modalHelp.text += `<div id='modal-help'><h3> Options</h3><p><b> title</b><i> string</i> Title of Modal</p><p><b> text</b><i> string | Node</i> Modal inside text</p><p><b> footer</b><i> string | Node</i> Footer text</p><hr><p><b> style</b><i> string</i> Modal style. Can be 'modal-1' , 'modal-2', 'modal-3' (Default: 'modal-2')</p><p><b> icon</b><i> 'info' | 'error' | 'success' | 'question' | null</i> Modal' left top icon (Default: null)</p><hr><p><b> close</b><i> boolean</i> Modal's close button visible (Default: true)</p><p><b> expand</b><i> boolean</i> Modal's expand button visible (Default: false)</p><p><b> fullscreen</b><i> boolean</i> Modal's expand on start (Default: false)</p><p><b> show</b><i> boolean</i> Show Modal on startly. (Default: true)</p><hr><p><b> width</b><i> number px</i> Modal width size</p><p><b> height</b><i> number px</i> Modal height size</p><hr><h3> Modal Static & Dynamic Events</h3><p><b> .show()</b> Show this Modal</p><p><b> .expand()</b> Expand modal, change class to 'fullscreen'</p><p><b> .close()</b> Close this Modal</p><p><b> .destroy()</b> Destroy this Modal</p></div>`
	Modal(modalHelp);
}
;
Modal.View=function(___selfData,___globalData){
let ___that=this;
let ___forKeys={};
let ___lastForKey=null;
let ___fragment = document.createDocumentFragment();
let ___idList=[];/*LINE:0, CODE:":parent:div.modal[style=display:{{ ($show ? 'block' : 'none') }}]" */
{
let ___el = document.createElement("div");
___el.className="modal";
___el.setAttribute(`style`,`display:`+ (___selfData['show'] ? 'block' : 'none') +``);
{
let ___fragment=___el;
/*LINE:1, CODE:":inside:div.modal-inside" */
{
let ___el = document.createElement("div");
___el.className="modal-inside";
{
let ___fragment=___el;
/*LINE:2, CODE:"div.modal-title" */
{
let ___el = document.createElement("div");
___el.className="modal-title";
{
let ___fragment=___el;
/*LINE:3, CODE:":? $icon==\"info\"" */
if(___selfData['icon']=="info"){
/*LINE:4, CODE:"span.modal-icon.info" */
{
let ___el = document.createElement("span");
___el.className="modal-icon info";
{
let ___fragment=___el;
/*LINE:5, CODE:"i.fa.fa-exclamation-circle" */
{
let ___el = document.createElement("i");
___el.className="fa fa-exclamation-circle";
___fragment.append(___el);
};
}
___fragment.append(___el);
};
}/*LINE:7, CODE:":? $icon==\"error\"" */
if(___selfData['icon']=="error"){
/*LINE:8, CODE:"span.modal-icon.error" */
{
let ___el = document.createElement("span");
___el.className="modal-icon error";
{
let ___fragment=___el;
/*LINE:9, CODE:"i.fa.fa-warning" */
{
let ___el = document.createElement("i");
___el.className="fa fa-warning";
___fragment.append(___el);
};
}
___fragment.append(___el);
};
}/*LINE:10, CODE:":? $icon==\"success\"" */
if(___selfData['icon']=="success"){
/*LINE:11, CODE:"span.modal-icon.success" */
{
let ___el = document.createElement("span");
___el.className="modal-icon success";
{
let ___fragment=___el;
/*LINE:12, CODE:"i.fa.fa-check" */
{
let ___el = document.createElement("i");
___el.className="fa fa-check";
___fragment.append(___el);
};
}
___fragment.append(___el);
};
}/*LINE:13, CODE:":? $icon==\"question\"" */
if(___selfData['icon']=="question"){
/*LINE:14, CODE:"span.modal-icon.question" */
{
let ___el = document.createElement("span");
___el.className="modal-icon question";
{
let ___fragment=___el;
/*LINE:15, CODE:"i.fa.fa-question-circle" */
{
let ___el = document.createElement("i");
___el.className="fa fa-question-circle";
___fragment.append(___el);
};
}
___fragment.append(___el);
};
}/*LINE:17, CODE:":title:span.modal-title-inside[title=$title]>$title" */
{
let ___el = document.createElement("span");
___el.className="modal-title-inside";
___el.setAttribute(`title`,``+___selfData['title']+``);
___innerHTML = ``+___selfData['title']+``;
if(___innerHTML instanceof Node) ___el.append(___innerHTML); else ___el.innerHTML=___innerHTML;___that[`title`]=___el;
___fragment.append(___el);
};
/*LINE:18, CODE:":? $expand == true" */
if(___selfData['expand'] == true){
/*LINE:19, CODE:": expand: span.modal-button.expand" */
{
let ___el = document.createElement("span");
___el.className="modal-button expand";
{
let ___fragment=___el;
/*LINE:20, CODE:"i.fa.fa-arrows-alt" */
{
let ___el = document.createElement("i");
___el.className="fa fa-arrows-alt";
___fragment.append(___el);
};
}
___that[`expand`]=___el;
___fragment.append(___el);
};
}/*LINE:21, CODE:":? $close == true" */
if(___selfData['close'] == true){
/*LINE:22, CODE:": close : span.modal-button.close" */
{
let ___el = document.createElement("span");
___el.className="modal-button close";
{
let ___fragment=___el;
/*LINE:23, CODE:"i.fa.fa-times" */
{
let ___el = document.createElement("i");
___el.className="fa fa-times";
___fragment.append(___el);
};
}
___that[`close`]=___el;
___fragment.append(___el);
};
}}
___fragment.append(___el);
};
/*LINE:26, CODE:":? typeof($text) == \"string\"" */
if(typeof(___selfData['text']) == "string"){
/*LINE:27, CODE:": text : div.modal-content.modal-padding> $text" */
{
let ___el = document.createElement("div");
___el.className="modal-content modal-padding";
___innerHTML = ` `+___selfData['text']+``;
if(___innerHTML instanceof Node) ___el.append(___innerHTML); else ___el.innerHTML=___innerHTML;___that[`text`]=___el;
___fragment.append(___el);
};
}else{
/*LINE:29, CODE:": text : div.modal-content> @{{$text}}" */
{
let ___el = document.createElement("div");
___el.className="modal-content";
___innerHTML = ___selfData['text'];
if(___innerHTML instanceof Node) ___el.append(___innerHTML); else ___el.innerHTML=___innerHTML;___that[`text`]=___el;
___fragment.append(___el);
};
}/*LINE:31, CODE:":? typeof($footer) == \"string\"" */
if(typeof(___selfData['footer']) == "string"){
/*LINE:32, CODE:": footer : div.modal-footer.modal-padding>$footer" */
{
let ___el = document.createElement("div");
___el.className="modal-footer modal-padding";
___innerHTML = ``+___selfData['footer']+``;
if(___innerHTML instanceof Node) ___el.append(___innerHTML); else ___el.innerHTML=___innerHTML;___that[`footer`]=___el;
___fragment.append(___el);
};
}else{
/*LINE:34, CODE:": footer : div.modal-footer>@{{$footer}}" */
{
let ___el = document.createElement("div");
___el.className="modal-footer";
___innerHTML = ___selfData['footer'];
if(___innerHTML instanceof Node) ___el.append(___innerHTML); else ___el.innerHTML=___innerHTML;___that[`footer`]=___el;
___fragment.append(___el);
};
}}
___that[`inside`]=___el;
___fragment.append(___el);
};
}
___that[`parent`]=___el;
___fragment.append(___el);
};
return ___fragment;
}
{
/* CSS CONTENT */ var style=document.createElement('style');
 
 style.textContent=`@keyframes zoom-in-modal{0%{transform: translate(-50%, -50%) scale(0.4); opacity:0}100%{transform: translate(-50%, -50%) scale(1); opacity:1}}@keyframes blur-filter-back{0%{backdrop-filter: blur(0px);background:#0000;}100%{backdrop-filter: blur(1px);background:#0001;}} .modal{position:fixed;	left:0px;right:0px;	top:0px;bottom:0px;	background:#0004;	z-index:10;} .modal .modal-inside{background:white;		display:inline-flex;		flex-direction:column;		transform: translate(-50%, -50%);    left: 50%;    top: 50%;    position: relative;		width:50%;transition:width .3s, height .3s;		max-height:90vh;		min-height:100px;}@media only screen and (max-width: 600px){ .modal .modal-inside{width:80%;}} .modal .modal-inside .modal-title{font-weight:500;			display:flex;			margin-bottom:0px;} .modal .modal-inside .modal-title >*{display:inline-block;} .modal .modal-inside .modal-title .modal-icon{font-size: 29px;				margin: -4px;				margin-left: 2px;} .modal .modal-inside .modal-title .modal-icon.info{color: var(--info,#49F);} .modal .modal-inside .modal-title .modal-icon.error{color: var(--error,#F62);} .modal .modal-inside .modal-title .modal-icon.success{color: var(--success,#4caf50);} .modal .modal-inside .modal-title .modal-icon.question{color: var(--question,#00BCD4);} .modal .modal-inside .modal-title .modal-title-inside{flex:1;				text-overflow: ellipsis;				overflow: hidden;				white-space: pre;} .modal .modal-inside .modal-title .modal-button{cursor:pointer; user-select:none;				display: inline-flex;    		align-items: center;				justify-content:center;} .modal .modal-inside .modal-title .modal-button i{font-size:13px} .modal .modal-inside .modal-title .modal-icon{margin-right:-12px;				display: inline-flex;				align-items: center;				justify-content: center;} .modal .modal-inside .modal-content{overflow:auto;			flex:1;			text-overflow: ellipsis;			overflow: hidden;} .modal .modal-inside .modal-content.modal-padding{overflow-y:auto;} .modal .modal-inside .modal-footer{overflow:auto;			text-overflow: ellipsis;			overflow: hidden;} .modal .modal-inside .modal-footer:empty{display:none;} .modal .modal-inside .modal-padding{padding:12px;} .modal.expanded .modal-inside{max-height:100vh!important;		height: calc( 100vh - 45px )!important;		width:90%!important;} .modal{animation: blur-filter-back .1s ease-in-out 0s 1 forwards;} .modal .modal-inside{animation: zoom-in-modal .15s cubic-bezier(0.4, 0.8, 0.7, 1.2) .1s 1 forwards;} .modal-1 .modal .modal-inside{box-shadow:0px 0px 3px #0008;		opacity:0;} .modal-1 .modal .modal-inside .modal-button.close:hover{background: #F30;    	color: #fff;} .modal-1 .modal .modal-inside .modal-button.expand:hover{background: #07F;    	color: #fff;} .modal-1 .modal .modal-inside .modal-button:active{box-shadow:inset 0px 0px 0px 100px #0001;} .modal-1 .modal .modal-inside .modal-title{background:#EEE;			border-bottom:2px solid #DDD;} .modal-1 .modal .modal-inside .modal-title >*{padding:10px 16px;} .modal-1 .modal.expanded .modal-inside{max-height:100vh;			height:calc(100vh + 0px)!important;			width:calc(100% + 0px)!important;			border: none;			margin: 0px;}  .modal.modal-1 .modal-inside{box-shadow:0px 0px 3px #0008;		opacity:0;}  .modal.modal-1 .modal-inside .modal-button.close:hover{background: #F30;    	color: #fff;}  .modal.modal-1 .modal-inside .modal-button.expand:hover{background: #07F;    	color: #fff;}  .modal.modal-1 .modal-inside .modal-button:active{box-shadow:inset 0px 0px 0px 100px #0001;}  .modal.modal-1 .modal-inside .modal-title{background:#EEE;			border-bottom:2px solid #DDD;}  .modal.modal-1 .modal-inside .modal-title >*{padding:10px 16px;}  .modal.modal-1.expanded .modal-inside{max-height:100vh;			height:calc(100vh + 0px)!important;			width:calc(100% + 0px)!important;			border: none;			margin: 0px;} .modal-2 .modal .modal-inside{box-shadow:0px 0px 5px #0003;		border-radius:4px;		padding:12px;		opacity:0;} .modal-2 .modal .modal-inside .modal-title{border-radius:4px 4px 0px 0px;			background:white;			border-bottom:2px solid #EEE;			margin:-12px -12px;			margin-bottom:0px;} .modal-2 .modal .modal-inside .modal-title >*{padding:12px;} .modal-2 .modal .modal-inside .modal-title .modal-button:hover{color:#0006;} .modal-2 .modal .modal-inside .modal-title .modal-button:active{color:#000A;} .modal-2 .modal .modal-inside .modal-content{margin:0px -12px;} .modal-2 .modal .modal-inside .modal-footer{margin:0px -12px;} .modal-2 .modal .modal-inside .modal-footer{margin-bottom:-12px;}  .modal.modal-2 .modal-inside{box-shadow:0px 0px 5px #0003;		border-radius:4px;		padding:12px;		opacity:0;}  .modal.modal-2 .modal-inside .modal-title{border-radius:4px 4px 0px 0px;			background:white;			border-bottom:2px solid #EEE;			margin:-12px -12px;			margin-bottom:0px;}  .modal.modal-2 .modal-inside .modal-title >*{padding:12px;}  .modal.modal-2 .modal-inside .modal-title .modal-button:hover{color:#0006;}  .modal.modal-2 .modal-inside .modal-title .modal-button:active{color:#000A;}  .modal.modal-2 .modal-inside .modal-content{margin:0px -12px;}  .modal.modal-2 .modal-inside .modal-footer{margin:0px -12px;}  .modal.modal-2 .modal-inside .modal-footer{margin-bottom:-12px;}  .modal-3 .modal .modal-inside{box-shadow:0px 0px 5px #0003;		border-radius:4px;		padding:12px;		opacity:0;}  .modal-3 .modal .modal-inside .modal-title{border-radius:4px 4px 0px 0px;			background:white;			border-bottom:2px solid #EEE;			margin:-12px -12px;			margin-bottom:0px;}  .modal-3 .modal .modal-inside .modal-title >*{padding:12px;}  .modal-3 .modal .modal-inside .modal-title .modal-button:hover{color:#0006;}  .modal-3 .modal .modal-inside .modal-title .modal-button:active{color:#000A;}  .modal-3 .modal .modal-inside .modal-content{margin:0px -12px;}  .modal-3 .modal .modal-inside .modal-footer{margin:0px -12px;}  .modal-3 .modal .modal-inside .modal-footer{margin-bottom:-12px;}  .modal.modal-3 .modal-inside{box-shadow:0px 0px 5px #0003;		border-radius:4px;		padding:12px;		opacity:0;}  .modal.modal-3 .modal-inside .modal-title{border-radius:4px 4px 0px 0px;			background:white;			border-bottom:2px solid #EEE;			margin:-12px -12px;			margin-bottom:0px;}  .modal.modal-3 .modal-inside .modal-title >*{padding:12px;}  .modal.modal-3 .modal-inside .modal-title .modal-button:hover{color:#0006;}  .modal.modal-3 .modal-inside .modal-title .modal-button:active{color:#000A;}  .modal.modal-3 .modal-inside .modal-content{margin:0px -12px;}  .modal.modal-3 .modal-inside .modal-footer{margin:0px -12px;}  .modal.modal-3 .modal-inside .modal-footer{margin-bottom:-12px;} .modal-3 .modal .modal-inside{max-height:80vh;} .modal-3 .modal .modal-inside .modal-title .modal-button{box-sizing:border-box;				transform:translate(21px,-21px);				border-radius:100%;				margin-left:6px;				background:#000;				width:43px;				height:43px;				text-align:center;				color:white;				border:2px solid white;				box-shadow:0px 0px 2px black;								transition:transform .3s;} .modal-3 .modal .modal-inside .modal-title .modal-button:hover{color:white; transform:translate(20px,-20px) scale(1.2);} .modal-3 .modal .modal-inside .modal-title .modal-button:active{color:white; transform:translate(20px,-20px) scale(1.1);} .modal-3 .modal .modal-inside .modal-title .modal-icon{box-sizing:border-box;				text-shadow:0px 0px 2px;				transform: translate(-20px ,-20px);				background:white;				border-radius:100%;				width:51px;				height:51px;				border:2px solid;				display:inline-flex;				align-items:center;				justify-content:center;				font-size:35px;				margin-right: -29px;}  .modal.modal-3 .modal-inside{max-height:80vh;}  .modal.modal-3 .modal-inside .modal-title .modal-button{box-sizing:border-box;				transform:translate(21px,-21px);				border-radius:100%;				margin-left:6px;				background:#000;				width:43px;				height:43px;				text-align:center;				color:white;				border:2px solid white;				box-shadow:0px 0px 2px black;								transition:transform .3s;}  .modal.modal-3 .modal-inside .modal-title .modal-button:hover{color:white; transform:translate(20px,-20px) scale(1.2);}  .modal.modal-3 .modal-inside .modal-title .modal-button:active{color:white; transform:translate(20px,-20px) scale(1.1);}  .modal.modal-3 .modal-inside .modal-title .modal-icon{box-sizing:border-box;				text-shadow:0px 0px 2px;				transform: translate(-20px ,-20px);				background:white;				border-radius:100%;				width:51px;				height:51px;				border:2px solid;				display:inline-flex;				align-items:center;				justify-content:center;				font-size:35px;				margin-right: -29px;}`;

;document.head.append(style);}