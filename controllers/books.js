let { books } = require("../db/books")
const createError = require("http-errors");


// return all books
exports.getBooks = (req, res) => {
    res.send(books)
}

// return books by id
exports.getBookById = (req, res, next) => {
    const { id } = req.params; // note, here we're using destructuring - we could equally use id = req.params.id;
    const book = books.find(book => book.id === Number(id));

    if (!book) {
        return next(createError(404, "No book"))
    }
    res.send(book)
}

// return all books by an author
exports.allBooksByAuthor = (req, res, next) => {
    const { author } = req.params
    // const booksByAuthor = books.filter(book => book.author.toLocaleLowerCase() === author)

    // this finds all the books by an author's surname
    const booksByAuthor = books.filter(book => book.author.split(' ')[1].toLocaleLowerCase() === author)
    res.send(booksByAuthor)
}

// add a book
exports.addBook = (req, res, next) => {   
    const data = req.body;
    books.push(data);
    res.send(books)
}

// remove a book by id
exports.removeBook = (req, res, next) => {
    // splice method 
    const { id } = req.params
    const index = books.map(book => book.id).indexOf(Number(id))

    if (index === -1) {
        return next(createError(404, "no such book"))
        next()
    } 

    books.splice(index, 1)
    return res.send(books)
    
    // filter method
    // const { id } = req.params
    // books = books.filter(book => book.id != id)
    // res.send(books)
}

// update a book

exports.updateBook = (req, res, next) => {
    
    // get the id from the route params
    const { id } = req.params
    // find the index of that item in the books array
    const index = books.map(book => book.id).indexOf(Number(id))
    // if the book doesn't exist, send an error
    if (index === -1) {
        next(createError(404, "no such book"))
        next()
        return res.send("status: 404 - no such book")
    } 

    // use Object.assign to update the relevant entry
    Object.assign(books[index], req.body);
    // send the updated books list back
    res.send(books)
}

