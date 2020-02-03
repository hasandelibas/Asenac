const fs = require("fs");
const path = require("path");

require("./cdn/asenac/js/delibas");
const Lss = require("./cdn/asenac/js/Lss").Lss;
const Asenac = require("./cdn/asenac/js/asenac.browser.function.min.js").Asenac;
const Karakod = require("./views/logined/js/karala.run").Karala_Run;

globalThis.Asenac = Asenac;
globalThis.Lss = Lss;

/** Express router providing user related routes
 * @module routers/users
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express');

const router = express.Router();

router.use("/src",express.static("src",{cacheControl:true}));


router.use("/view/:hash/*",(req,res,next)=>{
    // User Control & Hash Control

    req.projectUser = "delibaş";
    req.projectFolder = path.join(__dirname , "storage/projects/"+req.projectUser+"/"); 
    next();
})

router.get("/view*/page/:project/:name",(req,res)=>{
    var project = req.params.project;
    var name = req.params.name;

    var files = JSON.parse( fs.readFileSync(
        path.join(req.projectFolder , project ),"utf8"
      )
    )

    res.type(".html");
    res.send(Karakod.Page(files,name));
})

router.get("/view*/project/:project",(req,res)=>{
    var project = req.params.project;

    var files = JSON.parse( fs.readFileSync(
        path.join(req.projectFolder , project ),"utf8"
      )
    )

    res.type(".html");
    res.send(Karakod.Project(files));
})

router.get("/view*/export-plugin/:project/:name",(req,res)=>{
    var project = req.params.project;
    var name = req.params.name;

    var files = JSON.parse( fs.readFileSync(
        path.join(req.projectFolder , project ),"utf8"
      )
    );
    var file = null;
    TreeFilter(files,(i,text,id)=>{
        if(name==text.join(".")) file = i;
    })
    if(file==null){
        res.status(404).send("plugin name not found in project");
        return;
    }

    res.type('.js');
    res.send(Karakod.ExportPlugin(file,name));
})


router.get("/view*/export-library/:project",(req,res)=>{
    var project = req.params.project;

    var files = JSON.parse( fs.readFileSync(
        path.join(req.projectFolder , project ),"utf8"
      )
    )

    res.type('.js');
    res.send(Karakod.ExportLibrary(files));
})

router.get("/view*/export-project/:project/",(req,res)=>{
    var project = req.params.project;

    var files = JSON.parse( fs.readFileSync(
        path.join(req.projectFolder , project ),"utf8"
      )
    )
    var libraries = {};
    JSON.parse(files[0].library || "[]" ).forEach(e=>{
        libraries[e] = JSON.parse( fs.readFileSync(
                    path.join(req.projectFolder , e ),"utf8"
                )
            
        );
    })

    console.log("Export Project")

    res.type('.json');
    res.json(Karakod.ExportProject(files,libraries));
})

exports.ProjectManagerRouter = router;