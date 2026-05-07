const express = require('express');
const router = express.Router();
const MedicineService = require('../../services/medicine.service');
const authMiddleware = require('../../middleware/auth.middleware');

const medicineService = new MedicineService();

/**
 * @route   POST /api/medicine/search
 * @desc    Search for medicines by name or keyword
 * @access  Private
 */
router.post('/search', authMiddleware, async (req, res) => {
  try {
    const { query, category, limit } = req.body;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال كلمة بحث صالحة (حرفين على الأقل)'
      });
    }
    
    const result = await medicineService.searchMedicines(query, { category, limit });
    
    res.json(result);
  } catch (error) {
    console.error('Medicine search error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/medicine/:id
 * @desc    Get detailed medicine information
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await medicineService.getMedicineDetails(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Get medicine details error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/medicine/identify
 * @desc    Identify medicine from image
 * @access  Private
 */
router.post('/identify', authMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'يرجى رفع صورة الدواء'
      });
    }
    
    const result = await medicineService.identifyFromImage(
      req.file.buffer,
      req.file.originalname
    );
    
    res.json(result);
  } catch (error) {
    console.error('Medicine identification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/medicine/check-interactions
 * @desc    Check drug interactions
 * @access  Private
 */
router.post('/check-interactions', authMiddleware, async (req, res) => {
  try {
    const { medicineIds } = req.body;
    
    if (!Array.isArray(medicineIds) || medicineIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'يرجى اختيار دوائين على الأقل للتحقق من التفاعلات'
      });
    }
    
    const result = await medicineService.checkInteractions(medicineIds);
    res.json(result);
  } catch (error) {
    console.error('Drug interaction check error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/medicine/category/:category
 * @desc    Get medicines by category
 * @access  Private
 */
router.get('/category/:category', authMiddleware, async (req, res) => {
  try {
    const { limit, sortBy } = req.query;
    const result = await medicineService.getByCategory(req.params.category, {
      limit: parseInt(limit) || 50,
      sortBy: sortBy || 'name'
    });
    res.json(result);
  } catch (error) {
    console.error('Get medicines by category error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/medicine/:id/similar
 * @desc    Get similar medicines
 * @access  Private
 */
router.get('/:id/similar', authMiddleware, async (req, res) => {
  try {
    const { limit } = req.query;
    const result = await medicineService.getSimilarMedicines(
      req.params.id,
      parseInt(limit) || 10
    );
    res.json(result);
  } catch (error) {
    console.error('Get similar medicines error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
