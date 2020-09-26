//Refactors previous files. and adds comments
const express       = require('express'),
bodyParser          = require('body-parser'),
mongoose            = require('mongoose'),
passport            = require("passport"),
LocalStrategy       = require("passport-local"),
methodOverride      = require("method-override"),
flash               = require("connect-flash"),
Campground          = require("./models/campground"),
Comment             = require("./models/comment"),
User                = require("./models/user")

const campgroundRoutes  = require("./routes/campgrounds")
commentRoutes           = require("./routes/comments"),
indexRoutes             = require("./routes/index")

const app = express()

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

//PASSPORT configuration
app.use(require("express-session")({
    secret: "I love Blackpink, and so should you",
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//This makes info about logged in user available on all routes
//so we don't have to pass it to every route ourselves
app.use((req, res, next)=>{
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use(indexRoutes)
app.use("/campgrounds", campgroundRoutes)
//:id parameter wouldn't normally pass through, so it would create issues
//with findbyId method to fix this use merge params in comment route
app.use("/campgrounds/:id/comments",commentRoutes)


app.listen(process.env.PORT, process.env.IP, ()=>{
        console.log(process.env.PORT)
        console.log(process.env.DATABASEURL)
})