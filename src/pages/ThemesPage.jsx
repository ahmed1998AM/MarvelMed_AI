import React, { useState } from 'react';
import { 
  Palette, Monitor, Moon, Sun, Cloud, Heart, Zap, 
  CheckCircle, Plus, Edit, Trash2, Eye, Copy 
} from 'lucide-react';

const ThemesPage = () => {
  const [activeTab, setActiveTab] = useState('preset');
  const [selectedTheme, setSelectedTheme] = useState('medical-blue');
  const [customTheme, setCustomTheme] = useState({
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#F3F4F6',
    surface: '#FFFFFF',
    text: '#1F2937',
    accent: '#8B5CF6'
  });

  // الثيمات الجاهزة
  const presetThemes = [
    {
      id: 'medical-blue',
      name: 'الأزرق الطبي',
      description: 'ثيم احترافي باللون الأزرق للمنصات الطبية',
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        background: '#F3F4F6',
        surface: '#FFFFFF',
        text: '#1F2937',
        accent: '#8B5CF6'
      },
      icon: Heart,
      popular: true
    },
    {
      id: 'dark-professional',
      name: 'الداكن الاحترافي',
      description: 'ثيم داكن مريح للعين للعمل الطويل',
      colors: {
        primary: '#60A5FA',
        secondary: '#34D399',
        background: '#1F2937',
        surface: '#374151',
        text: '#F9FAFB',
        accent: '#A78BFA'
      },
      icon: Moon,
      popular: true
    },
    {
      id: 'light-clean',
      name: 'الأبيض النقي',
      description: 'تصميم نظيف وبسيط باللون الأبيض',
      colors: {
        primary: '#2563EB',
        secondary: '#059669',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        accent: '#7C3AED'
      },
      icon: Sun,
      popular: false
    },
    {
      id: 'nature-green',
      name: 'الأخضر الطبيعي',
      description: 'ألوان مستوحاة من الطبيعة للاسترخاء',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        background: '#ECFDF5',
        surface: '#FFFFFF',
        text: '#064E3B',
        accent: '#34D399'
      },
      icon: Cloud,
      popular: false
    },
    {
      id: 'warm-orange',
      name: 'البرتقالي الدافئ',
      description: 'ألوان دافئة ومريحة',
      colors: {
        primary: '#EA580C',
        secondary: '#F97316',
        background: '#FFF7ED',
        surface: '#FFFFFF',
        text: '#431407',
        accent: '#FB923C'
      },
      icon: Sun,
      popular: false
    },
    {
      id: 'purple-modern',
      name: 'البنفسجي العصري',
      description: 'ثيم عصري بألوان بنفسجية جذابة',
      colors: {
        primary: '#7C3AED',
        secondary: '#A78BFA',
        background: '#F5F3FF',
        surface: '#FFFFFF',
        text: '#4C1D95',
        accent: '#C4B5FD'
      },
      icon: Zap,
      popular: true
    },
    {
      id: 'ocean-blue',
      name: 'أزرق المحيط',
      description: 'درجات اللون الأزرق المستوحاة من المحيط',
      colors: {
        primary: '#0284C7',
        secondary: '#06B6D4',
        background: '#ECFEFF',
        surface: '#FFFFFF',
        text: '#164E63',
        accent: '#22D3EE'
      },
      icon: Monitor,
      popular: false
    },
    {
      id: 'rose-pink',
      name: 'الوردي الهادئ',
      description: 'ألوان وردية هادئة ومريحة',
      colors: {
        primary: '#DB2777',
        secondary: '#EC4899',
        background: '#FDF2F8',
        surface: '#FFFFFF',
        text: '#831843',
        accent: '#F472B6'
      },
      icon: Heart,
      popular: false
    }
  ];

  const handleColorChange = (key, value) => {
    setCustomTheme(prev => ({ ...prev, [key]: value }));
  };

  const applyCustomTheme = () => {
    alert('تم تطبيق الثيم المخصص بنجاح!');
  };

  const saveCustomTheme = () => {
    alert('تم حفظ الثيم المخصص!');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Palette className="text-purple-600" size={32} />
            مركز الثيمات والتصاميم
          </h1>
          <p className="text-gray-600 mt-2">اختر من مجموعة متنوعة من الثيمات أو صمم ثيمك الخاص</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'preset' 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Monitor className="inline-block ml-2" size={18} />
            الثيمات الجاهزة
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'custom' 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Palette className="inline-block ml-2" size={18} />
            ثيم مخصص
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'saved' 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="inline-block ml-2" size={18} />
            الثيمات المحفوظة
          </button>
        </div>

        {/* Preset Themes Tab */}
        {activeTab === 'preset' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {presetThemes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <div 
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      selectedTheme === theme.id ? 'ring-2 ring-purple-600' : ''
                    }`}
                  >
                    {/* Theme Preview */}
                    <div className="h-32 relative">
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                        }}
                      >
                        <div className="absolute inset-0 p-4">
                          <div 
                            className="w-full h-8 rounded mb-2 opacity-80"
                            style={{ backgroundColor: theme.colors.surface }}
                          ></div>
                          <div className="flex gap-2">
                            <div 
                              className="w-1/3 h-12 rounded opacity-80"
                              style={{ backgroundColor: theme.colors.surface }}
                            ></div>
                            <div 
                              className="w-1/3 h-12 rounded opacity-80"
                              style={{ backgroundColor: theme.colors.surface }}
                            ></div>
                            <div 
                              className="w-1/3 h-12 rounded opacity-80"
                              style={{ backgroundColor: theme.colors.surface }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {theme.popular && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                          الأكثر استخداماً
                        </span>
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="text-gray-600" size={20} />
                        <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                      
                      {/* Color Dots */}
                      <div className="flex gap-1 mb-3">
                        {Object.values(theme.colors).map((color, index) => (
                          <div 
                            key={index}
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTheme(theme.id);
                        }}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          selectedTheme === theme.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedTheme === theme.id ? (
                          <CheckCircle className="inline-block ml-2" size={16} />
                        ) : null}
                        {selectedTheme === theme.id ? 'محدد' : 'اختيار'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Theme Tab */}
        {activeTab === 'custom' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Color Pickers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">تخصيص الألوان</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللون الأساسي
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللون الثانوي
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لون الخلفية
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لون السطح
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.surface}
                      onChange={(e) => handleColorChange('surface', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.surface}
                      onChange={(e) => handleColorChange('surface', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لون النص
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لون التمييز (Accent)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={applyCustomTheme}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  تطبيق الثيم
                </button>
                <button 
                  onClick={saveCustomTheme}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  حفظ كثيم جديد
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">المعاينة الحية</h2>
              
              <div 
                className="rounded-xl overflow-hidden border"
                style={{ 
                  backgroundColor: customTheme.background,
                  color: customTheme.text,
                  borderColor: customTheme.surface
                }}
              >
                {/* Preview Header */}
                <div 
                  className="p-4"
                  style={{ backgroundColor: customTheme.primary }}
                >
                  <h3 className="text-white font-bold text-lg">عنوان المنصة</h3>
                  <p className="text-white text-sm opacity-80">وصف قصير للمنصة</p>
                </div>

                {/* Preview Content */}
                <div className="p-4 space-y-4">
                  {/* Preview Card */}
                  <div 
                    className="rounded-lg p-4 shadow-sm"
                    style={{ backgroundColor: customTheme.surface }}
                  >
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: customTheme.primary }}
                    >
                      بطاقة تجريبية
                    </h4>
                    <p className="text-sm opacity-75 mb-3">
                      هذا نص تجريبي لعرض كيف سيبدو المحتوى في ثيمك المخصص.
                    </p>
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: customTheme.secondary }}
                    >
                      زر إجراء
                    </button>
                  </div>

                  {/* Preview Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className="rounded-lg p-3"
                      style={{ backgroundColor: customTheme.surface }}
                    >
                      <p className="text-xs opacity-75">إحصائية 1</p>
                      <p 
                        className="text-xl font-bold"
                        style={{ color: customTheme.accent }}
                      >
                        123
                      </p>
                    </div>
                    <div 
                      className="rounded-lg p-3"
                      style={{ backgroundColor: customTheme.surface }}
                    >
                      <p className="text-xs opacity-75">إحصائية 2</p>
                      <p 
                        className="text-xl font-bold"
                        style={{ color: customTheme.accent }}
                      >
                        456
                      </p>
                    </div>
                  </div>

                  {/* Preview Alert */}
                  <div 
                    className="rounded-lg p-3 border-l-4"
                    style={{ 
                      backgroundColor: `${customTheme.accent}20`,
                      borderColor: customTheme.accent
                    }}
                  >
                    <p className="text-sm font-medium">تنبيه مهم</p>
                    <p className="text-xs opacity-75 mt-1">هذا مثال على رسالة تنبيه</p>
                  </div>
                </div>
              </div>

              {/* Color Palette Summary */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">لوحة الألوان:</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(customTheme).map(([key, color]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                      <p className="text-xs mt-1 capitalize">{key}</p>
                      <p className="text-xs text-gray-500 font-mono">{color}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Themes Tab */}
        {activeTab === 'saved' && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد ثيمات محفوظة</h3>
            <p className="text-gray-600 mb-6">قم بإنشاء ثيم مخصص وحفظه ليظهر هنا</p>
            <button 
              onClick={() => setActiveTab('custom')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              إنشاء ثيم مخصص
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemesPage;
