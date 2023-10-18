const port = process.env.PORT || 3001;
const express = require("express");
const app = express();
const booksRoutes = require("./routes/books")
require('dotenv').config()
const mongoose = require("mongoose");
// const { Book } = require("./model/Book")
// const { books } = require("./db/books")

const password = process.env.PASSWORD

mongoose.connect(`mongodb+srv://mbrookmanbyrne:${password}@tdabooksdatabase.gepaymy.mongodb.net/?retryWrites=true&w=majority`)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected!")
});

// // adding the books to mongodb
// books.forEach(item => {
//     const book = new Book({
//         id: item.id,
//         author: item.author,
//         title: item.title,
//         published: item.published,
//         readStatus: item.readStatus
//     })
//     book.save();
// })

// const book = new Book({
//     id: 8,
//     author: "Jane Austen",
//     title: "Emma",
//     published: "1815",
//     readStatus: false
// })

// book.save();


app.use(express.json({ extended: false })); // we do this because the browser cannot read json format on it's own. IMPORTANT! NOTE - this did not work without adding ({ extended: false })...

app.use("/books", booksRoutes); // this is the magic line of code that lets us use the "routes" file which makes life easier. 

app.get("/", (req, res) => {
    res.send(`this is the empty main page - try localhost:${port}/books instead`)
})

app.get("/health", (req, res) => {
    res.json({
      status: "okay",
    });
  });


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})