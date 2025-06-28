# Eagle Store 🦅 - متجر إلكتروني حديث

متجر إلكتروني احترافي وحديث ومتجاوب بالكامل للملابس، مبني بـ React.js مع تكامل Firebase شامل لإدارة البيانات والصور.

## 🚀 المميزات الرئيسية

### 💻 واجهة العملاء
- **شريط التنقل**: تنقل نظيف مع شعار المتجر وأيقونة السلة مع عداد المنتجات
- **الصفحة الرئيسية**: خلفية كاملة العرض مع دعوة مقنعة للعمل
- **صفحة المنتجات**: وظائف البحث والتصفية لاكتشاف المنتجات بسهولة
- **أقسام الفئات**: ثلاث فئات رئيسية (تي شيرت، بنطلونات، إكسسوارات)
- **سلة التسوق**: نظام سلة متقدم مع إمكانية تعديل الكميات وإتمام الطلبات
- **نموذج الطلب**: نموذج شامل لبيانات العميل مع حفظ الطلب في Firebase
- **تصميم متجاوب**: متجاوب بالكامل عبر جميع الأجهزة

### 🛠 واجهة الإدارة
- **تسجيل دخول آمن**: لوحة إدارة مخفية في `/secret-admin-panel`
- **لوحة التحكم**: نظرة عامة على المنتجات والطلبات والإيرادات
- **إدارة المنتجات**: إضافة وتعديل وحذف المنتجات مع رفع الصور
- **مقاسات حسب الفئة**: خيارات مقاسات تلقائية حسب فئة المنتج
- **إدارة الطلبات**: عرض وإدارة طلبات العملاء مع تحديث الحالة
- **تكامل Firebase**: تخزين البيانات والمصادقة والصور

## 🎨 Design Features

- **Modern UI**: Clean, professional design with soft white-based color theme
- **Smooth Animations**: Hover effects and transitions for enhanced UX
- **High-Quality Images**: Curated Unsplash images for products and hero section
- **Icons**: Font Awesome icons throughout the interface
- **Typography**: Inter font family for modern look

## 🔧 التقنيات المستخدمة

- **Frontend**: React 18, HTML5, CSS3
- **Styling**: Bootstrap 5, Custom CSS
- **Icons**: Font Awesome
- **Backend**: Firebase (Firestore + Storage + Auth)
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage (رفع الصور)
- **Routing**: React Router DOM
- **Build Tool**: Create React App

## 🔥 وظائف Firebase المدمجة

### إدارة المنتجات
- `addProduct()` - إضافة منتج جديد مع رفع الصور
- `getProducts()` - جلب جميع المنتجات
- `getProductsByCategory()` - جلب منتجات حسب الفئة
- `updateProduct()` - تحديث بيانات المنتج
- `deleteProduct()` - حذف منتج
- `subscribeToProducts()` - الاستماع للتغييرات المباشرة

### إدارة الطلبات
- `addOrder()` - إضافة طلب جديد
- `getOrders()` - جلب جميع الطلبات
- `updateOrderStatus()` - تحديث حالة الطلب
- `subscribeToOrders()` - الاستماع للتغييرات المباشرة

### إدارة الصور
- `uploadImage()` - رفع صورة إلى Firebase Storage
- `deleteImage()` - حذف صورة من Storage

### البيانات التجريبية
- `addSampleProducts()` - إضافة منتجات تجريبية للاختبار

## 📦 التثبيت والإعداد

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd eagle
```

2. تثبيت التبعيات:
```bash
npm install
```

3. إعداد Firebase:
   - راجع ملف `FIREBASE_SETUP.md` للتعليمات التفصيلية
   - أنشئ مشروع Firebase في https://console.firebase.google.com
   - فعّل Authentication و Firestore و Storage
   - انسخ إعدادات Firebase إلى `src/firebase.js`

4. تشغيل الخادم:
```bash
npm start
```

سيفتح التطبيق على `http://localhost:3000`

## 🔐 الوصول للإدارة

- **الرابط**: `/secret-admin-panel`
- **بيانات الدخول التجريبية**:
  - Email: `admin@eaglestore.com`
  - Password: `admin123`

## 📖 كيفية استخدام النظام

### للعملاء:
1. **تصفح المنتجات**: في الصفحة الرئيسية أو صفحة المنتجات
2. **إضافة للسلة**: اختر اللون والمقاس (إن وجد) وأضف المنتج
3. **مراجعة السلة**: عدّل الكميات أو احذف المنتجات
4. **إتمام الطلب**: املأ بيانات العميل وأكد الطلب
5. **تأكيد الطلب**: سيتم حفظ الطلب في Firebase

### للإداريين:
1. **تسجيل الدخول**: اذهب إلى `/secret-admin-panel`
2. **إضافة منتجات**: استخدم نموذج إضافة المنتجات مع رفع الصور
3. **إدارة المنتجات**: عرض وتعديل وحذف المنتجات الموجودة
4. **متابعة الطلبات**: عرض الطلبات وتحديث حالاتها
5. **مراجعة الإحصائيات**: عدد المنتجات والطلبات والإيرادات

