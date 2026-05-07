import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionPage() {
  const navigate = useNavigate();

  const plans = [
    { 
      name: 'مجاني', 
      price: '0', 
      period: 'شهرياً', 
      features: ['3 استشارات شهرياً', 'وكيل عام فقط', 'تخزين محدود (500MB)', 'دعم عبر البريد الإلكتروني'], 
      popular: false,
      color: '#636e72'
    },
    { 
      name: 'ذهبي', 
      price: '99', 
      period: 'شهرياً', 
      features: ['50 استشارة شهرياً', 'جميع الوكلاء (8 وكلاء)', 'تحليل صور الأشعة', 'تخزين 5GB', 'دعم فني متميز', 'تقارير PDF'], 
      popular: true,
      color: '#fdcb6e'
    },
    { 
      name: 'بلاتيني', 
      price: '199', 
      period: 'شهرياً', 
      features: ['استشارات غير محدودة', 'جميع الوكلاء + استشاري', 'تحليل متقدم للأشعة والتحاليل', 'تخزين 20GB', 'دعم أولوي 24/7', 'تقارير مفصلة PDF', 'مكالمات صوتية', 'تصدير البيانات'], 
      popular: false,
      color: '#00b894'
    },
  ];

  const paymentMethods = [
    { name: 'بطاقة ائتمان/خصم', icon: '💳', providers: ['Visa', 'Mastercard', 'Meeza'] },
    { name: 'فودافون كاش', icon: '📱', code: '*90#' },
    { name: 'اتصالات كاش', icon: '📱', code: '*959#' },
    { name: 'اورنج كاش', icon: '📱', code: '*157#' },
    { name: 'وي كاش', icon: '📱', code: '*989#' },
    { name: 'فوري', icon: '🏪', code: 'من أي منفذ فوري' },
  ];

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>خطط الاشتراك</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
        اختر الخطة المناسبة لاحتياجاتك واحصل على أفضل رعاية طبية ذكية
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '60px' }}>
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className="card" 
            style={{ 
              position: 'relative',
              border: plan.popular ? '3px solid var(--primary-color)' : '1px solid var(--border-color)',
              transform: plan.popular ? 'scale(1.05)' : 'none',
            }}
          >
            {plan.popular && (
              <span style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--primary-color)',
                color: 'white',
                padding: '6px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                ⭐ الأكثر شعبية
              </span>
            )}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '28px', marginBottom: '8px', color: plan.color }}>{plan.name}</h3>
              <div>
                <span style={{ fontSize: '56px', fontWeight: '700', color: plan.color }}>{plan.price}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '16px' }}> ج.م / {plan.period}</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/payment')}
              className="btn btn-primary"
              style={{ width: '100%', background: plan.popular ? 'var(--primary-color)' : 'transparent', color: plan.popular ? 'white' : 'var(--primary-color)', border: plan.popular ? 'none' : '2px solid var(--primary-color)' }}
            >
              اشترك الآن
            </button>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>طرق الدفع المتاحة</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {paymentMethods.map((method, index) => (
          <div key={index} className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}>{method.icon}</span>
            <h4 style={{ marginBottom: '8px' }}>{method.name}</h4>
            {method.providers && <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>{method.providers.join(' - ')}</p>}
            {method.code && <p style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '16px' }}>{method.code}</p>}
          </div>
        ))}
      </div>

      <div className="alert alert-info" style={{ marginTop: '40px', textAlign: 'center' }}>
        <strong>ملاحظة:</strong> جميع الأسعار شاملة ضريبة القيمة المضافة. يمكنك إلغاء الاشتراك في أي وقت.
      </div>
    </div>
  );
}
