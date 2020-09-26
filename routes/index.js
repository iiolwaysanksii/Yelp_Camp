const express = require("express")
const router = express.Router()  //doesn't have to be called router
const passport = require("passport")
const User = require("../models/user")

//Usually root should also redirect to INDEX route as the beginning page
router.get('/', (req, res) => res.render('home'))

//register new user new
router.get("/register", (req, res)=>{
    res.render("register")
})

//create new user
router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            req.flash("error", err.message)
            res.redirect("/register")
        } else {
                passport.authenticate("local")(req, res, ()=>{
                    req.flash("success", "Welcome to YelpCamp " + user.username)
                    res.redirect("/campgrounds")
                })
        }
    })
})

//new login
router.get("/login", (req, res)=>{
    res.render("login")
})

//submit login form
//passport.authenticate was setup above as User.authenticate
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res)=>{})


//logout
router.get("/logout", (req, res)=>{
    req.logout()
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds")
})

module.exports = router