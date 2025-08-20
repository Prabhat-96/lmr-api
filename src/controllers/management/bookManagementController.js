const Book = require('../../models/Book');

exports.addBook = async (req, res) => {
  try {
    const { title, author, publishedYear, genre } = req.body;
    const createdBy = req.user._id;

    if (!title || !author || !publishedYear || !genre) {
      return res.status(200).json({
        success: false,
        message: 'All book fields are required',
        data: null
      });
    }

    // Check if a book with same title already exists by any author
    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      return res.status(200).json({
        success: false,
        message: 'Book with this title already exists',
        data: null
      });
    }

    const book = new Book({
      title,
      author,
      publishedYear,
      genre,
      createdBy
    });

    await book.save();

    return res.status(200).json({
      success: true,
      message: 'Book added successfully',
      data: book
    });
  } catch (error) {
    console.error('addBook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error adding book',
      data: null
    });
  }
};

exports.getBook = async (req, res) => {
  try {
    const { id, page = 1, limit = 10 } = req.query;

    if (id) {
      const book = await Book.findById(id).populate('createdBy', '-password');
      if (!book) {
        return res.status(200).json({
          success: false,
          message: 'Book not found',
          data: null
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Book retrieved successfully',
        data: book
      });
    } else {
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const books = await Book.find()
        .populate('createdBy', '-password')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Book.countDocuments();

      return res.status(200).json({
        success: true,
        message: 'Books retrieved successfully',
        data: {
          books,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total
          }
        }
      });
    }
  } catch (error) {
    console.error('getBook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving books',
      data: null
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        success: false,
        message: 'Book ID is required',
        data: null
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(200).json({
        success: false,
        message: 'Book not found',
        data: null
      });
    }

    await book.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('deleteBook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting book',
      data: null
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publishedYear, genre } = req.body;

    if (!id) {
      return res.status(200).json({
        success: false,
        message: 'Book ID is required',
        data: null
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(200).json({
        success: false,
        message: 'Book not found',
        data: null
      });
    }

    if (title && title !== book.title) {
      const existing = await Book.findOne({ title });
      if (existing) {
        return res.status(200).json({
          success: false,
          message: 'Another book with this title already exists',
          data: null
        });
      }
      book.title = title;
    }

    
    if (author) book.author = author;
    if (publishedYear) book.publishedYear = publishedYear;
    if (genre) book.genre = genre;

    await book.save();

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('updateBook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating book',
      data: null
    });
  }
};

exports.searchBook = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const regex = new RegExp(search, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find({
      $or: [
        { title: regex },
      ]
    })
      .populate('createdBy', '-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments({
      $or: [
        { title: regex }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Books search results',
      data: {
        books,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('searchBook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error searching books',
      data: null
    });
  }
};
