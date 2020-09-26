const express = require("express")
const campground = require("../models/campground")
const router = express.Router()
const Campground = require("../models/campground") 
const middleware = require("../middleware")

//INDEX ROUTE -> displays all campgrounds , GET
router.get("/", (req, res) => {
    Campground.find({}, (err, allcampgrounds)=>{
        if(err){
            console.error(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allcampgrounds})
        }
    })
})

//NEW ROUTE -> renders a form for a new input , GET
router.get("/new", middleware.isLoggedIn, (req, res)=> {
    res.render("campgrounds/new")
})

//CREATE ROUTE -> takes data from form and submits it, POST
router.post("/", middleware.isLoggedIn, (req, res) => {
    
    var newCampground = req.body.campground
    newCampground.author = {
        id: req.user._id,
        username: req.user.username
    }

    Campground.create(newCampground, (err, newlyCreated) => {
            if(err){
                console.error(err)
            } else{
                console.log(newlyCreated)
                res.redirect("/campgrounds")    //default is a get redirect
            }
        })
})

//SHOW ROUTE -> shows additional info about one object from INDEX ROUTE , GET
// /campgrounds/new comes before SHOW route as it'll treat any word as id
router.get("/:id", (req, res) =>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
        if(err){
            console.err(err)
        } else {
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })    
})

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) =>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){
            console.error(err)
        } else {
            res.render("campgrounds/edit", {campground: foundCampground})
        }
    })
})

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err){
            console.log(err)
        } else{
            res.redirect("/campgrounds/"+ req.params.id)
            //or take id from database->updatedCampground._id
        }
    })
})

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/campgrounds/"+ req.params.id)
        } else {
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router