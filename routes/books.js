// book routes file

const express = require("express");
const router = express.Router();
const { getBooks, getBookById, addBook, removeBookById, updateBook, allBooksByAuthor } = require("../controllers/books");

// this is our collection of routes, which use "router" to access the various endpoints
router.get("/", getBooks) // get all books
router.get("/:id", getBookById) // return books by id
router.get("/author/:author", allBooksByAuthor) // return all books by a specified author
router.post("/add", addBook) // add books to the list
router.delete("/remove/:id", removeBookById) // delete by id
router.patch("/update/:id", updateBook)  // edit book listings


module.exports = router