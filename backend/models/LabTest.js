const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    enum: ['hematology', 'chemistry', 'immunology', 'microbiology', 'urinalysis',
           'coagulation', 'endocrinology', 'toxicology', 'genetics', 'pathology',
           'blood_gas', 'tumor_markers', 'cardiac_markers', 'infectious_disease'],
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  purpose: [String],
  specimenType: {
    type: String,
    enum: ['blood', 'urine', 'stool', 'sputum', 'csf', 'synovial_fluid',
           'pleural_fluid', 'peritoneal_fluid', 'saliva', 'swab', 'tissue', 'other'],
    required: true
  },
  specimenVolume: String,
  collectionMethod: String,
  preparationInstructions: [String],
  turnaroundTime: {
    routine: String,
    stat: String
  },
  referenceRanges: [{
    parameter: String,
    unit: String,
    ranges: [{
      gender: {
        type: String,
        enum: ['male', 'female', 'both']
      },
      ageMin: Number,
      ageMax: Number,
      min: Number,
      max: Number,
      criticalLow: Number,
      criticalHigh: Number
    }]
  }],
  clinicalSignificance: String,
  interpretation: String,
  limitations: [String],
  relatedTests: [{
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTest'
    },
    relationship: {
      type: String,
      enum: ['follow_up', 'confirmatory', 'alternative', 'complementary']
    }
  }],
  methods: [{
    name: String,
    principle: String,
    equipment: String
  }],
  qualityControl: {
    internalQC: [String],
    externalQA: [String],
    accreditation: [String]
  },
  cost: {
    amount: Number,
    currency: String
  },
  available: {
    type: Boolean,
    default: true
  },
  requiresAppointment: {
    type: Boolean,
    default: false
  },
  fastingRequired: {
    type: Boolean,
    default: false
  },
  images: [{
    url: String,
    type: String,
    description: String
  }],
  loincCode: String,
  cptCode: String,
  snomedCode: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
labTestSchema.index({ name: 'text', description: 'text' });
labTestSchema.index({ category: 1, available: 1 });
labTestSchema.index({ specimenType: 1 });

// Search method
labTestSchema.statics.searchTests = async function(query, category = null) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { purpose: { $regex: query, $options: 'i' } }
    ],
    available: true
  };
  
  if (category) searchQuery.category = category;
  
  return this.find(searchQuery).limit(50);
};

module.exports = mongoose.model('LabTest', labTestSchema);
