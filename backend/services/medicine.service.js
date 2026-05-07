const Medicine = require('../models/Medicine');
const ActivityLog = require('../models/ActivityLog');

/**
 * Medicine Service - Drug identification and information service
 * Supports search by name, image recognition, and detailed drug information
 */
class MedicineService {
  constructor() {
    this.categories = {
      antibiotic: 'مضاد حيوي',
      painkiller: 'مسكن للألم',
      antipyretic: 'خافض للحرارة',
      antihistamine: 'مضاد للهستامين',
      antidepressant: 'مضاد للاكتئاب',
      antihypertensive: 'خافض لضغط الدم',
      antidiabetic: 'مضاد للسكري',
      anticoagulant: 'مضاد للتجلط',
      steroid: 'ستيرويد',
      vitamin: 'فيتامين',
      mineral: 'معدن',
      probiotic: 'بروبيوتيك',
      antifungal: 'مضاد للفطريات',
      antiviral: 'مضاد للفيروسات',
      chemotherapy: 'علاج كيميائي'
    };
  }

  /**
   * Search medicines by name or keyword
   */
  async searchMedicines(query, options = {}) {
    const { limit = 20, category = null } = options;
    
    try {
      let results;
      
      if (query.length >= 3) {
        results = await Medicine.searchMedicines(query, limit);
      } else {
        results = await Medicine.find({ 
          available: true,
          ...(category && { category })
        })
        .limit(limit)
        .select('name scientificName brandNames category uses prescriptionRequired availability');
      }
      
      // Log activity
      await this.logActivity('medicine_search', { query, resultsCount: results.length });
      
      return {
        success: true,
        count: results.length,
        medicines: results.map(med => ({
          id: med._id,
          name: med.name,
          scientificName: med.scientificName,
          brandNames: med.brandNames,
          category: this.categories[med.category] || med.category,
          uses: med.uses.slice(0, 5),
          prescriptionRequired: med.prescriptionRequired,
          availability: med.availability
        }))
      };
    } catch (error) {
      console.error('Medicine search error:', error);
      throw new Error('فشل البحث عن الأدوية');
    }
  }

  /**
   * Get detailed medicine information
   */
  async getMedicineDetails(medicineId) {
    try {
      const medicine = await Medicine.findById(medicineId);
      
      if (!medicine) {
        throw new Error('الدواء غير موجود');
      }
      
      // Log activity
      await this.logActivity('medicine_view', { medicineId, medicineName: medicine.name });
      
      return {
        success: true,
        medicine: {
          id: medicine._id,
          name: medicine.name,
          scientificName: medicine.scientificName,
          brandNames: medicine.brandNames,
          category: this.categories[medicine.category] || medicine.category,
          description: medicine.description,
          uses: medicine.uses,
          indications: medicine.indications,
          contraindications: medicine.contraindications,
          sideEffects: medicine.sideEffects,
          warnings: medicine.warnings,
          dosage: medicine.dosage,
          administration: medicine.administration,
          interactions: medicine.interactions,
          pregnancy: medicine.pregnancy,
          breastfeeding: medicine.breastfeeding,
          storage: medicine.storage,
          manufacturer: medicine.manufacturer,
          availableForms: medicine.availableForms,
          prescriptionRequired: medicine.prescriptionRequired,
          controlledSubstance: medicine.controlledSubstance,
          images: medicine.images,
          synonyms: medicine.synonyms,
          priceRange: medicine.priceRange,
          availability: medicine.availability,
          lastUpdated: medicine.lastUpdated
        }
      };
    } catch (error) {
      console.error('Get medicine details error:', error);
      throw new Error('فشل الحصول على تفاصيل الدواء');
    }
  }

  /**
   * Identify medicine from image (OCR + AI analysis)
   */
  async identifyFromImage(imageBuffer, fileName) {
    try {
      // This would integrate with OCR service and AI vision
      // For now, return placeholder structure
      
      const AIService = require('./ai.service');
      const aiService = new AIService();
      
      // Analyze image with AI vision model
      const analysis = await aiService.analyzeImage(
        { buffer: imageBuffer, originalname: fileName },
        'general'
      );
      
      // Extract medicine name from analysis
      const extractedText = analysis.response;
      
      // Search for medicine based on extracted text
      const searchResults = await this.searchMedicines(extractedText.substring(0, 50), { limit: 5 });
      
      return {
        success: true,
        identifiedMedicines: searchResults.medicines,
        rawAnalysis: extractedText,
        confidence: searchResults.count > 0 ? 'high' : 'low'
      };
    } catch (error) {
      console.error('Medicine identification error:', error);
      throw new Error('فشل التعرف على الدواء من الصورة');
    }
  }

  /**
   * Check drug interactions
   */
  async checkInteractions(medicineIds) {
    try {
      const medicines = await Medicine.find({ _id: { $in: medicineIds } });
      
      const interactions = [];
      
      for (let i = 0; i < medicines.length; i++) {
        for (let j = i + 1; j < medicines.length; j++) {
          const med1 = medicines[i];
          const med2 = medicines[j];
          
          // Check if med1 has interaction with med2
          const interaction1 = med1.interactions?.find(int => 
            int.drug.toLowerCase().includes(med2.name.toLowerCase()) ||
            med2.brandNames.some(brand => int.drug.toLowerCase().includes(brand.toLowerCase()))
          );
          
          if (interaction1) {
            interactions.push({
              drugs: [med1.name, med2.name],
              severity: interaction1.severity,
              description: interaction1.description
            });
          }
        }
      }
      
      return {
        success: true,
        interactions,
        safe: interactions.length === 0
      };
    } catch (error) {
      console.error('Drug interaction check error:', error);
      throw new Error('فشل التحقق من التفاعلات الدوائية');
    }
  }

  /**
   * Get medicines by category
   */
  async getByCategory(category, options = {}) {
    try {
      const { limit = 50, sortBy = 'name' } = options;
      
      const medicines = await Medicine.find({ category, available: true })
        .sort({ [sortBy]: 1 })
        .limit(limit)
        .select('name scientificName brandNames uses prescriptionRequired availability');
      
      return {
        success: true,
        category: this.categories[category] || category,
        count: medicines.length,
        medicines
      };
    } catch (error) {
      console.error('Get medicines by category error:', error);
      throw new Error('فشل الحصول على الأدوية حسب الفئة');
    }
  }

  /**
   * Get similar medicines
   */
  async getSimilarMedicines(medicineId, limit = 10) {
    try {
      const medicine = await Medicine.findById(medicineId);
      
      if (!medicine) {
        throw new Error('الدواء غير موجود');
      }
      
      const similar = await Medicine.find({
        _id: { $ne: medicineId },
        category: medicine.category,
        available: true
      })
      .limit(limit)
      .select('name scientificName brandNames uses prescriptionRequired');
      
      return {
        success: true,
        baseMedicine: medicine.name,
        similarMedicines: similar
      };
    } catch (error) {
      console.error('Get similar medicines error:', error);
      throw new Error('فشل الحصول على الأدوية المشابهة');
    }
  }

  /**
   * Log activity for analytics
   */
  async logActivity(action, details) {
    try {
      // This would be called with actual userId in real implementation
      await ActivityLog.create({
        userId: 'system',
        action,
        category: 'medicine',
        description: `Medicine ${action}`,
        details,
        entityType: 'medicine',
        status: 'success'
      });
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  }
}

module.exports = MedicineService;
