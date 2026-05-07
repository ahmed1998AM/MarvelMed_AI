import React, { useState, useEffect } from 'react';
import { useAuthStore, useMedicalStore } from '../store';
import authService from '../services/authService';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { medicalProfile, setMedicalProfile } = useMedicalStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await authService.getUserProfile(user.uid);
      setMedicalProfile(result.data);
      setFormData(result.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateUserProfile(user.uid, formData);
      setMessage({ type: 'success', text: 'تم تحديث الملف الشخصي بنجاح' });
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء التحديث' });
    } finally {
      setLoading(false);
    }
  };

  if (!medicalProfile) return <div className="main-content">جاري التحميل...</div>;

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '24px' }}>الملف الطبي الشخصي</h1>
      
      {message && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px' }}>المعلومات الشخصية</h2>
          <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline">
            {isEditing ? 'إلغاء' : 'تعديل'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>الاسم الكامل</label>
              <input type="text" value={formData.fullName || ''} onChange={(e) => setFormData({...formData, fullName: e.target.value})} disabled={!isEditing} />
            </div>
            
            <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input type="email" value={formData.email || ''} disabled style={{ background: 'var(--bg-secondary)' }} />
            </div>
            
            <div className="input-group">
              <label>تاريخ الميلاد</label>
              <input type="date" value={formData.dateOfBirth || ''} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} disabled={!isEditing} />
            </div>
            
            <div className="input-group">
              <label>النوع</label>
              <select value={formData.gender || ''} onChange={(e) => setFormData({...formData, gender: e.target.value})} disabled={!isEditing}>
                <option value="">اختر</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>الطول (cm)</label>
              <input type="number" value={formData.height || ''} onChange={(e) => setFormData({...formData, height: e.target.value})} disabled={!isEditing} />
            </div>
            
            <div className="input-group">
              <label>الوزن (kg)</label>
              <input type="number" value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: e.target.value})} disabled={!isEditing} />
            </div>
            
            <div className="input-group">
              <label>فصيلة الدم</label>
              <select value={formData.bloodType || ''} onChange={(e) => setFormData({...formData, bloodType: e.target.value})} disabled={!isEditing}>
                <option value="">اختر</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>الهاتف</label>
              <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} />
            </div>
          </div>
          
          <div className="input-group">
            <label>الأمراض المزمنة</label>
            <textarea value={(formData.chronicDiseases || []).join(', ')} onChange={(e) => setFormData({...formData, chronicDiseases: e.target.value.split(',').map(d => d.trim())})} disabled={!isEditing} rows="3" />
          </div>
          
          <div className="input-group">
            <label>الحساسية</label>
            <textarea value={(formData.allergies || []).join(', ')} onChange={(e) => setFormData({...formData, allergies: e.target.value.split(',').map(a => a.trim())})} disabled={!isEditing} rows="3" />
          </div>
          
          {isEditing && (
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
