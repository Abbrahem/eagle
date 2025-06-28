// Cart utility functions with Firebase integration
import { addOrder } from '../firebase';

export const addToCart = (product, selectedColor = '', selectedSize = '', quantity = 1) => {
  try {
    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Create cart item
    const cartItem = {
      id: Date.now(), // Simple ID generation
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      category: product.category,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    };
    
    // Check if item with same product, color, and size already exists
    const existingItemIndex = existingCart.findIndex(item => 
      item.productId === product.id && 
      item.color === selectedColor && 
      item.size === selectedSize
    );
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    
    return {
      success: true,
      message: 'تم إضافة المنتج إلى السلة بنجاح!',
      cartCount: existingCart.reduce((total, item) => total + item.quantity, 0)
    };
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة المنتج إلى السلة'
    };
  }
};

export const removeFromCart = (itemId) => {
  try {
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = existingCart.filter(item => item.id !== itemId);
    
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    return {
      success: true,
      message: 'تم حذف المنتج من السلة',
      cartCount: updatedCart.reduce((total, item) => total + item.quantity, 0)
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء حذف المنتج'
    };
  }
};

export const updateCartItemQuantity = (itemId, newQuantity) => {
  try {
    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }
    
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = existingCart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    return {
      success: true,
      message: 'تم تحديث كمية المنتج',
      cartCount: updatedCart.reduce((total, item) => total + item.quantity, 0)
    };
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث الكمية'
    };
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem('cartItems');
    window.dispatchEvent(new Event('cartUpdated'));
    
    return {
      success: true,
      message: 'تم إفراغ السلة بنجاح'
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إفراغ السلة'
    };
  }
};

export const getCartItems = () => {
  try {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

export const getCartCount = () => {
  try {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
};

export const getCartTotal = () => {
  try {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
};

// إنشاء طلب جديد وحفظه في Firebase
export const createOrder = async (customerData, paymentMethod = 'كاش عند الاستلام') => {
  try {
    const cartItems = getCartItems();
    
    if (cartItems.length === 0) {
      return {
        success: false,
        message: 'السلة فارغة'
      };
    }

    const subtotal = getCartTotal();
    const shippingCost = subtotal >= 500 ? 0 : 30; // شحن مجاني للطلبات أكثر من 500 جنيه
    const total = subtotal + shippingCost;

    const orderData = {
      customer: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address
      },
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image
      })),
      subtotal: subtotal,
      shippingCost: shippingCost,
      total: total,
      status: 'pending',
      paymentMethod: paymentMethod
    };

    const result = await addOrder(orderData);
    
    if (result.success) {
      // إفراغ السلة بعد إنشاء الطلب بنجاح
      clearCart();
      
      return {
        success: true,
        message: 'تم إنشاء الطلب بنجاح!',
        orderId: result.id
      };
    } else {
      return {
        success: false,
        message: 'فشل في إنشاء الطلب: ' + result.error
      };
    }

  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إنشاء الطلب'
    };
  }
}; 