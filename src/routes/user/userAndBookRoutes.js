const express = require('express');
const { getMe, getBooks, deleteBook, addBook, updateBook, getAllBooks } = require('../../controllers/user/userAndBookController');
const userAndBookRouter = express.Router();

// Route to get profile of authenticated user
userAndBookRouter.get('/getme', getMe);
// Route to get books owned by the authenticated user
userAndBookRouter.get('/getbooks', getBooks);
// Route to get all books present
userAndBookRouter.get('/getallbooks', getAllBooks);
// Route to delete a book by ID (only if owned by the authenticated user)
userAndBookRouter.delete('/deletebook/:id', deleteBook);
// Route to add a new book owned by the authenticated user
userAndBookRouter.post('/addbook', addBook);
// Route to update a book owned by the authenticated user by book ID
userAndBookRouter.put('/updatebook/:id', updateBook);

module.exports = userAndBookRouter;