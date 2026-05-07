import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      <div>
        <h1 style={{ fontSize: '120px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '20px' }}>404</h1>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>الصفحة غير موجودة</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
