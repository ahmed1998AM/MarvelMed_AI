const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  scientificName: {
    type: String,
    trim: true,
    index: true
  },
  brandNames: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['antibiotic', 'painkiller', 'antipyretic', 'antihistamine', 'antidepressant', 
           'antihypertensive', 'antidiabetic', 'anticoagulant', 'steroid', 'vitamin', 
           'mineral', 'probiotic', 'antifungal', 'antiviral', 'chemotherapy', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    required: true
  },
  uses: [{
    type: String
  }],
  indications: [{
    type: String
  }],
  contraindications: [{
    type: String
  }],
  sideEffects: [{
    type: String
  }],
  warnings: [{
    type: String
  }],
  dosage: {
    adult: String,
    children: String,
    elderly: String,
    notes: String
  },
  administration: {
    route: {
      type: String,
      enum: ['oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical', 
             'inhalation', 'nasal', 'rectal', 'vaginal', 'ophthalmic', 'otic']
    },
    frequency: String,
    duration: String,
    instructions: [String]
  },
  interactions: [{
    drug: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'contraindicated']
    },
    description: String
  }],
  pregnancy: {
    category: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'X', 'unknown']
    },
    notes: String
  },
  breastfeeding: {
    safe: Boolean,
    notes: String
  },
  storage: {
    temperature: String,
    conditions: [String],
    shelfLife: String
  },
  manufacturer: {
    name: String,
    country: String
  },
  availableForms: [{
    form: String,
    strength: String,
    packaging: String
  }],
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  controlledSubstance: {
    type: Boolean,
    default: false
  },
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['package', 'tablet', 'injection', 'syrup', 'other']
    },
    uploadedAt: Date
  }],
  synonyms: [String],
  atcCode: String,
  ndcCode: String,
  barcode: String,
  priceRange: {
    min: Number,
    max: Number,
    currency: String
  },
  availability: {
    type: String,
    enum: ['available', 'scarce', 'out_of_stock', 'discontinued'],
    default: 'available'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['manual', 'api', 'import', 'user_contribution'],
    default: 'manual'
  }
}, {
  timestamps: true
});

// Indexes for better search performance
medicineSchema.index({ name: 'text', scientificName: 'text', brandNames: 'text', description: 'text' });
medicineSchema.index({ category: 1 });
medicineSchema.index({ prescriptionRequired: 1 });
medicineSchema.index({ availability: 1 });

// Search method
medicineSchema.statics.searchMedicines = async function(query, limit = 20) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { scientificName: { $regex: query, $options: 'i' } },
      { brandNames: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  };
  
  return this.find(searchQuery)
    .limit(limit)
    .select('name scientificName brandNames category uses prescriptionRequired availability');
};

module.exports = mongoose.model('Medicine', medicineSchema);
