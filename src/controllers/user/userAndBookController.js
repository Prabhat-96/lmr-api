const User = require('../../models/User');
const Book = require('../../models/Book');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User profile retrieved',
      data: user
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile',
      data: null
    });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { id, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    if (id) {
      const book = await Book.findOne({ _id: id, createdBy: userId })
        .populate('createdBy', '-password');
      if (!book) {
        return res.status(200).json({
          success: false,
          message: 'Book not found or not authorized',
          data: null
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Book retrieved',
        data: book
      });
    } else {
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const books = await Book.find({ createdBy: userId })
        .populate('createdBy', '-password')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Book.countDocuments({ createdBy: userId });

      return res.status(200).json({
        success: true,
        message: 'User books retrieved',
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
    console.error('getBooks error:', error);
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
    const userId = req.user._id;

    const book = await Book.findOne({ _id: id, createdBy: userId });
    if (!book) {
      return res.status(200).json({
        success: false,
        message: 'Book not found or not authorized',
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

exports.addBook = async (req, res) => {
  try {
    const { title, author, publishedYear, genre } = req.body;
    const createdBy = req.user._id;

    if (!title || !author || !publishedYear || !genre) {
      return res.status(400).json({
        success: false,
        message: 'All book fields are required',
        data: null
      });
    }

    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      return res.status(409).json({
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

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, author, publishedYear, genre } = req.body;

    if (!id) {
      return res.status(200).json({
        success: false,
        message: 'Book ID is required',
        data: null
      });
    }

    const book = await Book.findOne({ _id: id, createdBy: userId });
    if (!book) {
      return res.status(200).json({
        success: false,
        message: 'Book not found or not authorized',
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
