import React, { useState } from 'react';
import { 
  FileText, Upload, Download, Search, Plus, Eye, Edit, Trash2, 
  Calendar, User, Printer, Share2, CheckCircle, AlertCircle 
} from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // بيانات تجريبية للتقارير الطبية
  const reports = [
    {
      id: 1,
      title: 'تقرير استشارة طبية عامة',
      type: 'consultation',
      date: '2025-01-15',
      patient: 'أحمد محمد',
      doctor: 'د. فاطمة علي',
      status: 'completed',
      format: ['pdf', 'docx'],
      summary: 'استشارة لمتابعة ضغط الدم والسكري'
    },
    {
      id: 2,
      title: 'تقرير تحليل صورة دم كاملة',
      type: 'lab',
      date: '2025-01-14',
      patient: 'أحمد محمد',
      doctor: 'مختبر الشفاء',
      status: 'completed',
      format: ['pdf'],
      summary: 'تحليل CBC شامل مع ملاحظات بسيطة'
    },
    {
      id: 3,
      title: 'تقرير أشعة سينية على الصدر',
      type: 'radiology',
      date: '2025-01-13',
      patient: 'أحمد محمد',
      doctor: 'د. محمود حسن',
      status: 'completed',
      format: ['pdf', 'dicom'],
      summary: 'أشعة صدر طبيعية بدون ملاحظات'
    },
    {
      id: 4,
      title: 'تقرير متابعة سكر الدم',
      type: 'followup',
      date: '2025-01-10',
      patient: 'أحمد محمد',
      doctor: 'د. فاطمة علي',
      status: 'pending',
      format: ['pdf'],
      summary: 'متابعة مستوى السكر التراكمي'
    },
    {
      id: 5,
      title: 'تقرير تخطيط قلب',
      type: 'ecg',
      date: '2025-01-08',
      patient: 'أحمد محمد',
      doctor: 'د. سعيد إبراهيم',
      status: 'completed',
      format: ['pdf', 'jpg'],
      summary: 'تخطيط قلب طبيعي'
    },
  ];

  const reportTypes = [
    { id: 'all', name: 'جميع التقارير', icon: FileText },
    { id: 'consultation', name: 'استشارات طبية', icon: User },
    { id: 'lab', name: 'تحاليل مخبرية', icon: Activity },
    { id: 'radiology', name: 'أشعة طبية', icon: XRay },
    { id: 'followup', name: 'متابعة', icon: Calendar },
    { id: 'ecg', name: 'تخطيط قلب', icon: Activity },
  ];

  const getStatusColor = (status) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status) => {
    return status === 'completed' ? 'مكتمل' : 'قيد المعالجة';
  };

  const filteredReports = reports.filter(report => {
    const matchesType = activeTab === 'all' || report.type === activeTab;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.patient.includes(searchQuery) ||
                         report.doctor.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const handleExport = (report, format) => {
    alert(`جاري تصدير التقرير "${report.title}" بصيغة ${format.toUpperCase()}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير الطبية الشاملة</h1>
            <p className="text-gray-600">إدارة وتصدير جميع تقاريرك الطبية بصيغ متعددة</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            رفع تقرير جديد
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي التقارير</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <FileText className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التقارير المكتملة</p>
                <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'completed').length}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">قيد المعالجة</p>
                <p className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === 'pending').length}</p>
              </div>
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">هذا الشهر</p>
                <p className="text-2xl font-bold text-purple-600">{reports.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}</p>
              </div>
              <Calendar className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {type.name}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن تقرير بالاسم، المريض، أو الطبيب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">عنوان التقرير</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">النوع</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">المريض</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">الطبيب/المختبر</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">التاريخ</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">الحالة</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">الصيغ المتاحة</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">{report.title}</p>
                          <p className="text-sm text-gray-500">{report.summary}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 capitalize">{report.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{report.patient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{report.doctor}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{report.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {report.format.map((fmt) => (
                          <span key={fmt} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded uppercase">
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="عرض"
                        >
                          <Eye size={18} />
                        </button>
                        {report.format.includes('pdf') && (
                          <button 
                            onClick={() => handleExport(report, 'pdf')}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="تصدير PDF"
                          >
                            <Download size={18} />
                          </button>
                        )}
                        {report.format.includes('docx') && (
                          <button 
                            onClick={() => handleExport(report, 'docx')}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="تصدير Word"
                          >
                            <FileText size={18} />
                          </button>
                        )}
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="مشاركة"
                        >
                          <Share2 size={18} />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="طباعة"
                        >
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>لا توجد تقارير مطابقة لبحثك</p>
            </div>
          )}
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Trash2 size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">المريض</p>
                    <p className="font-medium">{selectedReport.patient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الطبيب/المختبر</p>
                    <p className="font-medium">{selectedReport.doctor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">التاريخ</p>
                    <p className="font-medium">{selectedReport.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الحالة</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                      {getStatusText(selectedReport.status)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2">ملخص التقرير</h3>
                  <p className="text-gray-700">{selectedReport.summary}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">تصدير التقرير</h3>
                  <div className="flex gap-3">
                    {selectedReport.format.includes('pdf') && (
                      <button 
                        onClick={() => handleExport(selectedReport, 'pdf')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <Download size={18} />
                        PDF
                      </button>
                    )}
                    {selectedReport.format.includes('docx') && (
                      <button 
                        onClick={() => handleExport(selectedReport, 'docx')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <FileText size={18} />
                        Word
                      </button>
                    )}
                    {selectedReport.format.includes('dicom') && (
                      <button 
                        onClick={() => handleExport(selectedReport, 'dicom')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <Download size={18} />
                        DICOM
                      </button>
                    )}
                    {selectedReport.format.includes('fhir') && (
                      <button 
                        onClick={() => handleExport(selectedReport, 'fhir')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Share2 size={18} />
                        FHIR
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Printer size={18} />
                    طباعة
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Share2 size={18} />
                    مشاركة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">رفع تقرير طبي جديد</h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Trash2 size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">اسحب الملف وأفلته هنا، أو انقر للاختيار</p>
                  <p className="text-sm text-gray-500">PDF, DOCX, JPG, PNG, DICOM</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عنوان التقرير</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: تقرير أشعة سينية"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع التقرير</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>استشارة طبية</option>
                      <option>تحليل مخبري</option>
                      <option>أشعة طبية</option>
                      <option>تخطيط قلب</option>
                      <option>متابعة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم المريض</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الطبيب/المختبر</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    رفع التقرير
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
