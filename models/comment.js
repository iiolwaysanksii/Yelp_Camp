var mongoose = require("mongoose")

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
})
//Storing both id and username, so that we don't have to look up username by id all the time
module.exports = mongoose.model ("Comment", commentSchema)