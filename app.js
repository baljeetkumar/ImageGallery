var express         =  require("express"),
    app             =  express(),
    mongoose        =  require("mongoose"),
    passport        =  require("passport"),
    localStrategy   =  require("passport-local"),
    bodyParser      =  require("body-parser"),
    camp            =  require("./models/campground"),
    User            =  require("./models/user"),
    seedDB          =  require("./seeds"),
    flash           =  require("connect-flash"),
    methodOverride  =  require("method-override"),
    comment         =  require("./models/comment");
    
// requiring routes
    
var commentRoutes   = require("./routes/comment"),
    campgroundRoutes   = require("./routes/campgrounds"),
    indexRoutes   = require("./routes/index");
    
  
 mongoose.connect("mongodb://localhost/nature_camp",{ useNewUrlParser: true });
 app.use(bodyParser.urlencoded({extended:true,}));
 app.set("view engine","ejs");
 app.use(express.static(__dirname+ "/public"));
 app.use(methodOverride("_method"));
 app.use(flash());
 seedDB();


//PASSPORT CONFIGURATION 
  // ==============
  
  app.use(require("express-session")({
      secret:"once upon a time in ...",
      resave:false,
      saveUninitialized:false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  //to check currentuser
  app.use(function(req,res,next){
      res.locals.currentUser = req.user;
      res.locals.error =req.flash("error");
       res.locals.success =req.flash("success");
      next();
  });
  
  app.use(indexRoutes);
  app.use(campgroundRoutes);
  app.use(commentRoutes);
  
  app.listen(process.env.PORT,process.env.IP,function(){
    console.log("app has started");
     });