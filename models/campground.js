var mongoose = require("mongoose")
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author: {
        //Remember campground.author.id is an object not a string
        //so we can't directly compare the authors id of a which is being accessed
        //to current logged in user id directly
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username: String
    },
    //array because this is array of comments and we are looping over them
    //can also be object, but it's better to keep it as array
    comments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
    
})
module.exports = mongoose.model("Campground", campgroundSchema)