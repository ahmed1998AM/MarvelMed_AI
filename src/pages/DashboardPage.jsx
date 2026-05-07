import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useMedicalStore } from '../store';
import authService from '../services/authService';
import aiService from '../services/aiService';
import { FiMessageCircle, FiFileText, FiActivity, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { medicalProfile, setMedicalProfile } = useMedicalStore();
  const [stats, setStats] = useState({ consultations: 0, filesUploaded: 0, activePlan: 'free' });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const result = await authService.getUserProfile(user.uid);
      setMedicalProfile(result.data);
      setStats({
        consultations: result.data.consultations?.length || 0,
        filesUploaded: result.data.filesUploaded?.length || 0,
        activePlan: result.data.subscriptionPlan || 'free',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const agents = aiService.getAvailableAgents();

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '24px', fontSize: '32px' }}>مرحباً، {medicalProfile?.fullName || user?.email} 👋</h1>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white' }}>
          <FiMessageCircle size={32} style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '36px', fontWeight: '700' }}>{stats.consultations}</h3>
          <p>استشارة طبية</p>
        </div>
        
        <div className="card">
          <FiFileText size={32} color="var(--primary-color)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.filesUploaded}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>ملف طبي مرفوع</p>
        </div>
        
        <div className="card">
          <FiActivity size={32} color="var(--success-color)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{stats.activePlan === 'free' ? 'خطة مجانية' : stats.activePlan === 'gold' ? 'خطة ذهبية' : 'خطة بلاتينية'}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>الاشتراك الحالي</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>إجراءات سريعة</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <button onClick={() => navigate('/chat')} className="btn btn-primary" style={{ padding: '20px' }}>
          <FiMessageCircle size={24} />
          <span>استشارة جديدة</span>
        </button>
        <button onClick={() => navigate('/profile')} className="btn btn-secondary" style={{ padding: '20px' }}>
          <FiFileText size={24} />
          <span>الملفي الطبي</span>
        </button>
        <button onClick={() => navigate('/subscription')} className="btn btn-outline" style={{ padding: '20px' }}>
          <FiActivity size={24} />
          <span>ترقية الاشتراك</span>
        </button>
      </div>

      {/* Available Agents */}
      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>الوكلاء المتاحون</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {agents.map((agent) => (
          <div key={agent.name} className="card" style={{ cursor: 'pointer', transition: 'var(--transition)' }} onClick={() => navigate(`/chat/${agent.name}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{agent.name}</h3>
              <FiArrowRight color="var(--primary-color)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>{agent.specialty}</p>
            <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>{agent.description}</p>
            <span className="badge badge-primary" style={{ marginTop: '12px', display: 'inline-block' }}>{agent.provider}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
