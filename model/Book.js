const mongoose = require("mongoose")
const {Schema, model } = mongoose;

const bookSchema = new Schema ({
    id: Number,
    author: String,
    title: String,
    published: String,
    readStatus: Boolean
})

exports.Book = model("Book", bookSchema);