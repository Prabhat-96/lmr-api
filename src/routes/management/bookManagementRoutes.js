const express = require('express');
const { addBook, getBook, deleteBook, updateBook, searchBook } = require('../../controllers/management/bookManagementController');
const bookManagementRouter = express.Router();

// Route to add a new book
bookManagementRouter.post('/addbook', addBook);
// Route to get book(s)
bookManagementRouter.get('/getbook', getBook);  
// Route to delete a book by its ID
bookManagementRouter.delete('/deletebook/:id', deleteBook);
// Route to update details of an existing book by ID
bookManagementRouter.put('/updatebook/:id', updateBook);
// Route to search books by title or author with pagination support
bookManagementRouter.get('/searchbook', searchBook);

module.exports = bookManagementRouter;