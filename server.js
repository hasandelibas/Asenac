const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require("ejs");
const Session = require("./session.js");
const fs = require("fs");
const path = require("path");
const LoginControl = new Session.LoginControl({
  "userPath":"storage/users.json",
  "localhostDirect":false
});


const PORT = process.env.PORT || 8000





// Standarts Parsers
app.use(bodyParser.urlencoded({
  extended: true,
  limit:"1000mb"
}));
app.use(cookieParser());
app.set("view engine","ejs");



// Login - Signup Routers
app.use(express.static("views/public",{cacheControl:true}));
app.use("/cdn/",express.static("./cdn/"));


// Session
app.use(Session.Session({localhostDirect:true}));


app.use("/login",LoginControl.Login({page:"/login.html",success:"/profile",fail:"/login.html#error"}));
app.use("/exit",LoginControl.Exit());
// Current not create a new profile
//app.use("/register",LoginControl.Register({page:"/register.html",success:"/profile"}));

LoginControl.onRegistered(u=>{
  fs.mkdir("storage/projects/"+u.nick);
})

// Sessioned Routers


app.use(express.static("views/logined"));
app.use(express.static("../",{cacheControl:true}));


//#region EXPORT AREA
var ProjectManagerRouter = require("./project.manager").ProjectManagerRouter;
app.use(ProjectManagerRouter);
//#endregion


//#region Karakod Manager
app.get("/local-pen", function (req, res) {
  res.render("logined/pen-global");
})


// For Auto Start
app.use((req,res,next)=>{
  if(req.hostname=="localhost"){
    req.session.id = 1;
    req.session.user = { nick:"delibaş"}
  }
  next();
})


// Block Enters
app.use( LoginControl.IsSession("/login.html") );



/** LOGINED AREA */

app.get('/profile', function(req, res) {
  var link = path.join(__dirname , "storage/projects/"+req.session.user.nick);
  var list = fs.readdirSync( link,{withFileTypes:true}   );
  list = list.map((c,i,a)=>c.isFile() ? c.name : null).filter(e=>e!=null);

  res.render('logined/index', { name: req.session.user.name,projects:list });
});

app.get("/new-pen", function (req, res) {
  res.render("logined/pen");
})
app.all("/new-project/:name", function (req,res) {
  res.render("logined/pen", {
    newProject:req.params.name,
  });
})

app.get("/project/:name", function (req, res) {
  res.render("logined/pen", {
    projectName:req.params.name,
  });
})

app.post("/project-json/:name", function (req, res) {
  res.sendFile(path.join(__dirname , "storage/projects/"+req.session.user.nick+"/"+req.params.name ))
})



app.post("/save-project", function (req, res) {
  var loc = path.join(__dirname , "storage/projects/"+req.session.user.nick+"/"+req.body.name )
  var data = req.body.data;
  fs.writeFile(loc,data,{encoding:"utf8"},e=>{})
  res.send("OK");
})
//#endregion

app.listen(PORT , function () {
  console.Timer("Sunucu Başladı. Port:"+ PORT);
});