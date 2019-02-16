var    express         =  require("express"),
       router          =  express.Router(),
       camp            =  require("../models/campground");
       
  
// landing page       
router.get("/",function(req,res){
    res.render("landing");
});

//campground page
router.get("/campgrounds",isLoggedIn,function(req,res){
        camp.find( {} , function(err,allCamp){
            if(err){
                console.log(err);
            }
            else {
                res.render("campgrounds/campgrounds",{campg : allCamp});
            }
        });
       
}
);


router.post("/campgrounds",isLoggedIn,function(req,res){
    var name=req.body.name;
    var image =req.body.image;
    var desc =req.body.description;
    var author={
        id:req.user._id,
        username: req.user.username
    }
    var obj ={name:name, image:image,description:desc,author:author};
   
   camp.create(obj ,function(err,newlyCreated){
       if(err){
           console.log(err);
       }
       else{
           req.flash("success","upload finished");
           res.redirect("/campgrounds");
       }
   });
    
});


//add campground form

router.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// view campground
router.get("/campgrounds/:id",isLoggedIn,function(req,res){
  
    camp.findById(req.params.id).populate("comments").exec( function(err,showall){
          if(err){
              console.log(err);
          }
          else{
              res.render("campgrounds/shows",{obj:showall});
          }
    });
  
});

// Edit campgrpund route

router.get("/campgrounds/:id/edit",checkOwnership,function(req,res){
    camp.findById(req.params.id,function(err,got){
        if(err){
            console.log(err);
        }
        else{
             res.render("campgrounds/edit",{obj : got});
        }
    });
   
});

//update campgorund route

router.put("/campgrounds/:id",checkOwnership,function(req,res){
  
    camp.findByIdAndUpdate(req.params.id,req.body.campg,function(err,updated){
        if(err){
            res.render("/campgrounds");
        }
        else{
            req.flash("success","successfully updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// destroy campground route

router.delete("/campgrounds/:id",checkOwnership,function(req,res){
    camp.findByIdAndRemove(req.params.id,function(err){
        if(err){
             req.flash("error",err.message);
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});



// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","login first");
    res.redirect("/login");
}


function checkOwnership(req,res,next){
    if(req.isAuthenticated()){
        camp.findById(req.params.id,function(err,found){
            if(err){
                 req.flash("error",err.message);
                res.redirect("back");
            }
            else{
                //does user own the post
                if(found.author.id.equals(req.user._id)){
                    next();
                }
                else{
                     req.flash("error","you are not allowed");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error","login first");
        res.redirect("back");
    }
};

module.exports=router;