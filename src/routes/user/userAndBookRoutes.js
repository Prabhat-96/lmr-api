const express = require('express');
const { getMe, getBooks, deleteBook, addBook, updateBook } = require('../../controllers/user/userAndBookController');
const userAndBookRouter = express.Router();

userAndBookRouter.get('/getme', getMe);
userAndBookRouter.get('/getbooks', getBooks);
userAndBookRouter.delete('/deletebook/:id', deleteBook);
userAndBookRouter.post('/addbook', addBook);
userAndBookRouter.put('/updatebook/:id', updateBook);

module.exports = userAndBookRouter;