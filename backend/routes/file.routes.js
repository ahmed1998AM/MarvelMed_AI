const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply authentication to all routes
router.use(protect);

// @route   POST /api/files/upload
// @desc    Upload medical file
// @access  Private
router.post('/upload', fileController.upload.single('file'), fileController.uploadFile);

// @route   GET /api/files
// @desc    Get user medical files
// @access  Private
router.get('/', fileController.getUserFiles);

// @route   DELETE /api/files/:id
// @desc    Delete medical file
// @access  Private
router.delete('/:id', fileController.deleteFile);

module.exports = router;
