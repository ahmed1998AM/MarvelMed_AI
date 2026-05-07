# 📚 وثائق API - منصة طبيب العجائب

## المصادقة (Authentication)

### تسجيل مستخدم جديد
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "احمد محمد",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "height": 175,
  "weight": 70,
  "bloodType": "O+"
}
```

### تسجيل الدخول
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### تسجيل الدخول الاجتماعي
```
POST /api/auth/social-login
Content-Type: application/json

{
  "provider": "google",
  "accessToken": "token...",
  "profile": {
    "id": "123",
    "email": "user@gmail.com",
    "name": "احمد محمد"
  }
}
```

## المحادثات (Chat)

### إنشاء محادثة جديدة
```
POST /api/chat/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "agentId": "agent_123",
  "agentName": "طبيب عام",
  "agentType": "general"
}
```

### إرسال رسالة
```
POST /api/chat/sessions/:id/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "أشعر بصداع شديد",
  "attachments": []
}
```

### جلب المحادثات
```
GET /api/chat/sessions
Authorization: Bearer {token}
```

## الملفات الطبية (Medical Files)

### رفع ملف طبي
```
POST /api/files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary file]
```

### جلب جميع الملفات
```
GET /api/files
Authorization: Bearer {token}
```

### حذف ملف
```
DELETE /api/files/:id
Authorization: Bearer {token}
```

## الاشتراكات (Subscriptions)

### جلب خطط الاشتراك
```
GET /api/subscriptions/plans
```

### الاشتراك في خطة
```
POST /api/subscriptions/subscribe
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "gold",
  "paymentMethod": "vodafone_cash"
}
```

### إلغاء الاشتراك
```
PUT /api/subscriptions/cancel
Authorization: Bearer {token}
```

## لوحة الإدارة (Admin)

### إحصائيات النظام
```
GET /api/admin/stats
Authorization: Bearer {admin_token}
```

### إدارة المستخدمين
```
GET /api/admin/users?page=1&limit=20&search=احمد
Authorization: Bearer {admin_token}

PUT /api/admin/users/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "isActive": true,
  "role": "user"
}
```

### إدارة وكلاء الذكاء الاصطناعي
```
GET /api/admin/agents
Authorization: Bearer {admin_token}

POST /api/admin/agents
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "وكيل جديد",
  "specialty": "cardiology",
  "systemPrompt": "أنت طبيب قلب متخصص...",
  "modelProvider": "openai",
  "modelName": "gpt-4"
}
```

## الاستجابات (Responses)

### استجابة ناجحة
```json
{
  "success": true,
  "message": "تمت العملية بنجاح",
  "data": { ... }
}
```

### استجابة خطأ
```json
{
  "success": false,
  "message": "حدث خطأ",
  "error": "تفاصيل الخطأ"
}
```

## رموز الحالة (Status Codes)

| الرمز | الوصف |
|-------|-------|
| 200 | نجاح |
| 201 | تم الإنشاء |
| 400 | طلب غير صحيح |
| 401 | غير مصرح |
| 403 | ممنوع |
| 404 | غير موجود |
| 500 | خطأ في الخادم |
