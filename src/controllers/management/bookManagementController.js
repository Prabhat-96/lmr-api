const Book = require('../../models/Book');

/**
 * Adds a new book to the database.
 * Validates required fields.
 * Ensures no other book with the same title exists.
 * Saves book with the authenticated user as creator.
 */

exports.addBook = async (req, res) => {
  try {
    const { title, author, publishedYear, genre } = req.body;
    const createdBy = req.user._id;

    // Validate all input presence
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

     // Create new book
    const book = new Book({
      title,
      author,
      publishedYear,
      genre,
      createdBy
    });

     // Save book to DB
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

/**
 * Retrieves books by ID with pagination
 * Populates creator info.
 * Supports pagination through query params.
 */
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
       // Pagination calculation
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get paginated books list
      const books = await Book.find()
        .populate('createdBy', '-password')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

          // Total count for pagination
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

/**
 * Deletes a book by given ID.
 * Validates ID exist and book exist.
 */
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


/**
 * Updates a book by given ID.
 * Validates ID and book existence.
 * Checks for title uniqueness if updated.
 * Updates provided fields.
 */
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

    // Check title uniqueness if title is changed
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

    // Update fields if provided
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


/**
 * Searches for books by title with pagination
 * Performs case-insensitive match on title
 */
exports.searchBook = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    // Create case-insensitive regex for search
    const regex = new RegExp(search, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Find matching books
    const books = await Book.find({
      $or: [
        { title: regex },
      ]
    })
      .populate('createdBy', '-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Total count for pagination
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