## 📱 هيكل الصفحات

```
/                    - الصفحة الرئيسية مع البطل والفئات والمعلومات
/products           - جميع المنتجات مع البحث والفلاتر
/cart               - سلة التسوق مع نموذج الطلب
/category/:name     - منتجات فئة محددة
/secret-admin-panel - تسجيل دخول الإدارة
/admin-dashboard    - لوحة إدارة المتجر
/add-new-product    - إضافة منتج جديد
/manage-products    - إدارة المنتجات
/orders-management  - إدارة الطلبات
```

## 🗃️ هيكل قاعدة البيانات (Firebase)

### مجموعة المنتجات (Products Collection)
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

### مجموعة الطلبات (Orders Collection)
```javascript
{
  "orders": {
    "orderId": {
      "customer": {
        "name": "اسم العميل",
        "email": "email@example.com",
        "phone": "+20123456789",
        "address": "العنوان الكامل"
      },
      "items": [
        {
          "productId": "id",
          "name": "اسم المنتج",
          "price": 250,
          "quantity": 2,
          "color": "أزرق",
          "size": "L",
          "image": "url"
        }
      ],
      "subtotal": 500,
      "shippingCost": 30,
      "total": 530,
      "status": "pending",
      "paymentMethod": "كاش عند الاستلام",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
}
```

## 🛍 Product Categories

### T-Shirts
- Sizes: XS, S, M, L, XL
- Examples: Classic Cotton T-Shirt, Premium Polo Shirt, Graphic T-Shirt

### Pants
- Sizes: 30, 32, 34, 36, 38, 40
- Examples: Slim Fit Jeans, Chino Pants

### Accessories
- No size options
- Examples: Leather Wallet, Stylish Watch, Casual Backpack

## 📊 Admin Dashboard Features

1. **Dashboard Overview**
   - Total products count
   - Total orders count
   - Revenue summary

2. **Add Product**
   - Product name and price
   - Category selection
   - Image URL upload
   - Automatic size assignment

3. **Manage Products**
   - View all products in table format
   - Delete products
   - Product images and details

4. **Orders Management**
   - View customer orders
   - Order status updates
   - Customer information

## 🎯 Key Components

- `Navbar`: Navigation with cart and store branding
- `Home`: Landing page with all sections
- `Products`: Product listing with search/filter
- `Category`: Category-specific product display
- `AdminLogin`: Secure admin authentication
- `AdminDashboard`: Complete admin management interface
- `Footer`: Brand information and social media links

## 🌟 Design Highlights

- **Hero Section**: Stunning background with centered content
- **Category Cards**: Interactive cards with hover effects
- **Product Cards**: Clean product display with pricing and sizes
- **Info Cards**: Service highlights with icons
- **Contact Section**: Integrated Google Maps
- **Admin Panel**: Professional dashboard with tabs

## 📝 Sample Data

The application includes sample products and orders for demonstration:
- 8 sample products across all categories
- Sample orders with customer information
- Realistic pricing and product images

## 🔒 الأمان

- **قواعد Firestore**: حماية البيانات مع قواعد أمان مخصصة
- **تشفير الاتصالات**: جميع الاتصالات مع Firebase مشفرة
- **التحقق من البيانات**: فحص صحة البيانات قبل الحفظ
- **حماية الإدارة**: صفحات الإدارة محمية بتسجيل الدخول

## 🌐 النشر

للنشر على Firebase Hosting:

```bash
npm run build
firebase login
firebase init hosting
firebase deploy
```

## 🔄 التحسينات المستقبلية

- ✅ نظام سلة التسوق (مكتمل)
- ✅ إدارة الطلبات (مكتمل)
- ✅ رفع الصور (مكتمل)
- 🔄 مصادقة المستخدمين للعملاء
- 🔄 تكامل الدفع الإلكتروني
- 🔄 تقييمات ومراجعات المنتجات
- 🔄 إدارة المخزون المتقدمة
- 🔄 إشعارات البريد الإلكتروني
- 🔄 تتبع الطلبات

## 📞 معلومات الاتصال

- **المتجر**: شارع الموضة 123، القاهرة، مصر
- **الهاتف**: +20 (100) 123-4567
- **البريد الإلكتروني**: info@eaglestore.com

## 📱 وسائل التواصل الاجتماعي

- Facebook: https://facebook.com/eaglestore
- Instagram: https://instagram.com/eaglestore
- Twitter: https://twitter.com/eaglestore

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع تم إنشاؤه لأغراض تعليمية وتوضيحية.

## 🆘 الدعم والمساعدة

- راجع ملف `FIREBASE_SETUP.md` لإعداد Firebase
- تحقق من console المتصفح للأخطاء
- راجع Firebase Console لحالة قاعدة البيانات
- افتح Issue في GitHub للمساعدة

---

تم بناؤه بـ ❤️ لمحبي الموضة من فريق Eagle Store 🦅 