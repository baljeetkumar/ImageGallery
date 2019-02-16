   var express         =  require("express"),
       router          =  express.Router({mergeParams: true}),
       camp            =  require("../models/campground"),
       comment         =  require("../models/comment");
       
//new comment form       

 router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
     camp.findById(req.params.id,function(err,campg){
         if(err){
             console.log(err);
         }
         else{
              res.render("comments/new",{camp:campg});
         }
     });
    
 });
 
 //================
 //comment post
 
  router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
     camp.findById(req.params.id,function(err,campg){
         if(err){
             res.redirect("campgrounds/campgrounds");
         }
         else{
             comment.create(req.body.comment,function(err,comm){
                 if(err){
                     console.log(err);
                 }
                 else{
                     // add username and id to the comment
                     comm.author.id = req.user._id;
                     comm.author.username = req.user.username;
                     comm.save();
                     campg.comments.push(comm);
                     campg.save();
                     res.redirect("/campgrounds/"+campg._id);
                 }
             });
         }
     });
 });
 
 //edit comment
 
 router.get("/campgrounds/:id/comments/:comment_id/edit",isauthor,function(req,res){
     comment.findById(req.params.comment_id,function(err,foundComm){
         if(err){
             res.redirect("back");
         }
         else{
          res.render("comments/edit",{campid:req.params.id,comm :foundComm});   
         }
     });
     
     
 });
 
 //update comment
 
 router.put("/campgrounds/:id/comments/:comment_id",isauthor,function(req,res){
     comment.findByIdAndUpdate(req.params.comment_id,req.body.comme,function(err,found){
         if(err){
             
             res.redirect("back");
         }
         else{
             req.flash("success","successfully updated");
             res.redirect("/campgrounds/"+req.params.id);
         }
     });
 });
 
 // delete comment
  router.get("/campgrounds/:id/comments/:comment_id",isauthor,function(req,res){
      comment.findByIdAndRemove(req.params.comment_id,function(err){
          if(err){
              res.redirect("back");
          }
          else {
            req.flash("success","successfully deleted");
              res.redirect("back");
          }
      });
  });
 
 //middleware
 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","login first");
    res.redirect("/login");
}

function isauthor(req,res,next){
  if(req.isAuthenticated()){
    comment.findById(req.params.comment_id,function(err,found){
       if(err){
         req.flash("error",err.message);
        res.redirect("back");
       }
       else{
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
  else{
   req.flash("error","login first");
   res.redirect("/login");
  }
}

module.exports=router;