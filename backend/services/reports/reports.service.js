const MedicalReport = require('../models/MedicalReport');
const MedicalFile = require('../models/MedicalFile');
const ActivityLog = require('../models/ActivityLog');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Medical Reports Service - Comprehensive medical report generation and management
 * Supports multiple export formats: PDF, DOCX, HTML, JSON, XML, FHIR
 */
class ReportsService {
  constructor() {
    this.exportFormats = ['pdf', 'docx', 'html', 'json', 'xml', 'fhir'];
    this.reportTypes = {
      comprehensive: 'تقرير طبي شامل',
      lab_analysis: 'تحليل تقارير المختبر',
      radiology_report: 'تقرير أشعة',
      consultation: 'تقرير استشارة',
      prescription: 'تقرير وصفة طبية',
      referral: 'تقرير إحالة',
      discharge: 'تقرير خروج',
      progress_note: 'ملاحظة تقدم',
      insurance: 'تقرير تأميني'
    };
  }

  /**
   * Create a new medical report
   */
  async createReport(reportData, userId) {
    try {
      const report = await MedicalReport.create({
        ...reportData,
        userId,
        version: 1
      });

      // Log activity
      await this.logActivity(userId, 'report_generated', {
        reportId: report._id,
        reportType: report.reportType
      });

      return {
        success: true,
        report: await this.getReportDetails(report._id, userId)
      };
    } catch (error) {
      console.error('Create report error:', error);
      throw new Error('فشل إنشاء التقرير الطبي');
    }
  }

  /**
   * Get report details
   */
  async getReportDetails(reportId, userId) {
    try {
      const report = await MedicalReport.findOne({ 
        _id: reportId,
        $or: [{ userId }, { sharedWith: { $elemMatch: { userId } } }]
      })
      .populate('attachments.fileId')
      .populate('chatReferences.chatId');

      if (!report) {
        throw new Error('التقرير غير موجود');
      }

      return {
        success: true,
        report: {
          id: report._id,
          type: this.reportTypes[report.reportType] || report.reportType,
          title: report.title,
          description: report.description,
          patient: report.patient,
          doctor: report.doctor,
          facility: report.facility,
          visitDate: report.visitDate,
          chiefComplaint: report.chiefComplaint,
          historyOfPresentIllness: report.historyOfPresentIllness,
          pastMedicalHistory: report.pastMedicalHistory,
          medications: report.medications,
          allergies: report.allergies,
          vitalSigns: report.vitalSigns,
          physicalExamination: report.physicalExamination,
          labResults: report.labResults,
          radiologyFindings: report.radiologyFindings,
          diagnosis: report.diagnosis,
          assessment: report.assessment,
          plan: report.plan,
          recommendations: report.recommendations,
          followUp: report.followUp,
          attachments: report.attachments,
          aiAnalysis: report.aiAnalysis,
          status: report.status,
          exportedFormats: report.exportedFormats,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt
        }
      };
    } catch (error) {
      console.error('Get report details error:', error);
      throw new Error('فشل الحصول على تفاصيل التقرير');
    }
  }

