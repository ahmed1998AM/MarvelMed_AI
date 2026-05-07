const mongoose = require('mongoose');

const radiologyExamSchema = new mongoose.Schema({
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
  modality: {
    type: String,
    enum: ['xray', 'ct', 'mri', 'ultrasound', 'nuclear_medicine', 
           'pet', 'mammography', 'fluoroscopy', 'dexa', 'angiography'],
    required: true,
    index: true
  },
  bodyPart: {
    type: String,
    required: true,
    index: true
  },
  bodyRegion: {
    type: String,
    enum: ['head', 'neck', 'chest', 'abdomen', 'pelvis', 'spine', 
           'upper_limb', 'lower_limb', 'whole_body'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  indications: [String],
  contraindications: [String],
  preparationInstructions: [String],
  procedureSteps: [String],
  views: [String],
  contrastRequired: {
    type: Boolean,
    default: false
  },
  contrastType: {
    type: String,
    enum: ['oral', 'iv', 'rectal', 'intrathecal', 'intra_articular', 'none']
  },
  radiationDose: {
    effective_dose: Number,
    unit: String,
    dlp: Number,
    ctdi: Number
  },
  duration: {
    type: Number,
    unit: {
      type: String,
      enum: ['minutes', 'hours'],
      default: 'minutes'
    }
  },
  normalFindings: String,
  commonAbnormalities: [{
    name: String,
    appearance: String,
    differentialDiagnosis: [String]
  }],
  reportingGuidelines: String,
  followUpRecommendations: String,
  relatedExams: [{
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RadiologyExam'
    },
    relationship: {
      type: String,
      enum: ['alternative', 'complementary', 'follow_up', 'more_detailed']
    }
  }],
  sampleImages: [{
    url: String,
    condition: String,
    view: String,
    annotation: String
  }],
  aiCapabilities: {
    detectionSupported: Boolean,
    segmentationSupported: Boolean,
    classificationSupported: Boolean,
    measurementSupported: Boolean,
    supportedConditions: [String]
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
  emergencyAvailable: {
    type: Boolean,
    default: true
  },
  pediatricProtocol: {
    available: Boolean,
    notes: String
  },
  safetyConsiderations: [String],
  artifacts: [{
    name: String,
    cause: String,
    prevention: String
  }],
  qualityCriteria: [String],
  loincCode: String,
  cptCode: String,
  snomedCode: String,
  icd10PCSCode: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
radiologyExamSchema.index({ name: 'text', description: 'text' });
radiologyExamSchema.index({ modality: 1, bodyPart: 1 });
radiologyExamSchema.index({ bodyRegion: 1, available: 1 });

// Search method
radiologyExamSchema.statics.searchExams = async function(query, modality = null, bodyPart = null) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { indications: { $regex: query, $options: 'i' } }
    ],
    available: true
  };
  
  if (modality) searchQuery.modality = modality;
  if (bodyPart) searchQuery.bodyPart = { $regex: bodyPart, $options: 'i' };
  
  return this.find(searchQuery).limit(50);
};

// Get exams by body region
radiologyExamSchema.statics.getByBodyRegion = async function(region) {
  return this.find({ bodyRegion: region, available: true })
    .sort({ modality: 1, name: 1 });
};

module.exports = mongoose.model('RadiologyExam', radiologyExamSchema);
