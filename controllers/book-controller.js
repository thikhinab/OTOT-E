import Book from "../models/book-model.js";
import getOrSetCache from "../redis/cache.js";

// Get all books
const getAll = async (req, res) => {
    try {
        const books = await Book.find();
        res.json({
            status: "success",
            message: "All books retrieved",
            data: books,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

// Get all books
const getAllCached = async (req, res) => {
    try {
        const books = await getOrSetCache("books", async () => {
            const data = await Book.find();
            return data;
        });

        res.json({
            status: "success",
            message: "All books retrieved",
            data: books,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

// Create new book
const createBook = async (req, res) => {
    if (!req.body.isbn13 || !req.body.author || !req.body.title) {
        return res.status(400).json({
            status: "error",
            message: "Request body should have isbn13, author and title",
        });
    }

    try {
        const book = await Book.create({
            isbn13: req.body.isbn13,
            author: req.body.author,
            title: req.body.title,
        });
        res.status(201).json({
            status: "success",
            message: "New book created",
            data: book,
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

// Get book by isbn13
const getByIsbn13 = async (req, res) => {
    try {
        const book = await Book.findOne({ isbn13: req.params.isbn13 });
        if (book) {
            res.json({
                status: "success",
                message: "Book found",
                data: book,
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Book not found",
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            message: err.message,
        });
    }
};

// Update book by isbn13
const updateByIsbn13 = async (req, res) => {
    if (!req.body.author || !req.body.title) {
        return res.status(400).json({
            status: "error",
            message: "Request body should have author and title.",
        });
    }

    try {
        const book = await Book.findOne({ isbn13: req.params.isbn13 });
        if (!book) {
            return res.status(404).json({
                status: "error",
                message: "Book not found",
            });
        }

        book.author = req.body.author;
        book.title = req.body.title;
        await book.save();

        res.json({
            status: "success",
            message: "Book updated",
            data: book,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

// Delete book by isbn13
const deleteByIsbn13 = async (req, res) => {
    try {
        const book = await Book.findOne({ isbn13: req.params.isbn13 });
        if (!book) {
            return res.status(404).json({
                status: "error",
                message: `Book with ISBN13:${req.params.isbn13} does not exist`,
            });
        }

        await book.delete();
        res.json({
            status: "success",
            message: `Book with ISBN13:${req.params.isbn13} deleted`,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

export {
    getAll,
    getAllCached,
    createBook,
    getByIsbn13,
    deleteByIsbn13,
    updateByIsbn13,
};
