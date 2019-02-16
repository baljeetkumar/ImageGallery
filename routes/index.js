var    express         =  require("express"),
       router          =  express.Router(),
       User            =  require("../models/user"),
       passport        =  require("passport");
       
     
// register form  

router.get("/register",function(req,res){
          res.render("register");
     });

//HANDLE signup logic

router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","successfully registered");
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN form
router.get("/login",function(req,res){
    res.render("login");
});

// Handle login logic

router.post("/login", passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login"}), function(req,res){
    
    
});

//LOG OUT

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","logged you out");
    res.redirect("/");
});


//function to check

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
     req.flash("error","login first");
    res.redirect("/login");
}

module.exports=router;