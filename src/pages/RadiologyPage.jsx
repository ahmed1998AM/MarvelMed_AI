import React, { useState } from 'react';
import { 
  Activity, Upload, Search, FileText, Download, RefreshCw, Info, 
  CheckCircle, AlertCircle, XRay, Brain, Bone, Heart, Eye 
} from 'lucide-react';

const RadiologyPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState('all');

  // أنواع الأشعة الطبية
  const modalities = [
    { id: 'xray', name: 'الأشعة السينية (X-Ray)', icon: XRay, color: 'blue' },
    { id: 'ct', name: 'الأشعة المقطعية (CT Scan)', icon: Brain, color: 'purple' },
    { id: 'mri', name: 'الرنين المغناطيسي (MRI)', icon: Brain, color: 'indigo' },
    { id: 'ultrasound', name: 'الموجات فوق الصوتية (Ultrasound)', icon: Activity, color: 'green' },
    { id: 'pet', name: 'الأشعة النووية (PET Scan)', icon: Activity, color: 'red' },
  ];

  // أمثلة على فحوصات الأشعة الشائعة
  const commonExams = [
    { id: 1, name: 'أشعة سينية على الصدر', modality: 'xray', bodyPart: 'الصدر', description: 'لتقييم الرئتين والقلب والأضلاع' },
    { id: 2, name: 'أشعة سينية على العظام', modality: 'xray', bodyPart: 'العظام', description: 'لكسر العظام والإصابات' },
    { id: 3, name: 'أشعة مقطعية على الرأس', modality: 'ct', bodyPart: 'الرأس', description: 'لتقييم إصابات الرأس والسكتات الدماغية' },
    { id: 4, name: 'أشعة مقطعية على البطن', modality: 'ct', bodyPart: 'البطن', description: 'لتقييم الأعضاء الداخلية' },
    { id: 5, name: 'رنين مغناطيسي على المخ', modality: 'mri', bodyPart: 'المخ', description: 'لتفصيل دقيق لأنسجة المخ' },
    { id: 6, name: 'رنين مغناطيسي على العمود الفقري', modality: 'mri', bodyPart: 'العمود الفقري', description: 'لديسك الظهر والرقبة' },
    { id: 7, name: 'موجات فوق صوتية على البطن', modality: 'ultrasound', bodyPart: 'البطن', description: 'لتقييم الكبد والكلى والمرارة' },
    { id: 8, name: 'موجات فوق صوتية على القلب', modality: 'ultrasound', bodyPart: 'القلب', description: 'ECHO لتقييم وظائف القلب' },
    { id: 9, name: 'أشعة نووية على القلب', modality: 'pet', bodyPart: 'القلب', description: 'لتقييم تدفق الدم للقلب' },
    { id: 10, name: 'أشعة سينية على الأسنان', modality: 'xray', bodyPart: 'الفك والأسنان', description: 'لتقييم صحة الأسنان' },
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
        modality: 'X-Ray',
        bodyPart: 'الصدر',
        findings: [
          { finding: 'ظلال رئوية طبيعية', status: 'normal', description: 'لا توجد علامات التهاب أو أورام' },
          { finding: 'حجم القلب طبيعي', status: 'normal', description: 'نسبة حجم القلب إلى الصدر ضمن المعدل الطبيعي' },
          { finding: 'وجود تكلسات بسيطة', status: 'warning', description: 'تكلسات صغيرة في المنطقة الهيلارية قد تكون مرتبطة بعمر المريض' },
          { finding: 'عدم وجود انصباب جنبي', status: 'normal', description: 'لا يوجد سوائل في التجويف الجنبي' },
        ],
        impression: 'أشعة صدر طبيعية مع وجود تكلسات بسيطة غير ذات دلالة مرضية. لا توجد علامات التهاب رئوي أو قصور قلب أو أورام.',
        recommendations: [
          'لا حاجة لفحوصات إضافية في الوقت الحالي',
          'متابعة روتينية حسب العمر والعوامل الخطرة',
          'في حالة ظهور أعراض تنفسية، يرجى مراجعة الطبيب'
        ],
        confidence: 94
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'abnormal': return 'bg-red-50 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'abnormal': return <AlertCircle className="text-red-500" size={20} />;
      case 'warning': return <Info className="text-yellow-500" size={20} />;
      default: return <CheckCircle className="text-green-500" size={20} />;
    }
  };

  const filteredExams = commonExams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.bodyPart.includes(searchQuery) ||
                         exam.description.includes(searchQuery);
    const matchesModality = selectedModality === 'all' || exam.modality === selectedModality;
    return matchesSearch && matchesModality;
  });

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            الأشعة الطبية المتقدمة
          </h1>
          <p className="text-gray-600 mt-2">تحليل ذكي لصور الأشعة بأنواعها باستخدام الذكاء الاصطناعي</p>
        </div>

        {/* Modality Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {modalities.map((modality) => {
            const Icon = modality.icon;
            return (
              <button
                key={modality.id}
                onClick={() => setSelectedModality(modality.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedModality === modality.id
                    ? `border-${modality.color}-600 bg-${modality.color}-50`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon className={`mx-auto mb-2 h-8 w-8 ${
                  selectedModality === modality.id ? `text-${modality.color}-600` : 'text-gray-400'
                }`} />
                <p className="text-xs font-medium text-center">{modality.name.split('(')[0]}</p>
              </button>
            );
          })}
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
            رفع صورة أشعة
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
            فحوصات الأشعة الشائعة
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
            أرشيف الأشعة
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">رفع صورة الأشعة</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.dicom,.dcm"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="radiology-upload"
                />
                <label htmlFor="radiology-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">اسحب صورة الأشعة وأفلتها هنا</p>
                  <p className="text-sm text-gray-500">JPG, PNG, DICOM (الحد الأقصى 50 ميجابايت)</p>
                  <p className="text-xs text-blue-600 mt-2">ندعم صيغة DICOM للفحوصات الاحترافية</p>
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
                  <p className="text-gray-600">جاري تحليل صورة الأشعة...</p>
                  <p className="text-sm text-gray-500 mt-1">يتم استخدام خوارزميات الذكاء الاصطناعي المتقدمة</p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">تقرير الأشعة</h2>
              {analysisResult ? (
                <div>
                  <div className="mb-4 pb-4 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-gray-500">الملف: {analysisResult.fileName}</p>
                        <p className="text-sm text-gray-500">التاريخ: {analysisResult.date}</p>
                      </div>
                      <div className="text-left">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {analysisResult.modality}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{analysisResult.bodyPart}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">دقة التحليل:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${analysisResult.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-green-600">{analysisResult.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-gray-900">الملاحظات الشعاعية:</h3>
                    {analysisResult.findings.map((item, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${getStatusColor(item.status)}`}>
                        <div className="flex items-start gap-2">
                          {getStatusIcon(item.status)}
                          <div className="flex-1">
                            <p className="font-medium">{item.finding}</p>
                            <p className="text-sm opacity-75 mt-1">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Info className="text-blue-600 mt-1" size={20} />
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-1">الانطباع العام</h3>
                        <p className="text-sm text-blue-700">{analysisResult.impression}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
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

                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Download size={18} />
                      تقرير PDF
                    </button>
                    <button className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <Download size={18} />
                      صور DICOM
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>قم برفع صورة الأشعة لعرض التحليل والتقرير</p>
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
                  placeholder="ابحث عن فحص أشعة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => setSelectedModality('all')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedModality === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  الكل
                </button>
                {modalities.map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModality(mod.id)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedModality === mod.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {mod.name.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{exam.bodyPart}</span>
                    <Info className="text-gray-400" size={18} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{exam.name}</h3>
                  <p className="text-sm text-gray-600">{exam.description}</p>
                </div>
              ))}
            </div>

            {filteredExams.length === 0 && (
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
            <h2 className="text-xl font-semibold mb-4">أرشيف الأشعة السابقة</h2>
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>لم يتم العثور على أشعة سابقة</p>
              <p className="text-sm mt-2">ستظهر هنا جميع صور الأشعة التي قمت برفعها وتحليلها</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadiologyPage;
