import React, { useState } from 'react';
import { 
  Activity, AlertCircle, CheckCircle, FileText, Upload, Search, 
  TrendingUp, TrendingDown, Minus, Info, Download, RefreshCw 
} from 'lucide-react';

const LabAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // بيانات تجريبية للتحاليل الشائعة
  const commonTests = [
    { id: 1, name: 'تحليل صورة الدم الكاملة (CBC)', category: 'دم', normalRange: 'تختلف حسب العمر والجنس' },
    { id: 2, name: 'تحليل سكر الدم الصائم', category: 'كيمياء', normalRange: '70-100 mg/dL' },
    { id: 3, name: 'تحليل الهيموجلوبين التراكمي (HbA1c)', category: 'سكري', normalRange: '< 5.7%' },
    { id: 4, name: 'تحليل وظائف الكبد (Liver Function)', category: 'كيمياء', normalRange: 'تختلف حسب الإنزيم' },
    { id: 5, name: 'تحليل وظائف الكلى (Kidney Function)', category: 'كيمياء', normalRange: 'Creatinine: 0.7-1.3 mg/dL' },
    { id: 6, name: 'تحليل دهون الدم (Lipid Profile)', category: 'قلب', normalRange: 'Cholesterol < 200 mg/dL' },
    { id: 7, name: 'تحليل هرمونات الغدة الدرقية (TSH, T3, T4)', category: 'هرمونات', normalRange: 'TSH: 0.4-4.0 mIU/L' },
    { id: 8, name: 'تحليل فيتامين د (Vitamin D)', category: 'فيتامينات', normalRange: '30-100 ng/mL' },
    { id: 9, name: 'تحليل الحديد والفيريتين', category: 'دم', normalRange: 'Iron: 60-170 mcg/dL' },
    { id: 10, name: 'تحليل البول الكامل (Urinalysis)', category: 'بول', normalRange: 'تختلف حسب المعيار' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      simulateAnalysis(file);
    }
  };

  const simulateAnalysis = (file) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        fileName: file.name,
        date: new Date().toLocaleDateString('ar-EG'),
        tests: [
          { name: 'هيموجلوبين (HGB)', value: 13.5, unit: 'g/dL', normal: '12.0-16.0', status: 'normal' },
          { name: 'كريات دم حمراء (RBC)', value: 4.8, unit: 'M/µL', normal: '4.0-5.5', status: 'normal' },
          { name: 'كريات دم بيضاء (WBC)', value: 11.2, unit: 'K/µL', normal: '4.5-11.0', status: 'high' },
          { name: 'صفائح دموية (PLT)', value: 140, unit: 'K/µL', normal: '150-450', status: 'low' },
          { name: 'سكر دم صائم', value: 105, unit: 'mg/dL', normal: '70-100', status: 'high' },
        ],
        summary: 'تظهر النتائج ارتفاع طفيف في كريات الدم البيضاء قد يشير إلى وجود التهاب بسيط. انخفاض طفيف في الصفائح الدموية يحتاج للمتابعة. ارتفاع بسيط في سكر الدم الصائم ينصح بإعادة التحليل ومتابعة النظام الغذائي.',
        recommendations: [
          'إعادة تحليل سكر الدم التراكمي (HbA1c) للتأكد من معدل السكر خلال 3 أشهر',
          'الإكثار من شرب السوائل',
          'متابعة تعداد الصفائح الدموية بعد أسبوعين',
          'استشارة الطبيب إذا ظهرت أعراض حمى أو التهاب'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'high': return <TrendingUp className="text-red-500" size={20} />;
      case 'low': return <TrendingDown className="text-blue-500" size={20} />;
      default: return <CheckCircle className="text-green-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const filteredTests = commonTests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.includes(searchQuery)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">التحاليل الطبية الشاملة</h1>
          <p className="text-gray-600">تحليل ذكي للنتائج المخبرية مع تفسير مفصل وتوصيات مخصصة</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'upload' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="inline-block ml-2" size={18} />
            رفع نتيجة تحليل
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'browse' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="inline-block ml-2" size={18} />
            تصفح التحاليل الشائعة
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'history' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="inline-block ml-2" size={18} />
            سجل التحاليل السابقة
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">رفع ملف التحليل</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">اسحب الملف وأفلته هنا، أو انقر للاختيار</p>
                  <p className="text-sm text-gray-500">PDF, JPG, PNG (الحد الأقصى 10 ميجابايت)</p>
                </label>
              </div>
              
              {selectedFile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="text-blue-600 ml-2" size={20} />
                      <span className="font-medium">{selectedFile.name}</span>
                    </div>
                    <button 
                      onClick={() => {setSelectedFile(null); setAnalysisResult(null);}}
                      className="text-red-600 hover:text-red-800"
                    >
                      إزالة
                    </button>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="mt-6 text-center">
                  <RefreshCw className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-gray-600">جاري تحليل النتائج...</p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">نتائج التحليل</h2>
              {analysisResult ? (
                <div>
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-500">الملف: {analysisResult.fileName}</p>
                    <p className="text-sm text-gray-500">تاريخ التحليل: {analysisResult.date}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {analysisResult.tests.map((test, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            <span className="font-medium">{test.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{test.value}</span>
                            <span className="text-sm ml-1">{test.unit}</span>
                            <p className="text-xs opacity-75">المدى الطبيعي: {test.normal}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Info className="text-yellow-600 mt-1" size={20} />
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-1">ملخص النتائج</h3>
                        <p className="text-sm text-yellow-700">{analysisResult.summary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">التوصيات</h3>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                          <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} />
                    تحميل التقرير الكامل (PDF)
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>قم برفع ملف التحليل لعرض النتائج والتحليل</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن اسم التحليل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{test.category}</span>
                    <Info className="text-gray-400" size={18} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{test.name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">المدى الطبيعي:</span> {test.normalRange}
                  </p>
                </div>
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>لا توجد نتائج مطابقة لبحثك</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">سجل التحاليل السابقة</h2>
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>لم يتم العثور على تحاليل سابقة</p>
              <p className="text-sm mt-2">ستظهر هنا جميع التحاليل التي قمت برفعها وتحليلها</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabAnalysisPage;
