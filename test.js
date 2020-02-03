const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require("ejs");
const Session = require("./session.js");
const fs = require("fs");
const path = require("path");
const LoginControl = new Session.LoginControl({
  "userPath":"storage/users.json"
});




app.all("/", async function (req, res) {
    //res.sendStatus(200)
    setTimeout(() => {
        res.send("Naber");
    }, 10000);
    

})




app.listen(8080, function () {
  console.Timer("Sunucu Başladı")
});