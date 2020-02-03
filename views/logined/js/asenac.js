const Karala_Project = {
    Load :function(json){
        if(json==null){
            rdFile.data = [ { _text:"index",_children:[],_id:1,_data:this.NewPenJson() } ] 
        }else{
            rdFile.data = json;
        }
        this.UpdateLeftMenuBar();
        Codes.library.setValue(val(rdFile.data[0].library,"[\n\t\n]"));
        Codes.scripts.setValue(val(rdFile.data[0].scripts,"@project\n@end\n<!-- Write Your Scripts-->"));

    },

    Save : function(){
        rdFile.data[0].library = Codes.library.getValue();
        rdFile.data[0].scripts = Codes.scripts.getValue();

        if(_Selected_Data)
            this.SaveLocal(_Selected_Data);
        $.ajax({
            url:"save-project",
            data:{
                data:JSON.stringify(rdFile.data),
                name:ProjectName
            },
            type:"POST"
        }).done(e=>console.log("DONE",e))
    },

    /***
     * Save Local file last editing
     */
    SaveLocal:function(node){
        //console.log("Save Local",node)
        node._data.ts = Codes.ts.doc.getValue();
        node._data.js = Codes.js.doc.getValue();
        node._data.css = Codes.css.doc.getValue();
        node._data.json = Codes.json.doc.getValue();
        node._data.asena = Codes.asena.doc.getValue();

        node._data["asenacType"] = document.getElementById("asenacType").value;
    },
    
    /**
     * Open File View Css, Asena, Js, Json ...
     * @param {*} node 
     */
    Open: function(node){
        if(_Selected_Data!=null){
            this.SaveLocal(_Selected_Data)
        }
        Codes.ts.doc.setValue( node._data.ts || "" );
        Codes.js.doc.setValue( node._data.js );
        Codes.css.doc.setValue( node._data.css );
        Codes.json.doc.setValue( node._data.json );
        Codes.asena.doc.setValue( node._data.asena );

        document.getElementById("asenacType").value = node._data["asenacType"] || "asenac/function";

        Codes.ts.clearHistory()
        Codes.js.clearHistory()
        Codes.css.clearHistory()
        Codes.json.clearHistory()
        Codes.asena.clearHistory()

        _Selected_Data = node;
        setTimeout(() => {
            Run()    
        }, 10);
        
    },
    

    NewPenJson : function() {
        return {css:"",json:"{}",asena:"",js:``,ts:""};
    },


    NewPen:function(){
        Swal.fire({
            position:"top-right",
            title: 'New Pen Name',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Create',
            cancelButtonText:"Cancel",
            showLoaderOnConfirm: true,    
        }).then(function(e){
            if("dismiss" in e) return;
            TreeFilter(rdFile.data ,e=>e._id == _Selected_ID)[0]._children.push({
                _text:e.value,
                _id:++_Last_LeftMenu_ID,
                _children:[],
                _data:Karala_Project.NewPenJson()
            })
        })
    },

    Rename:function(){
        
        Swal.fire({
            title: 'Rename',
            input: 'text',
            inputValue: _Selected_Data._text
        }).then(function(result) {
            if("dismiss" in result) return;
            if (result.value) {
                _Selected_Data._text = result.value;
            }
        })
    },

    Delete:function(){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                var parent = TreeFilter(rdFile.data ,e=>e._children.indexOf(_Selected_Data)>-1)[0];
                parent._children.popAt(
                    parent._children.indexOf(_Selected_Data)
                );
                rdFile = new RealData.RealData( JSON.parse(JSON.stringify(rdFile.data)) );
                _Selected_Data=null;
                _Selected_ID=-1;
                this.UpdateLeftMenuBar();

            }
          })

        
    },

    UpdateLeftMenuBar: function(){
        var projectMenu = document.getElementById("project-menu");
        rdFile.hooks = [];
        projectMenu.empty()
        projectMenu.appendChild(
            Asenac.Complie('tree-view',rdFile.data)
        )
        $(projectMenu.getElementsByTagName("li")[0]).click()
    },

    Scripts : function(){
        Modal({
            title:'<i class="fa fa-code"></i> Script',
            text:Codes.scripts.getWrapperElement(),
            expand:true
        })
        Codes.scripts.refresh(); 
    },

    Library : function(){
        Modal({
            title:'<i class="fa fa-archive"></i> Librarys',
            text:Codes.library.getWrapperElement(),
            expand:true
        })
        Codes.library.refresh(); 
    }
    
}






    
    


function Select(id){
    _Selected_ID=id;
    Karala_Project.Open(
        TreeFilter(rdFile.data,e=>e._id==_Selected_ID)[0]
    )
}

function CurrentPageName() {
    return Name(_Selected_Data);
}
function Name(data) {
    var name = "";
    TreeFilter(rdFile.data,(e,text,id)=>{
        if(e==data){
            name = text.join(".");
        }
    })[0]
    return name;
}

function Run() {
    if(_Selected_Data){
        Karala_Project.SaveLocal(_Selected_Data);
    }
    
    Karala_Run.ShowInIframe( 
        document.getElementById("run"),
        Karala_Run.Page(rdFile.data,CurrentPageName())
    );

}


function RunGlobal(){
    if(_Selected_Data)
        Karala_Project.SaveLocal(_Selected_Data);
    Karala_Run.ShowInIframe( 
        document.getElementById("run"),
        Karala_Run.Project(rdFile.data)
    );
}


function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}
  

function ViewPage() {
    openInNewTab("/view/page/"+ProjectName+"/"+CurrentPageName());
}
function ViewProject() {
    openInNewTab("/view/project/"+ProjectName);
}
function ExportPlugin(){
    openInNewTab("/view/export-plugin/"+ProjectName+"/"+CurrentPageName());
}

function ExportLibrary(){
    openInNewTab("/view/export-library/"+ProjectName);
}

function ExportProject(){
    openInNewTab("/view/export-project/"+ProjectName);
}






var _Selected_ID;
var _Selected_Data;
/***
 * Using for new ID
 */
var _Last_LeftMenu_ID=0;
var ProjectName = null;
var _Files = [
    {_text:"Project",_children:[],_id:1,_data:Karala_Project.NewPenJson()}
];

var rdFile = new RealData.RealData(_Files);



