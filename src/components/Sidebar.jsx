import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../store';
import { 
  FiHome, FiMessageCircle, FiUser, FiCreditCard, 
  FiSettings, FiActivity, FiFileText, FiHelpCircle,
  FiBarChart2, FiUsers, FiShield, FiPill, FiBookOpen, FiClipboard
} from 'react-icons/fi';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentAgent, setCurrentAgent } = useUIStore();

  const menuItems = [
    { icon: FiHome, label: 'الرئيسية', path: '/dashboard' },
    { icon: FiMessageCircle, label: 'استشارة طبية', path: '/chat' },
    { icon: FiPill, label: 'التعرف على الأدوية', path: '/medicine' },
    { icon: FiBookOpen, label: 'التحاليل الطبية', path: '/dashboard' },
    { icon: FiClipboard, label: 'التقارير الطبية', path: '/dashboard' },
    { icon: FiActivity, label: 'سجل العمليات', path: '/activity-log' },
    { icon: FiFileText, label: 'التحاليل والأشعة', path: '/dashboard' },
    { icon: FiCreditCard, label: 'الاشتراكات', path: '/subscription' },
    { icon: FiUsers, label: 'المدير', path: '/admin', adminOnly: true },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'white',
      height: 'calc(100vh - 73px)',
      position: 'fixed',
      right: 0,
      top: '73px',
      padding: '20px 0',
      boxShadow: 'var(--shadow-sm)',
      overflowY: 'auto',
      zIndex: 999,
    }}>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 24px',
              border: 'none',
              background: location.pathname === item.path 
                ? 'linear-gradient(135deg, rgba(0, 184, 148, 0.1), rgba(9, 132, 227, 0.1))' 
                : 'transparent',
              color: location.pathname === item.path 
                ? 'var(--primary-color)' 
                : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              textAlign: 'right',
              fontSize: '15px',
              fontWeight: location.pathname === item.path ? '600' : '400',
              borderRight: location.pathname === item.path 
                ? '3px solid var(--primary-color)' 
                : '3px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.background = 'var(--bg-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.background = 'transparent';
              }
            }}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{
        marginTop: 'auto',
        padding: '20px',
        borderTop: '1px solid var(--border-color)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          color: 'white',
          textAlign: 'center',
        }}>
          <h4 style={{ marginBottom: '8px', fontSize: '16px' }}>خطة مجانية</h4>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>
            قم بالترقية للحصول على ميزات أكثر
          </p>
          <button
            onClick={() => navigate('/subscription')}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: 'white',
              color: 'var(--primary-color)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            اشترك الآن
          </button>
        </div>
      </div>

      <div style={{
        padding: '20px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '12px',
        color: 'var(--text-light)',
        textAlign: 'center',
      }}>
        <p>طبيب العجائب v1.0.0</p>
        <p style={{ marginTop: '4px' }}>تطوير: أحمد مصطفى إبراهيم</p>
      </div>
    </aside>
  );
}