  /**
   * Generate PDF report
   */
  async generatePDF(reportId, userId) {
    try {
      const report = await this.getReportDetails(reportId, userId);
      
      const fileName = `report_${reportId}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../../uploads/reports', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const doc = new PDFDocument({ 
        size: 'A4', 
        margins: { top: 50, bottom: 50, left: 50, right: 50 } 
      });
      
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('طبيب العجائب', { align: 'center' });
      doc.fontSize(14).font('Helvetica').text('منصة الذكاء الاصطناعي الطبية', { align: 'center' });
      doc.moveDown();

      // Report Title
      doc.fontSize(18).font('Helvetica-Bold').text(report.report.title, { align: 'center' });
      doc.moveDown();

      // Patient Info
      if (report.report.patient) {
        doc.fontSize(12).font('Helvetica-Bold').text('بيانات المريض:', { underline: true });
        doc.font('Helvetica').text(`الاسم: ${report.report.patient.name || 'غير محدد'}`);
        doc.text(`العمر: ${report.report.patient.age || 'غير محدد'}`);
        doc.text(`الجنس: ${report.report.patient.gender || 'غير محدد'}`);
        doc.moveDown();
      }

      // Visit Date
      doc.font('Helvetica-Bold').text('تاريخ الزيارة:');
      doc.font('Helvetica').text(new Date(report.report.visitDate).toLocaleDateString('ar-EG'));
      doc.moveDown();

      // Chief Complaint
      if (report.report.chiefComplaint) {
        doc.font('Helvetica-Bold').text('الشكوى الرئيسية:', { underline: true });
        doc.font('Helvetica').text(report.report.chiefComplaint);
        doc.moveDown();
      }

      // Diagnosis
      if (report.report.diagnosis && report.report.diagnosis.length > 0) {
        doc.font('Helvetica-Bold').text('التشخيص:', { underline: true });
        report.report.diagnosis.forEach((diag, i) => {
          doc.text(`${i + 1}. ${diag.name} (${diag.type})`);
        });
        doc.moveDown();
      }

      // Recommendations
      if (report.report.recommendations && report.report.recommendations.length > 0) {
        doc.font('Helvetica-Bold').text('التوصيات:', { underline: true });
        report.report.recommendations.forEach((rec, i) => {
          doc.text(`${i + 1}. ${rec}`);
        });
        doc.moveDown();
      }

      // Plan
      if (report.report.plan && report.report.plan.length > 0) {
        doc.font('Helvetica-Bold').text('الخطة العلاجية:', { underline: true });
        report.report.plan.forEach((planItem, i) => {
          doc.text(`${i + 1}. ${planItem.description}`);
        });
        doc.moveDown();
      }

      // Footer
      doc.fontSize(10).font('Helvetica-Oblique').text(
        `تم إنشاء هذا التقرير إلكترونياً بواسطة منصة طبيب العجائب`,
        { align: 'center' }
      );
      doc.text(`تاريخ الإنشاء: ${new Date().toLocaleString('ar-EG')}`, { align: 'center' });

      doc.end();

      // Wait for file to be written
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      // Update report with exported format
      await MedicalReport.findByIdAndUpdate(reportId, {
        $push: {
          exportedFormats: {
            format: 'pdf',
            url: `/uploads/reports/${fileName}`,
            generatedAt: new Date()
          }
        }
      });

      return {
        success: true,
        url: `/uploads/reports/${fileName}`,
        path: filePath
      };
    } catch (error) {
      console.error('Generate PDF error:', error);
      throw new Error('فشل إنشاء ملف PDF');
    }
  }

  /**
   * Generate DOCX report
   */
  async generateDOCX(reportId, userId) {
    try {
      // Placeholder for DOCX generation
      // Would use docx library in production
      const report = await this.getReportDetails(reportId, userId);
      
      return {
        success: true,
        message: 'DOCX generation not yet implemented',
        report
      };
    } catch (error) {
      console.error('Generate DOCX error:', error);
      throw new Error('فشل إنشاء ملف DOCX');
    }
  }

  /**
   * Generate FHIR format for interoperability
   */
  async generateFHIR(reportId, userId) {
    try {
      const report = await MedicalReport.findById(reportId);
      
      if (!report) {
        throw new Error('التقرير غير موجود');
      }

      const fhirResource = report.generateFHIR();

      return {
        success: true,
        format: 'FHIR',
        resource: fhirResource
      };
    } catch (error) {
      console.error('Generate FHIR error:', error);
      throw new Error('فشل إنشاء ملف FHIR');
    }
  }

  /**
   * Export report in specified format
   */
  async exportReport(reportId, userId, format) {
    try {
      if (!this.exportFormats.includes(format)) {
        throw new Error('صيغة التصدير غير مدعومة');
      }

      switch (format.toLowerCase()) {
        case 'pdf':
          return await this.generatePDF(reportId, userId);
        case 'docx':
          return await this.generateDOCX(reportId, userId);
        case 'fhir':
          return await this.generateFHIR(reportId, userId);
        case 'json':
          const report = await this.getReportDetails(reportId, userId);
          return {
            success: true,
            format: 'JSON',
            data: report.report
          };
        default:
          throw new Error('صيغة التصدير غير مدعومة');
      }
    } catch (error) {
      console.error('Export report error:', error);
      throw new Error('فشل تصدير التقرير');
    }
  }

  /**
   * Get user reports
   */
  async getUserReports(userId, options = {}) {
    try {
      const { 
        reportType, 
        status, 
        limit = 50, 
        skip = 0,
        sortBy = 'createdAt'
      } = options;

      const query = { userId };
      
      if (reportType) query.reportType = reportType;
      if (status) query.status = status;

      const reports = await MedicalReport.find(query)
        .sort({ [sortBy]: -1 })
        .limit(limit)
        .skip(skip)
        .select('reportType title status visitDate createdAt exportedFormats');

      const total = await MedicalReport.countDocuments(query);

      return {
        success: true,
        reports: reports.map(r => ({
          id: r._id,
          type: this.reportTypes[r.reportType] || r.reportType,
          title: r.title,
          status: r.status,
          visitDate: r.visitDate,
          createdAt: r.createdAt,
          hasExports: r.exportedFormats.length > 0
        })),
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total
        }
      };
    } catch (error) {
      console.error('Get user reports error:', error);
      throw new Error('فشل الحصول على التقارير');
    }
  }

  /**
   * Update report
   */
  async updateReport(reportId, userId, updates) {
    try {
      const report = await MedicalReport.findOneAndUpdate(
        { _id: reportId, userId },
        { 
          ...updates,
          $inc: { version: 1 },
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!report) {
        throw new Error('التقرير غير موجود');
      }

      // Log activity
      await this.logActivity(userId, 'report_updated', {
        reportId,
        version: report.version
      });

      return {
        success: true,
        report: await this.getReportDetails(reportId, userId)
      };
    } catch (error) {
      console.error('Update report error:', error);
      throw new Error('فشل تحديث التقرير');
    }
  }

  /**
   * Delete report
   */
  async deleteReport(reportId, userId) {
    try {
      const report = await MedicalReport.findOneAndDelete({ 
        _id: reportId, 
        userId 
      });

      if (!report) {
        throw new Error('التقرير غير موجود');
      }

      // Log activity
      await this.logActivity(userId, 'report_deleted', {
        reportId,
        reportType: report.reportType
      });

      return {
        success: true,
        message: 'تم حذف التقرير بنجاح'
      };
    } catch (error) {
      console.error('Delete report error:', error);
      throw new Error('فشل حذف التقرير');
    }
  }

  /**
   * Share report with another user
   */
  async shareReport(reportId, userId, shareWithUserId, role = 'view') {
    try {
      const report = await MedicalReport.findOneAndUpdate(
        { _id: reportId, userId },
        {
          $push: {
            sharedWith: {
              userId: shareWithUserId,
              role,
              grantedAt: new Date()
            }
          }
        },
        { new: true }
      );

      if (!report) {
        throw new Error('التقرير غير موجود');
      }

      return {
        success: true,
        message: 'تم مشاركة التقرير بنجاح'
      };
    } catch (error) {
      console.error('Share report error:', error);
      throw new Error('فشل مشاركة التقرير');
    }
  }

  /**
   * Log activity
   */
  async logActivity(userId, action, details) {
    try {
      await ActivityLog.create({
        userId,
        action,
        category: 'reports',
        description: `Report ${action}`,
        details,
        entityType: 'report',
        status: 'success'
      });
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  }
}

module.exports = ReportsService;
