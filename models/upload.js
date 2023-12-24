const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    filename: String,
    fileSize: Number,
    time: Date
});


const Post = mongoose.model('Post', postSchema);




module.exports = Post