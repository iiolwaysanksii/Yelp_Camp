//We can name it anything but by calling it index, the file becomes default import
//that's it, if you want call it anything else
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middlewareObj = {}

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error","You need to be loggedIn First!!")
    res.redirect("/login")
}

middlewareObj.checkCommentOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){
                req.flash("error","Comment not found!")
                res.redirect("back")
            } else {
                //remember can't directly compare
                if(foundComment.author.id.equals(req.user._id)){
                    next()
                } else {
                    req.flash("You do not have permission to do that.")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error","You need to be loggedIn first")
        res.redirect("back")
    }
}

 middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(err){
                req.flash("error","Campground not found")
                res.redirect("back")
            } else {
                //remember can't directly compare
                if(foundCampground.author.id.equals(req.user._id)){
                    next()
                } else {
                    req.flash("error","You do not have permission to do that.")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error","You need to be loggedIn first")
        res.redirect("back")
    }
}

module.exports = middlewareObj