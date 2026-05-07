import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import authService from '../services/authService';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaGithub } from 'react-icons/fa';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authService.login(formData.email, formData.password);
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
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--primary-color)' }}>🩺 طبيب العجائب</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>تسجيل الدخول لحسابك</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'جاري...' : 'تسجيل الدخول'}
          </button>
        </form>
        
        <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--text-light)' }}>أو سجل الدخول عبر</div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleSocialLogin('google')} className="btn btn-secondary" style={{ flex: 1 }}><FcGoogle size={20} /> Google</button>
          <button onClick={() => handleSocialLogin('facebook')} className="btn btn-secondary" style={{ flex: 1 }}><FaFacebook color="#1877f2" size={20} /> Facebook</button>
          <button onClick={() => handleSocialLogin('github')} className="btn btn-secondary" style={{ flex: 1 }}><FaGithub size={20} /> GitHub</button>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          ليس لديك حساب؟ <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>أنشئ حساب جديد</Link>
        </p>
      </div>
    </div>
  );
}
