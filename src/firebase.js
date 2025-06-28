import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot 
} from 'firebase/firestore';
// Firebase Storage imports removed - using Base64 system instead

// Firebase config - store | نسر Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg3FzR2QQti8ZzvKBtZxTeOUTGhjEiUM4",
  authDomain: "kenzo-store.firebaseapp.com",
  projectId: "kenzo-store",
  storageBucket: "kenzo-store.appspot.com",
  messagingSenderId: "306574791255",
  appId: "1:306574791255:web:c7a0324c1be85989780912",
  measurementId: "G-J3DGW4VGBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// ============ PRODUCTS FUNCTIONS ============

// إضافة منتج جديد
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
};

// جلب جميع المنتجات
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    );
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error getting products:', error);
    return { success: false, error: error.message };
  }
};

// جلب منتجات حسب الفئة
export const getProductsByCategory = async (category) => {
  try {
    console.log('Firebase: Searching for category:', category); // Debug log
    const q = query(
      collection(db, 'products'), 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      const productData = { id: doc.id, ...doc.data() };
      console.log('Firebase: Found product:', productData.name, 'Category:', productData.category); // Debug log
      products.push(productData);
    });
    console.log('Firebase: Total products found:', products.length); // Debug log
    return { success: true, products };
  } catch (error) {
    console.error('Error getting products by category:', error);
    return { success: false, error: error.message };
  }
};

// تحديث منتج
export const updateProduct = async (productId, updatedData) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updatedData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
};

// حذف منتج
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};

// ============ ORDERS FUNCTIONS ============

// إضافة طلب جديد
export const addOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding order:', error);
    return { success: false, error: error.message };
  }
};

// جلب جميع الطلبات
export const getOrders = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    );
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Error getting orders:', error);
    return { success: false, error: error.message };
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: status,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// ============ IMAGE FUNCTIONS (Base64) ============

// تحويل الصورة إلى Base64
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

// رفع صورة كـ Base64
export const uploadImageAsBase64 = async (file) => {
  try {
    // تحويل الصورة إلى Base64
    const base64String = await convertImageToBase64(file);
    
    // إنشاء معرف فريد للصورة
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // حفظ الصورة في Firestore
    const imageDoc = {
      id: imageId,
      data: base64String,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date()
    };
    
    await addDoc(collection(db, 'images'), imageDoc);
    
    return { 
      success: true, 
      imageId: imageId,
      base64: base64String 
    };
  } catch (error) {
    console.error('Error uploading image as Base64:', error);
    return { success: false, error: error.message };
  }
};

// جلب صورة بالـ Base64
export const getImageBase64 = async (imageId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'images'), where('id', '==', imageId))
    );
    
    if (!querySnapshot.empty) {
      const imageDoc = querySnapshot.docs[0];
      return { success: true, base64: imageDoc.data().data };
    } else {
      return { success: false, error: 'Image not found' };
    }
  } catch (error) {
    console.error('Error getting image:', error);
    return { success: false, error: error.message };
  }
};

// حذف صورة
export const deleteImageBase64 = async (imageId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'images'), where('id', '==', imageId))
    );
    
    if (!querySnapshot.empty) {
      const imageDoc = querySnapshot.docs[0];
      await deleteDoc(imageDoc.ref);
      return { success: true };
    } else {
      return { success: false, error: 'Image not found' };
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
};

// ============ REAL-TIME LISTENERS ============

// الاستماع للتغييرات في المنتجات
export const subscribeToProducts = (callback) => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    callback(products);
  });
};

// الاستماع للتغييرات في الطلبات
export const subscribeToOrders = (callback) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    callback(orders);
  });
};

// ============ SAMPLE DATA FUNCTIONS ============

