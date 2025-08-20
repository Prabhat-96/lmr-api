const express = require('express');
const { addBook, getBook, deleteBook, updateBook, searchBook } = require('../../controllers/management/bookManagementController');
const bookManagementRouter = express.Router();

bookManagementRouter.post('/addbook', addBook);
bookManagementRouter.get('/getbook', getBook);
bookManagementRouter.delete('/deletebook/:id', deleteBook);
bookManagementRouter.put('/updatebook/:id', updateBook);
bookManagementRouter.get('/searchbook', searchBook);

module.exports = bookManagementRouter;