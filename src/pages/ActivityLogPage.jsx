import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiFilter, FiDownload, FiCalendar, FiClock, FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';

export default function ActivityLogPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedLog, setSelectedLog] = useState(null);

  const categories = [
    { value: 'all', label: 'الكل', icon: FiActivity },
    { value: 'authentication', label: 'المصادقة', icon: FiCheckCircle },
    { value: 'chat', label: 'المحادثات', icon: FiActivity },
    { value: 'files', label: 'الملفات', icon: FiActivity },
    { value: 'reports', label: 'التقارير', icon: FiActivity },
    { value: 'medicine', label: 'الأدوية', icon: FiActivity },
    { value: 'analysis', label: 'التحليلات', icon: FiActivity },
    { value: 'system', label: 'النظام', icon: FiActivity },
  ];

  const statuses = [
    { value: 'all', label: 'الكل' },
    { value: 'success', label: 'ناجح', color: 'var(--success-color)' },
    { value: 'failure', label: 'فشل', color: 'var(--danger-color)' },
    { value: 'warning', label: 'تحذير', color: 'var(--warning-color)' },
    { value: 'error', label: 'خطأ', color: 'var(--danger-color)' },
  ];

  useEffect(() => {
    loadActivityLogs();
  }, [dateRange]);

  useEffect(() => {
    filterLogs();
  }, [logs, filterCategory, filterStatus]);

  const loadActivityLogs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // محاكاة البيانات - في الواقع ستأتي من API
      const mockLogs = generateMockLogs();
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockLogs = () => {
    const actions = [
      { action: 'login', description: 'تسجيل الدخول', category: 'authentication', status: 'success' },
      { action: 'chat_message', description: 'إرسال رسالة', category: 'chat', status: 'success' },
      { action: 'file_upload', description: 'رفع ملف طبي', category: 'files', status: 'success' },
      { action: 'report_generated', description: 'إنشاء تقرير طبي', category: 'reports', status: 'success' },
      { action: 'medicine_search', description: 'بحث عن دواء', category: 'medicine', status: 'success' },
      { action: 'lab_test_analysis', description: 'تحليل مختبري', category: 'analysis', status: 'success' },
      { action: 'radiology_analysis', description: 'تحليل أشعة', category: 'analysis', status: 'success' },
      { action: 'profile_update', description: 'تحديث الملف الشخصي', category: 'profile', status: 'success' },
      { action: 'subscription_change', description: 'تغيير الاشتراك', category: 'subscription', status: 'success' },
      { action: 'api_call', description: 'طلب API', category: 'system', status: 'success' },
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      action: actions[Math.floor(Math.random() * actions.length)].action,
      description: actions[Math.floor(Math.random() * actions.length)].description,
      category: actions[Math.floor(Math.random() * actions.length)].category,
      status: Math.random() > 0.9 ? 'failure' : 'success',
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      deviceInfo: ['Chrome/Windows', 'Safari/Mac', 'Firefox/Linux', 'Mobile/Android'][Math.floor(Math.random() * 4)],
      duration: Math.floor(Math.random() * 2000) + 100,
    }));
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (filterCategory !== 'all') {
      filtered = filtered.filter(log => log.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }

    if (dateRange === '24h') {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => log.timestamp >= cutoff);
    } else if (dateRange === '7d') {
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => log.timestamp >= cutoff);
    } else if (dateRange === '30d') {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => log.timestamp >= cutoff);
    }

    setFilteredLogs(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'var(--success-color)';
      case 'failure': return 'var(--danger-color)';
      case 'warning': return 'var(--warning-color)';
      case 'error': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? <cat.icon size={18} /> : <FiActivity size={18} />;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'منذ لحظات';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  const exportLogs = (format) => {
    console.log(`Exporting logs as ${format}`);
    // تنفيذ التصدير
  };

  return (
    <div className="main-content" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            📋 سجل العمليات
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>تابع جميع الأنشطة والعمليات على حسابك</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => exportLogs('pdf')} className="btn btn-secondary">
            <FiDownload /> تصدير PDF
          </button>
          <button onClick={() => exportLogs('csv')} className="btn btn-secondary">
            <FiDownload /> تصدير CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>الفئة</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)' }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>الحالة</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)' }}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>الفترة الزمنية</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)' }}
            >
              <option value="24h">آخر 24 ساعة</option>
              <option value="7d">آخر 7 أيام</option>
              <option value="30d">آخر 30 يوم</option>
              <option value="90d">آخر 90 يوم</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>الإحصائيات</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary-color)' }}>{filteredLogs.length}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>سجل</div>
              </div>
              <div style={{ flex: 1, padding: '10px', background: 'var(--success-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success-color)' }}>
                  {filteredLogs.filter(l => l.status === 'success').length}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ناجح</div>
              </div>
              <div style={{ flex: 1, padding: '10px', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--danger-color)' }}>
                  {filteredLogs.filter(l => l.status !== 'success').length}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>فشل</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs List */}
      <div className="card" style={{ padding: '0' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <FiActivity size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>لا توجد سجلات نشاط</h3>
            <p>ابدأ باستخدام المنصة لتظهر السجلات هنا</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>النشاط</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>الفئة</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>الحالة</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>الوقت</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>الجهاز</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>المدة</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setSelectedLog(log)}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {getCategoryIcon(log.category)}
                        <div>
                          <div style={{ fontWeight: '600' }}>{log.description}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{log.action}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {categories.find(c => c.value === log.category)?.label || log.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: getStatusColor(log.status),
                        fontWeight: '600'
                      }}>
                        {log.status === 'success' ? <FiCheckCircle size={16} /> : <FiAlertTriangle size={16} />}
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiClock size={16} style={{ color: 'var(--text-secondary)' }} />
                        <span>{formatTimeAgo(log.timestamp)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {log.deviceInfo}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {log.duration}ms
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--primary-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedLog(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>تفاصيل النشاط</h2>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <FiX />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>النشاط</label>
                <div style={{ marginTop: '4px', fontWeight: '600' }}>{selectedLog.description}</div>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>الفئة</label>
                <div style={{ marginTop: '4px' }}>{categories.find(c => c.value === selectedLog.category)?.label}</div>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>الحالة</label>
                <div style={{ marginTop: '4px', color: getStatusColor(selectedLog.status), fontWeight: '600' }}>
                  {selectedLog.status}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>الوقت</label>
                <div style={{ marginTop: '4px' }}>{selectedLog.timestamp.toLocaleString('ar-EG')}</div>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>العنوان IP</label>
                <div style={{ marginTop: '4px', fontFamily: 'monospace' }}>{selectedLog.ipAddress}</div>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>معلومات الجهاز</label>
                <div style={{ marginTop: '4px' }}>{selectedLog.deviceInfo}</div>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px' }}>مدة التنفيذ</label>
                <div style={{ marginTop: '4px' }}>{selectedLog.duration}ms</div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>
                <FiDownload /> تصدير هذا السجل
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedLog(null)}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