// إضافة بيانات تجريبية للطلبات
export const addSampleOrders = async () => {
  try {
    const sampleOrders = [
      {
        items: [
          {
            id: "sample_tshirt_1",
            name: "Classic Cotton T-Shirt",
            price: 250,
            quantity: 2,
            selectedColor: "Black",
            selectedSize: "L",
            image: getPlaceholderImageBase64("t-shirt")
          }
        ],
        customerInfo: {
          fullName: "Ahmed Mohamed Ali",
          address: "123 Tahrir Street, Apt 5, Floor 3, Downtown, Cairo, Egypt",
          phone: "+201012345678"
        },
        subtotal: 500,
        shippingCost: 80,
        total: 580,
        paymentMethod: "Cash on Delivery",
        status: "pending",
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        items: [
          {
            id: "sample_jeans_1", 
            name: "Slim Fit Jeans",
            price: 450,
            quantity: 1,
            selectedColor: "Blue",
            selectedSize: "32",
            image: getPlaceholderImageBase64("pants")
          },
          {
            id: "sample_wallet_1",
            name: "Premium Leather Wallet", 
            price: 180,
            quantity: 1,
            selectedColor: "Brown",
            selectedSize: "One Size",
            image: getPlaceholderImageBase64("accessories")
          }
        ],
        customerInfo: {
          fullName: "Fatima Hassan Ibrahim",
          address: "456 Nile Corniche, Building 12, Floor 7, Maadi, Cairo, Egypt",
          phone: "+201098765432"
        },
        subtotal: 630,
        shippingCost: 80,
        total: 710,
        paymentMethod: "Cash on Delivery",
        status: "processing",
        orderDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const promises = sampleOrders.map(async (order) => {
      const docRef = await addDoc(collection(db, 'orders'), order);
      return docRef.id;
    });

    await Promise.all(promises);
    
    return { success: true, message: 'Sample orders added successfully' };
  } catch (error) {
    console.error('Error adding sample orders:', error);
    return { success: false, error: error.message };
  }
};

// إضافة بيانات تجريبية للمنتجات
export const addSampleProducts = async () => {
  try {
    const sampleProducts = [
      {
        name: "Classic Cotton T-Shirt",
        price: 250,
        category: "t-shirt",
        description: "High-quality cotton t-shirt, comfortable and durable. Perfect for everyday wear with a classic fit.",
        colors: ["White", "Black", "Blue", "Brown"],
        sizes: ["S", "M", "L", "XL"],
        image: getPlaceholderImageBase64("t-shirt"),
        imageId: `sample_tshirt_${Date.now()}`,
        stock: 25,
        createdAt: new Date().toISOString()
      },
      {
        name: "Premium Cotton T-Shirt",
        price: 280,
        category: "t-shirt",
        description: "Premium quality cotton t-shirt with superior comfort and modern fit. Available in multiple colors.",
        colors: ["Black", "Blue", "Brown", "Gray"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        image: getPlaceholderImageBase64("t-shirt"),
        imageId: `sample_tshirt2_${Date.now()}`,
        stock: 30,
        createdAt: new Date().toISOString()
      },
      {
        name: "Slim Fit Jeans",
        price: 450,
        category: "pants",
        description: "Modern slim-fit jeans suitable for all occasions. Made from premium denim with excellent stretch.",
        colors: ["Black", "Blue", "Brown"],
        sizes: ["30", "32", "34", "36"],
        image: getPlaceholderImageBase64("pants"),
        imageId: `sample_jeans_${Date.now()}`,
        stock: 15,
        createdAt: new Date().toISOString()
      },
      {
        name: "Casual Chino Pants",
        price: 380,
        category: "pants",
        description: "Comfortable chino pants perfect for casual and semi-formal occasions. High-quality fabric with modern cut.",
        colors: ["Black", "Brown", "Navy", "Khaki"],
        sizes: ["30", "32", "34", "36", "38"],
        image: getPlaceholderImageBase64("pants"),
        imageId: `sample_chino_${Date.now()}`,
        stock: 20,
        createdAt: new Date().toISOString()
      },
      {
        name: "Premium Leather Wallet",
        price: 180,
        category: "accessories",
        description: "Elegant leather wallet made from genuine high-quality leather with modern design.",
        colors: ["Brown", "Black"],
        sizes: ["One Size"],
        image: getPlaceholderImageBase64("accessories"),
        imageId: `sample_wallet_${Date.now()}`,
        stock: 12,
        createdAt: new Date().toISOString()
      }
    ];

    const promises = sampleProducts.map(async (product) => {
      const docRef = await addDoc(collection(db, 'products'), product);
      return docRef.id;
    });

    await Promise.all(promises);
    
    return { success: true, message: 'Sample products added successfully' };
  } catch (error) {
    console.error('Error adding sample products:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to get placeholder images as Base64
const getPlaceholderImageBase64 = (category) => {
  // صور Base64 صغيرة للاختبار - SVG محولة إلى Base64
  const placeholderImages = {
    't-shirt': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY4NGY0Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNsYXNzaWM8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlQtU2hpcnQ8L3RleHQ+PC9zdmc+',
    'pants': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNmI3Mjc5Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNsaW0gRml0PC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5KZWFuczwvdGV4dD48L3N2Zz4=',
    'accessories': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGM0MjYyIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxlYXRoZXI8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPldhbGxldDwvdGV4dD48L3N2Zz4='
  };
  
  return placeholderImages[category] || placeholderImages['t-shirt'];
};

export default app; 