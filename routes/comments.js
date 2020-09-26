const express = require("express")
const router = express.Router({mergeParams: true})
const Campground = require("../models/campground")
const Comment = require("../models/comment")
const middleware = require("../middleware")


//Comments new
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.error(err)
        } else{
            res.render("comments/new", {campground: campground})
        }
    })
})

//Comments Create
router.post("/", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            req.flash("error", "Something went wrong")
            res.redirect("/campgrounds")
        } else{
            Comment.create(req.body.comment, (err, newComment) => {
                if(err){
                    console.error(err)
                } else {
                    //add username and id to comment before push
                    newComment.author.id = req.user._id
                    newComment.author.username = req.user.username
                    newComment.save()   //Save the comment
                    //Also add this comment to right user in ysers database
                    campground.comments.push(newComment)
                    campground.save()
                    req.flash("Comment Added.")
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            res.redirect("back")
        } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
        }
    })
})

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){
            res.redirect("back")
        } else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back")
        } else {
            req.flash("success","Comment Deleted.")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

module.exports = router