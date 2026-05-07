# 🏥 منصة طبيب العجائب - Tabib Al-Ajaeb

<div dir="rtl">

## نظرة عامة
منصة ذكاء اصطناعي طبية متكاملة تقدم خدمات تشخيص طبي أولي وتحليل للأشعة والتحاليل الطبية باستخدام وكلاء ذكاء اصطناعي متخصصين. تدعم أكثر من 30 مزود ذكاء اصطناعي و15+ بوابة دفع إلكتروني.

### 👨‍💻 المطور
**احمد مصطفي ابراهيم**
- 📱 الهاتف: 01225155329
- 📧 البريد: a12345.mostafa@gmail.com

## ✨ المميزات الرئيسية

### 🤖 وكلاء الذكاء الاصطناعي (8 وكلاء متخصصين + 30+ مزود)
1. **طبيب عام** - تشخيص أولي وحالات عامة
2. **أشعة وتشخيص** - تحليل الأشعة السينية والرنين المغناطيسي والأشعة المقطعية
3. **تحاليل طبية** - تفسير تحاليل الدم والبول وغيرها
4. **قلب وأوعية دموية** - استشارات القلب
5. **مخ وأعصاب** - استشارات عصبية
6. **جلدية** - أمراض الجلد
7. **أطفال** - طب الأطفال
8. **استشاري** - حالات معقدة واستشارات متقدمة

#### مزودو الذكاء الاصطناعي المدعومون (30+):
- **الرئيسية**: OpenAI (GPT-4), Google AI (Gemini), Anthropic (Claude), Cohere
- **السحابية**: Azure OpenAI, AWS Bedrock, Google Vertex AI
- **الأداء العالي**: Groq, Together AI, Perplexity, DeepInfra, Fireworks
- **المفتوحة المصدر**: Ollama, LocalAI, vLLM, Hugging Face
- **المتخصصة الطبية**: MedPaLM, BioBERT, ClinicalBERT
- **الرؤية الحاسوبية**: Clarifai, Imagga, Mindee
- **الصوت**: AssemblyAI, Speechmatics, Rev.ai
- **الإقليمية**: Alibaba, Baidu, Tencent, IBM Watson

### 📋 إدارة الملف الطبي
- إنشاء ملف طبي شامل لكل مستخدم
- تسجيل البيانات الشخصية (الاسم، العمر، الطول، الوزن، فصيلة الدم)
- التاريخ المرضي والمشاكل الصحية المزمنة
- الحساسيات والأدوية الحالية
- رفع وحفظ الأشعة والتحاليل

### 📁 دعم الملفات المتعددة
- **الصور**: JPG, PNG, GIF, WebP, TIFF, DICOM (للأشعة)
- **المستندات**: PDF, Word (DOC/DOCX), TXT
- **الصوت**: MP3, WAV, WebM (للدردشة الصوتية)
- حجم الملف حتى 50MB

### 💳 خطط الاشتراك
| الخطة | السعر | المميزات |
|-------|-------|----------|
| مجاني | 0 ج.م | 5 محادثات يومياً، تحليل أساسي |
| ذهبي | 99 ج.م/شهر | 50 محادثة، تحليل متقدم، 100 ملف |
| بلاتيني | 199 ج.م/شهر | محادثات غير محدودة، كل المميزات |

### 💰 طرق الدفع (15+ بوابة)
#### مصر:
- **محافظ المحمول**: فودافون كاش، اتصالات كاش، أورانج كاش، وي كاش
- **فوري** (Fawry)
- **بايموب** (Paymob)
- **باي تابز** (PayTabs)
- **ميزة** (Meeza)

#### الخليج:
- **تاب** (Tap Payments)
- **ميسر** (Moyasar)

#### الدولية:
- **Stripe** (البطاقات الائتمانية)
- **PayPal**
- **Razorpay**
- **Coinbase Commerce** (العملات الرقمية)

### 🔐 تسجيل الدخول
- البريد الإلكتروني وكلمة المرور
- Google OAuth
- Facebook OAuth  
- GitHub OAuth

## 🏗️ البنية التقنية

### Frontend (الواجهة الأمامية)
- **React.js** مع Vite
- **React Router** للتنقل بين الصفحات
- **Context API** لإدارة الحالة
- تصميم متجاوب يعمل على جميع الأجهزة

### Backend (الخلفية)
- **Node.js** مع Express.js
- **MongoDB** قاعدة بيانات
- **JWT** للمصادقة
- **Multer** لرفع الملفات

### Mobile & Desktop
- **Android**: تطبيق أصلي بـ Kotlin و Jetpack Compose
- **Windows**: تطبيق سطح مكتب بـ Electron

### AI Providers (مزودي الذكاء الاصطناعي)
- OpenAI (GPT-4)
- Google AI (Gemini)
- Anthropic (Claude)
- Cohere
- Replicate
- HuggingFace

## 📂 هيكل المشروع

```
/workspace
├── src/                    # واجهة React
│   ├── pages/             # الصفحات (9 صفحات)
│   ├── components/        # المكونات (3 مكونات)
│   ├── services/          # خدمات API
│   ├── store/             # إدارة الحالة
│   └── config/            # الإعدادات
├── backend/               # خادم Node.js
│   ├── controllers/       # وحدات التحكم (7 ملفات)
│   ├── models/           # نماذج البيانات (6 ملفات)
│   ├── routes/           # مسارات API (7 ملفات)
│   ├── middleware/       # الوساطات
│   └── server.js         # الخادم الرئيسي
├── android/              # تطبيق أندرويد
│   └── app/
│       └── src/main/java/com/tabib/alajaeib/
├── windows/              # تطبيق ويندوز
│   ├── app.js
│   └── preload.js
└── docs/                 # الوثائق
```

