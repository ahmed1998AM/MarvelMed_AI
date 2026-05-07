const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reportType: {
    type: String,
    required: true,
    enum: ['comprehensive', 'lab_analysis', 'radiology_report', 'consultation', 
           'prescription', 'referral', 'discharge', 'progress_note', 'insurance']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  patient: {
    name: String,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    medicalId: String,
    dateOfBirth: Date
  },
  doctor: {
    name: String,
    specialty: String,
    licenseNumber: String,
    contactInfo: String
  },
  facility: {
    name: String,
    address: String,
    phone: String,
    email: String
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  chiefComplaint: String,
  historyOfPresentIllness: String,
  pastMedicalHistory: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  allergies: [String],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    weight: Number,
    height: Number,
    bmi: Number
  },
  physicalExamination: {
    general: String,
    systems: [{
      system: String,
      findings: String
    }]
  },
  labResults: [{
    testName: String,
    value: String,
    unit: String,
    referenceRange: String,
    flag: {
      type: String,
      enum: ['normal', 'low', 'high', 'critical_low', 'critical_high']
    },
    date: Date
  }],
  radiologyFindings: [{
    modality: {
      type: String,
      enum: ['xray', 'ct', 'mri', 'ultrasound', 'nuclear_medicine', 'mammography']
    },
    bodyPart: String,
    findings: String,
    impression: String,
    images: [String]
  }],
  diagnosis: [{
    code: String,
    name: String,
    type: {
      type: String,
      enum: ['primary', 'secondary', 'differential', 'working']
    },
    confidence: Number
  }],
  assessment: String,
  plan: [{
    type: {
      type: String,
      enum: ['medication', 'test', 'procedure', 'referral', 'lifestyle', 'follow_up', 'education']
    },
    description: String,
    priority: {
      type: String,
      enum: ['urgent', 'routine', 'optional']
    },
    dueDate: Date
  }],
  recommendations: [String],
  followUp: {
    required: Boolean,
    timeframe: String,
    instructions: String
  },
  attachments: [{
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalFile'
    },
    filename: String,
    fileType: String,
    url: String
  }],
  chatReferences: [{
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    },
    summary: String
  }],
  aiAnalysis: {
    performed: Boolean,
    model: String,
    confidence: Number,
    findings: [String],
    suggestions: [String],
    timestamp: Date
  },
  status: {
    type: String,
    enum: ['draft', 'preliminary', 'final', 'amended', 'cancelled'],
    default: 'draft'
  },
  confidentiality: {
    type: String,
    enum: ['public', 'internal', 'confidential', 'restricted'],
    default: 'confidential'
  },
  exportedFormats: [{
    format: {
      type: String,
      enum: ['pdf', 'docx', 'html', 'json', 'xml', 'fhir']
    },
    url: String,
    generatedAt: Date
  }],
  signatures: [{
    signerName: String,
    signerRole: String,
    signatureUrl: String,
    signedAt: Date,
    ipAddress: String
  }],
  version: {
    type: Number,
    default: 1
  },
  parentReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalReport'
  },
  tags: [String],
  isTemplate: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: mongoose.Schema.Types.ObjectId,
    role: {
      type: String,
      enum: ['view', 'edit', 'sign', 'download']
    },
    grantedAt: Date,
    expiresAt: Date
  }]
}, {
  timestamps: true
});

// Indexes
medicalReportSchema.index({ userId: 1, createdAt: -1 });
medicalReportSchema.index({ reportType: 1, status: 1 });
medicalReportSchema.index({ 'patient.medicalId': 1 });
medicalReportSchema.index({ 'diagnosis.code': 1 });
medicalReportSchema.index({ visitDate: -1 });

// Generate PDF method placeholder
medicalReportSchema.methods.generatePDF = async function() {
  // Implementation will use PDF generation library
  return { url: '', path: '' };
};

// Generate DOCX method placeholder
medicalReportSchema.methods.generateDOCX = async function() {
  // Implementation will use DOCX generation library
  return { url: '', path: '' };
};

// Generate FHIR format for interoperability
medicalReportSchema.methods.generateFHIR = function() {
  return {
    resourceType: 'ClinicalImpression',
    status: this.status,
    subject: { reference: `Patient/${this.patient.medicalId}` },
    date: this.visitDate.toISOString(),
    finding: this.diagnosis.map(d => ({
      itemCodeableConcept: { text: d.name },
      type: { text: d.type }
    }))
  };
};

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
