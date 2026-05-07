import React, { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: 1250,
    activeSubscriptions: 380,
    consultationsToday: 156,
    revenue: 45600,
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'users', label: 'المستخدمين' },
    { id: 'agents', label: 'الوكلاء' },
    { id: 'subscriptions', label: 'الاشتراكات' },
    { id: 'analytics', label: 'التحليلات' },
    { id: 'settings', label: 'الإعدادات' },
  ];

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '24px' }}>لوحة تحكم المدير</h1>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? '600' : '400',
              transition: 'var(--transition)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
              <h3 style={{ fontSize: '16px', opacity: 0.9 }}>إجمالي المستخدمين</h3>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: '12px 0' }}>{stats.totalUsers}</p>
            </div>
            <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white' }}>
              <h3 style={{ fontSize: '16px', opacity: 0.9 }}>الاشتراكات النشطة</h3>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: '12px 0' }}>{stats.activeSubscriptions}</p>
            </div>
            <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: 'white' }}>
              <h3 style={{ fontSize: '16px', opacity: 0.9 }}>استشارات اليوم</h3>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: '12px 0' }}>{stats.consultationsToday}</p>
            </div>
            <div className="card" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: 'white' }}>
              <h3 style={{ fontSize: '16px', opacity: 0.9 }}>الإيرادات (ج.م)</h3>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: '12px 0' }}>{stats.revenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>آخر النشاطات</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px', textAlign: 'right' }}>المستخدم</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>النشاط</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>الوقت</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px' }}>مستخدم {i}</td>
                    <td style={{ padding: '12px' }}>استشارة طبية</td>
                    <td style={{ padding: '12px', color: 'var(--text-light)' }}>منذ {i * 15} دقيقة</td>
                    <td style={{ padding: '12px' }}><span className="badge badge-success">مكتمل</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'agents' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>إدارة الوكلاء</h2>
            <button className="btn btn-primary">+ إضافة وكيل جديد</button>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>يمكنك إضافة وكلاء جدد أو تعديل الوكلاء الحاليين من هنا</p>
        </div>
      )}

      {['users', 'subscriptions', 'analytics', 'settings'].includes(activeTab) && (
        <div className="card">
          <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>هذه الصفحة قيد التطوير...</p>
        </div>
      )}
    </div>
  );
}
