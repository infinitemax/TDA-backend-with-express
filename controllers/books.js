let { books } = require("../db/books")
const createError = require("http-errors");
const { Book } = require("../model/Book")
const mongoose = require("mongoose");
require('dotenv').config()



// return all books
exports.getBooks = async (req, res, next) => {
    // this did not work until I made it an async function, which makes complete sense now I think of it...
    try {
        const allBooks = await Book.find({}, null, {sort: {_id: 1}})
        res.send(allBooks)
    } catch {
        console.log(error)

        res.send("There seems to have been an error!")
        return next(createError(500, "There seems to have been an error!"))
    }
}

// return books by id
exports.getBookById = async (req, res, next) => {
    const { id } = req.params;

    // this is the previous method that uses my own validation - going to try a new way using the error object
    try {
        // validate id --> instead of using regex, cast it to an object ID... - can access the error object to get the status code and error etc rather than writing specific validations.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) { 
            console.log('that is not a valid id')
            res.send(`${id} is not a valid id`)
            return next(createError(404, "That is not a valid ID"))
        }
        const bookById = await Book.findOne({ _id: `${id}`})
        if (bookById.length === 0) {
            res.send("There is no entry with that ID")
            return next(createError(404, "ID does not exist"))
        }
        res.send(bookById)
    } catch (error) {
        console.log(error)
        res.send("There seems to have been an error!")
        return next(createError(500, "There seems to have been an error"))
    }

    // // the old internal method
    // const { id } = req.params; // note, here we're using destructuring - we could equally use id = req.params.id;
    // const book = books.find(book => book.id === Number(id));

    // if (!book) {
    //     return next(createError(404, "No book"))
    // }
    // res.send(book)
}

// return all books by an author
exports.allBooksByAuthor = async (req, res, next) => {
    // get search term
    let { author } = req.params
    // capitalise
    author = author[0].toUpperCase() + author.slice(1)

    console.log(`searching for ${author}`)
    try {
        const booksByAuthor = await Book.find(
            // this is wild - using regex to search for entries containing the surname!
            { "author" : { "$regex": author } }
        )
        if (booksByAuthor.length === 0) {
            res.send("No books by that author")
            return next(createError(404, "No books by that author"))
        }
        res.send(booksByAuthor)
    } catch (error) {
        console.log(error)
        res.send("There seems to have been an error!")
        return next(createError(500, "Something has gone wrong..."))
    }
    

    // // previous code
    // const { author } = req.params
    // // const booksByAuthor = books.filter(book => book.author.toLocaleLowerCase() === author)

    // // this finds all the books by an author's surname
    // const booksByAuthor = books.filter(book => book.author.split(' ')[1].toLocaleLowerCase() === author)
    // res.send(booksByAuthor)
}

// add a book
exports.addBook = async (req, res, next) => { 
    const data = req.body;

    // // can do new book like this, but can also make it more succinct, per below (new Book(data))
    // newBook = new Book({
    //     id: Math.floor(Math.random() * 10000),
    //     author: data.author,
    //     title: data.title,
    //     published: data.published,
    //     readStatus: data.readStatus
    // })

    try {
        newBook = new Book(data)
        await newBook.save(); // Can I do this with create() instead?
        const allBooks = await Book.find({})
        res.send(allBooks)
    } catch (error) {
        console.log(error)
        res.send("There seems to have been an error!")
        next(createError(500, "There seems to have been an error!"))
    }
    

    // // old method
    // const data = req.body;
    // books.push(data);
    // res.send(books)
}

// remove a book by id
exports.removeBookById = async (req, res, next) => {
    
    const id = req.params.id
    
    try { 
        // validate id
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('that is not a valid id')
            res.send(`${id} is not a valid id`)
            return next(createError(404, "That is not a valid ID"))
        }
        // we're using the findByIdAndDelete mongoose method and sending back some useful info.
        const bookToDelete = await Book.findByIdAndDelete(id)
        if (!bookToDelete) {
            res.send("There's no book with that id")
            return next(createError(404, "no book with that id"))
        }

        console.log(`we have just deleted ${bookToDelete.title} by ${bookToDelete.author}`)

        res.send(`we have just deleted ${bookToDelete.title} by ${bookToDelete.author}`)
    } catch (error) {
        console.log(error)
        res.send("There seems to have been an error!")
        return next(createError(500, "There seems to have been an error!"))
    }

    
    
    // // splice method 
    // const { id } = req.params
    // const index = books.map(book => book.id).indexOf(Number(id))

    // if (index === -1) {
    //     return next(createError(404, "no such book"))
    //     next()
    // } 

    // books.splice(index, 1)
    // return res.send(books)
    
    // // filter method
    // // const { id } = req.params
    // // books = books.filter(book => book.id != id)
    // // res.send(books)
}

// update a book

exports.updateBook = async (req, res, next) => {
    
    const { id } = req.params
    const data = req.body

    try {
        // check whethe the id is the correct format using regex
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('that is not a valid id')
            res.send(`${id} is not a valid id`)
            return next(createError(404, "That is not a valid ID"))
        } 

        // check whether there is a book with the given id
        const bookToUpdate = await Book.find({_id: id})
        console.log(bookToUpdate)
        if (bookToUpdate.length === 0) {
            res.send('There is no book with that ID')
            console.log('There is no book with that ID')
            return next(createError(404, "No book with that ID"))
        }

        // update the entry
        await Book.updateOne({_id: id}, data)   
        
        // send the updated book
        const updatedBook = await Book.find({_id: id})
        return res.send(updatedBook)
    } catch (error) {
        console.log(error)
        res.send("There seems to have been an error!")
        return next(createError(500, "There seems to have been an error!"))
    }




    // // old code
    // // get the id from the route params
    // const { id } = req.params
    // // find the index of that item in the books array
    // const index = books.map(book => book.id).indexOf(Number(id))
    // // if the book doesn't exist, send an error
    // if (index === -1) {
    //     next(createError(404, "no such book"))
    //     next()
    //     return res.send("status: 404 - no such book")
    // } 

    // // use Object.assign to update the relevant entry
    // Object.assign(books[index], req.body);
    // // send the updated books list back
    // res.send(books)
}

