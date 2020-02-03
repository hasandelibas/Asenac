const fs = require("fs");
const md5 = require("md5");

console.Timer = function(...arg){
    var args = Array.from(arguments);
    var date = new Date();
    var dateDump = [ date.getFullYear() , date.getMonth() , date.getDay() , "-" ,
                     date.getHours() , date.getMinutes(), date.getSeconds()];
    
    args.splice(0,0, dateDump.join(" "));
    console.log.apply(console,args);
};





/**
 * @typedef {Object} Session.Options
 * @property {string} secretKey
 * @property {string} cookieName Session Cookie Name
 * @property {number} sessionTime Session Time second
 */

/**
 * 
 * @param {Session.Options} options 
 */
function Session(options){

    options = Object.assign( { secretKey: "41PHz1*z.vc69" , cookieName:"NSession", sessionTime: 900 } , options );
    let sessions = {};

    let sessionCount = 0;
    function getSessionHash(){
        sessionCount ++;
        return md5( options.secretKey + sessionCount ) + md5(  sessionCount + options.secretKey );
    }

    console.Timer("Session Manager Start!");
    return function(req,res,next){
        req.__session={};
        req.__sessionKey = null
        req.session = new Proxy({},{
            get:function(target,key){
                if(key=="destroy"){
                    return function(){
                        res.clearCookie(options.cookieName);
                    };
                }

                                
                if( key in req.__session){
                    return req.__session[key];
                }

                if( options.cookieName in req.cookies &&  
                    req.cookies[options.cookieName] in sessions &&
                    key in sessions[ req.cookies[options.cookieName] ]
                ){                    
                    return sessions[ req.cookies[options.cookieName] ][key]; 
                }else{
                    return null;
                }
            },
            set:function(target,key,value){
                var hash;
                if(req.__sessionKey){
                    hash = req.__sessionKey;
                }else if( options.cookieName in req.cookies && req.cookies[options.cookieName] in sessions ){
                    // Created Session
                    hash = req.cookies[options.cookieName];
                }else{
                    // Non Created Session
                    hash = getSessionHash();
                    res.cookie(options.cookieName, hash, { expires: new Date(Date.now() + options.sessionTime*1000), httpOnly: true });
                    sessions[hash] = {};
                    req.__sessionKey = hash;
                }
                sessions[hash][key] = value;
                req.__session[key] = value;
                return true;
            }
        });
        next();
        // req.cookie eşitlemesi
    };
    
}


exports.Session = Session;

/**
 * @typedef {Object} Session.LoginControl nick , pass ,name
 * @property {string} userPath
 * @property {Array.<string>} registerVariables register variables
 * @property {Array.<string>} loginVariables login variables
 * 
 */

class LoginControl{
    /**
     * 
     * @param {Session.LoginControl} options 
     */
    constructor(options){
        this.options = options;
        this.users = [];
        try{
            this.users  = JSON.parse(fs.readFileSync(options.userPath, 'utf8'));
        } catch (e){
            
            console.Timer(options.userPath+" file not found!");
        }
        this.triggerRegistered = null;
        
    }
    /**
     * @typedef Session.LoginOptions
     * @property {string} success Succesed Url
     * @property {string} fail Fail Url
     * @property {string} page Login Url
     */

     /**
     * 
     * @param {Session.LoginOptions} options 
     */
    Login(options){
        let that = this;
        return function(req,res,next){
            
            if(req.session.id){
                res.redirect(options.success)
            }

            if(req.body.nick==null && req.body.pass==null){
                if(options.page && req.url != options.page){
                    res.redirect(options.page);
                }else{
                    next();
                }
                return ;
            } 

            var user = that.users.findIndex( e =>e.nick==req.body.nick&&e.pass==req.body.pass);
            if(user!=-1){
                req.session.id = user;
                req.session.user = that.users[user]
                if(options.success){
                    res.redirect(options.success);
                }else{
                    next();
                }
            }else{
                if(options.fail){
                    res.redirect(options.fail);
                }else{
                    next();
                }
            }
            
        };
    };

    /**
     * @typedef Session.RegisterOptions
     * @property {string} success Success Url
     * @property {string} page Register Url
     */

     /**
      * 
      * @param {Session.RegisterOptions} options 
      */
    Register(options){
        

        let that = this;
        return function(req,res,next){
            if( req.body.nick != null && req.body.pass != null && req.body.name != null ){
                var id = that.users.push({
                    nick:req.body.nick,
                    pass:req.body.pass,
                    name:req.body.name
                });
                req.session.id = id-1;
                if(that.triggerRegistered) that.triggerRegistered(that.users[id-1]);
                if(options.success){
                    res.redirect(options.success);
                }else{
                    next();
                }
                fs.writeFile(that.options.userPath,JSON.stringify(that.users),'utf-8');
            }else{
                if(options.page){
                    res.redirect(options.page);
                }else{
                    next();
                }
            }
            
        };
    }

    /**
     * on Registered
     * @param {callback} callback (user) -> call
     */
    onRegistered(callback){
        this.triggerRegistered = callback;
    }

    Exit(){
        let that = this;
        return function(req,res,next){
            req.session.destroy();
            if(that.options.exitDirect){
                res.redirect(that.options.exitDirect);
            }else{
                next();
            }
        };
    }

    /**
     * 
     * @param {string} blockUrl if user is not sessionder redirect 
     */
    IsSession(blockUrl){
        return function (req,res,next) {
            if(req.session && req.session.id!=null){
                next()
            }else{
                res.redirect(blockUrl);
            }
        }
    }
    

}


exports.LoginControl = LoginControl;