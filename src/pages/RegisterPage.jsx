import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import authService from '../services/authService';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaGithub } from 'react-icons/fa';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    dateOfBirth: '', gender: '', height: '', weight: '', phone: '',
    bloodType: '', chronicDiseases: '', allergies: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    
    setLoading(true);
    try {
      const result = await authService.register(formData.email, formData.password, {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        phone: formData.phone,
        bloodType: formData.bloodType,
        chronicDiseases: formData.chronicDiseases ? formData.chronicDiseases.split(',').map(d => d.trim()) : [],
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
      });
      setUser(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      let result;
      if (provider === 'google') result = await authService.loginWithGoogle();
      else if (provider === 'facebook') result = await authService.loginWithFacebook();
      else if (provider === 'github') result = await authService.loginWithGithub();
      setUser(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--primary-color)' }}>🩺 طبيب العجائب</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>إنشاء حساب جديد</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>الاسم الكامل</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required style={{ paddingRight: '40px' }} />
            </div>
          </div>
          
          <div className="input-group">
            <label>البريد الإلكتروني</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ paddingRight: '40px' }} />
            </div>
          </div>
          
          <div className="input-group">
            <label>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>تأكيد كلمة المرور</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
          </div>
          
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="input-group">
              <label>تاريخ الميلاد</label>
              <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>النوع</label>
              <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="">اختر</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>
          
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="input-group">
              <label>الطول (cm)</label>
              <input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>الوزن (kg)</label>
              <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label>فصيلة الدم</label>
              <select value={formData.bloodType} onChange={(e) => setFormData({...formData, bloodType: e.target.value})}>
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
          </div>
          
          <div className="input-group">
            <label>الأمراض المزمنة (اختياري - افصل بينها بفاصلة)</label>
            <input type="text" value={formData.chronicDiseases} onChange={(e) => setFormData({...formData, chronicDiseases: e.target.value})} placeholder="مثال: سكري، ضغط" />
          </div>
          
          <div className="input-group">
            <label>الحساسية (اختياري - افصل بينها بفاصلة)</label>
            <input type="text" value={formData.allergies} onChange={(e) => setFormData({...formData, allergies: e.target.value})} placeholder="مثال: بنسلين، فول سوداني" />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'جاري...' : 'إنشاء حساب'}
          </button>
        </form>
        
        <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--text-light)' }}>أو سجل عبر</div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleSocialLogin('google')} className="btn btn-secondary" style={{ flex: 1 }}><FcGoogle size={20} /></button>
          <button onClick={() => handleSocialLogin('facebook')} className="btn btn-secondary" style={{ flex: 1 }}><FaFacebook color="#1877f2" size={20} /></button>
          <button onClick={() => handleSocialLogin('github')} className="btn btn-secondary" style={{ flex: 1 }}><FaGithub size={20} /></button>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
