const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Text = require('../../models/text-modal/TextModal');
const User = require('../../models/user/UserModal'); // Assuming you have a User model
const verifyToken = require('../../middleweres/auth');
const { successHandler, errorHandler } = require('../../global/constants/response/resoponse');

const router = express.Router();
router.use(successHandler); // Use the success handler for all routes

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const errorMessages = errors.array().map(err => err.msg);
  //   const error = new Error(errorMessages);
  //   error.details = errors.array();
  //   return next(error);
  // }
  next();
};

// CREATE Text
router.post(
  '/create-text',
  verifyToken,
  [
    body('text').isString().withMessage('Text must be a string').notEmpty().withMessage('Text is required'),
    body('category').isString().withMessage('Category must be a string').notEmpty().withMessage('Category is required'),
    body('title').isString().withMessage('Title must be a string').notEmpty().withMessage('Title is required'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    const { text, category, title } = req.body;
    const user = req.user; // Assuming middleware populates req.user

    try {
      const newText = new Text({
        text,
        created_by: user.id,
        category,
        title,
      });

      await newText.save();
      res.success(['Text saved successfully'], { text: newText });
    } catch (err) {
      next(err);
    }
  }
);

// READ Text by ID
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid Text ID'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const text = await Text.findById(req.params.id);
      if (!text) {
        const error = new Error('Text not found');
        return next(error);
      }
      res.success(['Text retrieved successfully'], { text });
    } catch (err) {
      next(err);
    }
  }
);

// UPDATE Text
router.put(
  '/:id',
  verifyToken,
  [
    param('id').isMongoId().withMessage('Invalid Text ID'),
    body('text').optional().isString().withMessage('Text must be a string'),
    body('category').optional().isString().withMessage('Category must be a string'),
    body('title').optional().isString().withMessage('Title must be a string'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { text, category, title } = req.body;
      const updatedFields = { text, category, title };

      const updatedText = await Text.findByIdAndUpdate(
        req.params.id,
        { $set: updatedFields },
        { new: true, runValidators: true }
      );

      if (!updatedText) {
        const error = new Error('Text not found');
        return next(error);
      }

      res.success(['Text updated successfully'], { text: updatedText });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE Text
router.delete(
  '/:id',
  verifyToken,
  [
    param('id').isMongoId().withMessage('Invalid Text ID'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const deletedText = await Text.findByIdAndDelete(req.params.id);
      if (!deletedText) {
        const error = new Error('Text not found');
        return next(error);
      }

      res.success(['Text deleted successfully']);
    } catch (err) {
      next(err);
    }
  }
);

// LIST all Texts
router.get(
  '/get-all-text',
 
  async (req, res, next) => {
    try {
      const texts = await Text.find({});
      res.json({texts});
      // res.success(['Texts retrieved successfully'], { texts });
    } catch (err) {
      next(err);
    }
  }
);

// router.use(errorHandler); // Use the error handler for all routes

module.exports = router;