## 🚀 التثبيت والتشغيل

### المتطلبات المسبقة
- Node.js 18+ 
- MongoDB 6+
- npm أو yarn

### 1. تثبيت الواجهة الأمامية
```bash
cd /workspace
npm install
npm run dev
```

### 2. تثبيت الخلفية
```bash
cd /workspace/backend
npm install
cp .env.example .env
# عدل ملف .env وأضف مفاتيح API
npm run dev
```

### 3. إعداد متغيرات البيئة
انسخ ملف `.env.example` إلى `.env` في مجلد backend وأضف:
- مفاتيح مزودي الذكاء الاصطناعي
- إعدادات MongoDB
- مفاتيح JWT
- بيانات الدفع

## 📱 تطبيقات الجوال وسطح المكتب

### تطبيق أندرويد
```bash
cd /workspace/android
# افتح المشروع في Android Studio
# قم بالبناء والتشغيل
```

### تطبيق ويندوز
```bash
cd /workspace/windows
npm install
npm start
```

## 🔌 API Endpoints

### المصادقة
- `POST /api/auth/register` - تسجيل حساب جديد
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/social-login` - دخول عبر وسائل التواصل
- `GET /api/auth/me` - جلب بيانات المستخدم الحالي

### الدردشة
- `POST /api/chat/session` - إنشاء جلسة دردشة جديدة
- `GET /api/chat` - جلب جميع المحادثات
- `POST /api/chat/:id/message` - إرسال رسالة

### الملفات
- `POST /api/files/upload` - رفع ملف طبي
- `GET /api/files` - جلب الملفات
- `DELETE /api/files/:id` - حذف ملف

### الاشتراكات
- `GET /api/subscriptions/plans` - جلب خطط الاشتراك
- `POST /api/subscriptions/subscribe` - الاشتراك في خطة
- `GET /api/subscriptions/current` - الاشتراك الحالي

### الإدارة
- `GET /api/admin/stats` - إحصائيات المنصة
- `GET /api/admin/users` - إدارة المستخدمين
- `GET /api/admin/subscriptions` - إدارة الاشتراكات

## ⚠️ إخلاء مسؤولية
هذه المنصة تقدم **تشخيصاً أولياً فقط** ولا تغني عن استشارة الطبيب المعالج. يجب دائماً الرجوع إلى مختص رعاية صحية للحالات الطبية الحقيقية.

## 📄 الترخيص
MIT License - جميع الحقوق محفوظة © 2024 احمد مصطفي ابراهيم

</div>

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js 18+ 
- MongoDB 6+
- npm أو yarn

### تثبيت الباك اند (Backend)
```bash
cd backend
npm install
cp .env.example .env
# قم بتعديل ملف .env وأضف مفاتيح API الخاصة بك
npm run dev
```

### تثبيت الفرونت اند (Frontend)
```bash
cd ..
npm install
npm run dev
```

### تشغيل تطبيقات الجوال وسطح المكتب
- **Android**: افتح مجلد `android` في Android Studio
- **Windows**: انقل مجلد `windows` واستخدم Electron Builder

## 📦 بنية المشروع

```
tabib-al-ajaeib/
├── backend/               # خادم Node.js + Express
│   ├── config/           # إعدادات النظام (30+ AI، 15+ دفع)
│   ├── controllers/      # منطق الأعمال
│   ├── models/          # نماذج قاعدة البيانات
│   ├── routes/          # مسارات API
│   ├── services/        # خدمات AI والدفع
│   ├── middleware/      # Middleware الأمان
│   └── utils/           # دوال مساعدة
├── src/                 # تطبيق React
│   ├── pages/          # الصفحات (9 صفحات)
│   ├── components/     # المكونات
│   ├── services/       # خدمات الواجهة
│   └── store/         # إدارة الحالة
├── android/            # تطبيق أندرويد الأصلي
├── windows/           # تطبيق ويندوز (Electron)
└── docs/             # الوثائق
```

## 🔑 مفاتيح API المطلوبة

### للذكاء الاصطناعي (اختر واحد على الأقل):
- OpenAI API Key (موصى به)
- Google AI API Key
- Anthropic API Key
- أو أي من الـ 30+ مزود المدعوم

### للدفع (حسب المنطقة):
- مصر: Fawry أو Paymob
- الخليج: Tap أو Moyasar
- الدولية: Stripe أو PayPal

## 🛡️ الأمان والأداء
- تشفير JWT للمصادقة
- Helmet للأمان HTTP
- Rate Limiting لمنع الهجمات
- Compression لتحسين الأداء
- Morgan للتتبع

## 📊 الإحصائيات
- **ملفات الكود**: 50+ ملف
- **أسطر الكود**: 5000+ سطر
- **مزودو AI**: 30+ مزود
- **بوابات الدفع**: 15+ بوابة
- **وكلاء طبيين**: 8 وكلاء متخصصين

## 📝 الترخيص
MIT License - جميع الحقوق محفوظة © 2024 احمد مصطفي ابراهيم

## 🤝 الدعم والتواصل
للأسئلة أو الدعم الفني:
- 📱 WhatsApp: 01225155329
- 📧 Email: a12345.mostafa@gmail.com

---

**طبيب العجائب** - مستقبل الرعاية الصحية بالذكاء الاصطناعي 🏥✨

</div>
