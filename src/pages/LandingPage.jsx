import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiFileText, FiMessageCircle, FiShield, FiUsers, FiClock } from 'react-icons/fi';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: FiMessageCircle, title: 'وكلاء ذكاء اصطناعي متخصصون', desc: '8 وكلاء طبيين متخصصين في مختلف المجالات الطبية' },
    { icon: FiFileText, title: 'تحليل الأشعة والتحاليل', desc: 'رفع وتحليل جميع أنواع الملفات الطبية بدقة عالية' },
    { icon: FiActivity, title: 'ملف طبي متكامل', desc: 'سجل طبي شامل يحفظ جميع استشاراتك وتحاليلك' },
    { icon: FiShield, title: 'أمان وخصوصية', desc: 'حماية كاملة لبياناتك الطبية الشخصية' },
    { icon: FiUsers, title: 'دعم متعدد اللغات', desc: 'واجهة عربية وإنجليزية سهلة الاستخدام' },
    { icon: FiClock, title: 'متاح 24/7', desc: 'استشر أطباء الذكاء الاصطناعي في أي وقت' },
  ];

  const plans = [
    { name: 'مجاني', price: '0', period: 'شهرياً', features: ['3 استشارات شهرياً', 'وكيل عام فقط', 'تخزين محدود'], popular: false },
    { name: 'ذهبي', price: '99', period: 'شهرياً', features: ['50 استشارة شهرياً', 'جميع الوكلاء', 'تحليل صور الأشعة', 'تخزين 5GB'], popular: true },
    { name: 'بلاتيني', price: '199', period: 'شهرياً', features: ['استشارات غير محدودة', 'جميع الوكلاء + استشاري', 'تحليل متقدم', 'تخزين 20GB', 'دعم أولوي'], popular: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px' }}>
          🩺 منصة طبيب العجائب
        </h1>
        <p style={{ fontSize: '20px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 40px' }}>
          منصة ذكاء اصطناعي طبية متكاملة مع وكلاء متخصصين لتحليل الأشعة والتحاليل وتقديم استشارات طبية احترافية
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/register')}
            className="btn btn-primary"
            style={{ background: 'white', color: '#667eea' }}
          >
            أنشئ حساب مجاني
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-outline"
            style={{ borderColor: 'white', color: 'white' }}
          >
            تسجيل الدخول
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '60px', color: 'var(--text-primary)' }}>
          مميزات المنصة
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px' 
        }}>
          {features.map((feature, index) => (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <feature.icon size={48} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '60px' }}>
            خطط الاشتراك
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px' 
          }}>
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className="card" 
                style={{ 
                  position: 'relative',
                  border: plan.popular ? '2px solid var(--primary-color)' : 'none',
                  transform: plan.popular ? 'scale(1.05)' : 'none',
                }}
              >
                {plan.popular && (
                  <span style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--primary-color)',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                    الأكثر شعبية
                  </span>
                )}
                <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{plan.name}</h3>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-color)' }}>
                    {plan.price}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}> ج.م / {plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: '24px', textAlign: 'right' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/register')}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  اشترك الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--text-primary)', 
        color: 'white', 
        padding: '40px 20px',
        textAlign: 'center',
      }}>
        <h3 style={{ marginBottom: '16px' }}>🩺 طبيب العجائب</h3>
        <p style={{ marginBottom: '8px' }}>تطوير: أحمد مصطفى إبراهيم</p>
        <p style={{ marginBottom: '8px' }}>الهاتف: 01225155329</p>
        <p style={{ marginBottom: '16px' }}>البريد: a12345.mostafa@gmail.com</p>
        <p style={{ opacity: 0.7, fontSize: '14px' }}>
          © 2024 جميع الحقوق محفوظة - منصة طبيب العجائب
        </p>
      </footer>
    </div>
  );
}
