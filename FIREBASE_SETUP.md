# إعداد Firebase لمتجر Eagle Store

## الخطوات المطلوبة:

### 1. إنشاء مشروع Firebase
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على "Add project" أو "إنشاء مشروع"
3. أدخل اسم المشروع: `eagle-store`
4. اتبع الخطوات لإنهاء الإعداد

### 2. إعداد Authentication
1. في لوحة تحكم Firebase، اذهب إلى "Authentication"
2. انقر على "Get started"
3. في تبويب "Sign-in method"، فعّل:
   - Email/Password
   - Anonymous (اختياري)

### 3. إعداد Firestore Database
1. اذهب إلى "Firestore Database"
2. انقر على "Create database"
3. اختر "Start in test mode" (للتطوير)
4. اختر موقع قاعدة البيانات (اختر الأقرب لك)

### 4. إعداد Storage
1. اذهب إلى "Storage"
2. انقر على "Get started"
3. اختر "Start in test mode"
4. اختر نفس موقع قاعدة البيانات

### 5. إعداد Web App
1. في لوحة التحكم الرئيسية، انقر على أيقونة الويب `</>`
2. أدخل اسم التطبيق: `eagle-store-web`
3. فعّل "Firebase Hosting" (اختياري)
4. انقر على "Register app"

### 6. نسخ إعدادات Firebase
بعد التسجيل، ستحصل على كود مثل هذا:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "eagle-store-xxxxx.firebaseapp.com",
  projectId: "eagle-store-xxxxx",
  storageBucket: "eagle-store-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### 7. تحديث ملف Firebase في المشروع
1. افتح ملف `src/firebase.js`
2. استبدل `firebaseConfig` بالإعدادات الخاصة بك
3. احفظ الملف

### 8. إعداد قواعد الأمان (Security Rules)

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products for everyone
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Allow read/write access to orders for authenticated users
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 9. هيكل قاعدة البيانات

#### Products Collection:
```javascript
{
  "products": {
    "productId": {
      "name": "اسم المنتج",
      "description": "وصف المنتج",
      "price": 250,
      "category": "t-shirt",
      "colors": ["أبيض", "أزرق"],
      "sizes": ["M", "L", "XL"],
      "images": ["url1", "url2"],
      "stock": 50,
      "featured": true,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
}
```

#### Orders Collection:
```javascript
{
  "orders": {
    "orderId": {
      "customer": {
        "name": "اسم العميل",
        "email": "email@example.com",
        "phone": "+20123456789",
        "address": "العنوان"
      },
      "items": [
        {
          "productId": "id",
          "name": "اسم المنتج",
          "price": 250,
          "quantity": 2,
          "color": "أزرق",
          "size": "L"
        }
      ],
      "total": 500,
      "status": "pending",
      "paymentMethod": "كاش عند الاستلام",
      "shippingCost": 30,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
}
```

### 10. اختبار الاتصال
بعد تحديث الإعدادات:
1. شغّل التطبيق: `npm start`
2. اذهب إلى صفحة إدارة المنتجات
3. إذا لم توجد منتجات، سيعرض عليك إضافة بيانات تجريبية
4. تحقق من Firebase Console لرؤية البيانات

## ملاحظات مهمة:
- احتفظ بإعدادات Firebase في مكان آمن
- لا تشارك `apiKey` في الأماكن العامة
- قم بتحديث قواعد الأمان قبل النشر في الإنتاج
- استخدم متغيرات البيئة في الإنتاج

## الدعم:
إذا واجهت أي مشاكل، تحقق من:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)

## الخطوات الإضافية:

### 1. نسخ إعدادات Firebase
بعد التسجيل، ستحصل على كود مثل هذا:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "eagle-store-xxxxx.firebaseapp.com",
  projectId: "eagle-store-xxxxx",
  storageBucket: "eagle-store-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### 2. تحديث ملف Firebase في المشروع
1. افتح ملف `src/firebase.js`
2. استبدل `firebaseConfig` بالإعدادات الخاصة بك
3. احفظ الملف

### 3. إعداد قواعد الأمان (Security Rules)

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products for everyone
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Allow read/write access to orders for authenticated users
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. إعداد CORS Configuration

#### إعداد CORS Configuration
1. إنشاء ملف `cors.json` بهذا المحتوى:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"]
  }
]
```

2. إنشاء ملف `.env` بهذا المحتوى:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

3. تحديث ملف `src/firebase.js` لاستخدام متغيرات البيئة

### 5. اختبار الإعدادات
1. شغّل التطبيق: `npm start`
2. اذهب إلى صفحة إدارة المنتجات
3. إذا لم توجد منتجات، سيعرض عليك إضافة بيانات تجريبية
4. تحقق من Firebase Console لرؤية البيانات

## ملاحظات مهمة:
- احتفظ بإعدادات Firebase في مكان آمن
- لا تشارك `apiKey` في الأماكن العامة
- قم بتحديث قواعد الأمان قبل النشر في الإنتاج
- استخدم متغيرات البيئة في الإنتاج

## الدعم:
إذا واجهت أي مشاكل، تحقق من:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage) 