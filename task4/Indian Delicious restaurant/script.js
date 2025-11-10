// Menu Data with local PNG images
const menuItems = [
    {
        id: 1,
        name: "Butter Chicken",
        description: "Tender chicken in a rich, creamy tomato and butter sauce.",
        price: 320,
        image: "butter-chicken.png",
        category: "main"
    },
    {
        id: 2,
        name: "Chicken Biryani",
        description: "Fragrant basmati rice cooked with tender chicken and aromatic spices.",
        price: 280,
        image: "chicken-biryani.png",
        category: "main"
    },
    {
        id: 3,
        name: "Paneer Tikka Masala",
        description: "Grilled cottage cheese cubes in a spiced tomato and cream sauce.",
        price: 270,
        image: "paneer-tikka.png",
        category: "main"
    },
    {
        id: 4,
        name: "Palak Paneer",
        description: "Fresh spinach cooked with cottage cheese and mild spices.",
        price: 250,
        image: "palak-paneer.png",
        category: "main"
    },
    {
        id: 5,
        name: "Chana Masala",
        description: "Chickpeas cooked in a tangy and spicy tomato-based gravy.",
        price: 220,
        image: "chana-masala.png",
        category: "main"
    },
    {
        id: 6,
        name: "Garlic Naan",
        description: "Soft leavened bread topped with garlic and butter.",
        price: 60,
        image: "garlic-naan.png",
        category: "bread"
    },
    {
        id: 7,
        name: "Samosa",
        description: "Crispy pastry filled with spiced potatoes and peas.",
        price: 80,
        image: "samosa.png",
        category: "appetizer"
    },
    {
        id: 8,
        name: "Tandoori Chicken",
        description: "Chicken marinated in yogurt and spices, cooked in a clay oven.",
        price: 340,
        image: "tandoori-chicken.png",
        category: "main"
    },
    {
        id: 9,
        name: "Mango Lassi",
        description: "Refreshing yogurt drink with sweet mango pulp.",
        price: 120,
        image: "mango-lassi.png",
        category: "beverage"
    },
    {
        id: 10,
        name: "Gulab Jamun",
        description: "Soft milk-solid balls soaked in rose-flavored sugar syrup.",
        price: 100,
        image: "gulab-jamun.png",
        category: "dessert"
    },
    {
        id: 11,
        name: "Rogan Josh",
        description: "Aromatic lamb curry from Kashmir with rich gravy and spices.",
        price: 380,
        image: "rogan-josh.png",
        category: "main"
    },
    {
        id: 12,
        name: "Masala Dosa",
        description: "Crispy rice crepe filled with spiced potato filling, served with sambar.",
        price: 180,
        image: "masala-dosa.png",
        category: "main"
    }
];

// Cart Data
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Payment-related variables
let selectedPaymentMethod = '';
let selectedWallet = '';

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const notification = document.getElementById('notification');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Payment DOM elements
const paymentSection = document.getElementById('paymentSection');
const paymentTotal = document.getElementById('paymentTotal');
const paymentMethods = document.querySelectorAll('.payment-method');
const paymentDetails = document.querySelectorAll('.payment-details');
const backToCartBtns = document.querySelectorAll('.payment-btn.back');
const payButtons = document.querySelectorAll('.payment-btn:not(.back)');
const walletOptions = document.querySelectorAll('.wallet-option');
const paymentSuccess = document.getElementById('paymentSuccess');
const continueShoppingBtn = document.getElementById('continueShopping');
const orderIdEl = document.getElementById('orderId');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    updateCartCount();
    
    // Event listeners
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    overlay.addEventListener('click', closeCartModal);
    checkoutBtn.addEventListener('click', checkout);
    
    // Mobile navigation
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Form submission
    document.getElementById('reservationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your reservation! We will contact you shortly to confirm.');
        this.reset();
    });
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove selected class from all methods
            paymentMethods.forEach(m => m.classList.remove('selected'));
            
            // Add selected class to clicked method
            this.classList.add('selected');
            
            // Get the payment method
            selectedPaymentMethod = this.dataset.method;
            
            // Hide all payment details
            paymentDetails.forEach(detail => detail.classList.remove('active'));
            
            // Show selected payment details
            document.getElementById(`${selectedPaymentMethod}Details`).classList.add('active');
        });
    });
    
    // Wallet selection
    walletOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all wallet options
            walletOptions.forEach(o => o.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Get the selected wallet
            selectedWallet = this.dataset.wallet;
        });
    });
    
    // Back to cart buttons
    backToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            paymentSection.style.display = 'none';
            openCart();
        });
    });
    
    // Pay buttons
    payButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate payment details based on method
            if (validatePayment()) {
                processPayment();
            }
        });
    });
    
    // Continue shopping after payment
    continueShoppingBtn.addEventListener('click', function() {
        paymentSuccess.classList.remove('active');
        paymentSection.style.display = 'none';
        
        // Reset payment UI
        paymentMethods.forEach(m => m.classList.remove('selected'));
        paymentDetails.forEach(d => d.classList.remove('active'));
        
        // Clear cart
        cart = [];
        updateCartCount();
    });
});

// Render menu items
function renderMenu() {
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-card';
        menuCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-card-content">
                <div class="menu-card-title">
                    <h3>${item.name}</h3>
                    <span class="price rupee-symbol">₹${item.price}</span>
                </div>
                <p>${item.description}</p>
                <div class="menu-card-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity" id="quantity-${item.id}">1</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="btn add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        menuGrid.appendChild(menuCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
}

// Increase quantity
function increaseQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    const quantityEl = document.getElementById(`quantity-${id}`);
    let quantity = parseInt(quantityEl.textContent);
    quantityEl.textContent = quantity + 1;
}

// Decrease quantity
function decreaseQuantity(e) {
    const id = parseInt(e.target.dataset.id);
    const quantityEl = document.getElementById(`quantity-${id}`);
    let quantity = parseInt(quantityEl.textContent);
    if (quantity > 1) {
        quantityEl.textContent = quantity - 1;
    }
}

// Add item to cart
function addToCart(e) {
    const id = parseInt(e.target.dataset.id);
    const quantityEl = document.getElementById(`quantity-${id}`);
    const quantity = parseInt(quantityEl.textContent);
    
    const menuItem = menuItems.find(item => item.id === id);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...menuItem,
            quantity: quantity
        });
    }
    
    // Reset quantity
    quantityEl.textContent = 1;
    
    // Update cart
    updateCartCount();
    showNotification();
}

// Update cart count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
    
    // Update cart total
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `₹${cartTotal}`;
    
    // Render cart items if cart is open
    if (cartModal.classList.contains('active')) {
        renderCartItems();
    }
}

// Show notification
function showNotification() {
    notification.classList.add('active');
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Open cart
function openCart() {
    cartModal.classList.add('active');
    overlay.classList.add('active');
    renderCartItems();
}

// Close cart
function closeCartModal() {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
}

// Render cart items
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price rupee-symbol">₹${item.price} x ${item.quantity}</div>
            </div>
            <div class="cart-item-quantity">
                <span class="rupee-symbol">₹${(item.price * item.quantity)}</span>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

// Remove item from cart
function removeFromCart(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show payment section and hide cart
    closeCartModal();
    paymentSection.style.display = 'block';
    paymentTotal.textContent = `₹${cartTotal}`;
    
    // Scroll to payment section
    paymentSection.scrollIntoView({ behavior: 'smooth' });
}

// Validate payment details
function validatePayment() {
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return false;
    }
    
    switch (selectedPaymentMethod) {
        case 'upi':
            const upiId = document.getElementById('upiId').value;
            if (!upiId || !upiId.includes('@')) {
                alert('Please enter a valid UPI ID');
                return false;
            }
            break;
            
        case 'card':
            const cardNumber = document.getElementById('cardNumber').value;
            const cardName = document.getElementById('cardName').value;
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCvv = document.getElementById('cardCvv').value;
            
            if (!cardNumber || cardNumber.length < 16) {
                alert('Please enter a valid card number');
                return false;
            }
            
            if (!cardName) {
                alert('Please enter cardholder name');
                return false;
            }
            
            if (!cardExpiry || !cardExpiry.includes('/')) {
                alert('Please enter a valid expiry date (MM/YY)');
                return false;
            }
            
            if (!cardCvv || cardCvv.length !== 3) {
                alert('Please enter a valid CVV');
                return false;
            }
            break;
            
        case 'netbanking':
            const bankSelect = document.getElementById('bankSelect').value;
            if (!bankSelect) {
                alert('Please select your bank');
                return false;
            }
            break;
            
        case 'wallet':
            if (!selectedWallet) {
                alert('Please select a wallet');
                return false;
            }
            break;
    }
    
    return true;
}

// Process payment
function processPayment() {
    // In a real application, this would connect to a payment gateway
    // For demo purposes, we'll simulate a payment process
    
    // Show loading state
    const currentPaymentBtn = document.querySelector(`#${selectedPaymentMethod}Details .payment-btn:not(.back)`);
    const originalText = currentPaymentBtn.textContent;
    currentPaymentBtn.textContent = 'Processing...';
    currentPaymentBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Hide current payment details
        document.getElementById(`${selectedPaymentMethod}Details`).classList.remove('active');
        
        // Show success message
        paymentSuccess.classList.add('active');
        
        // Generate random order ID
        const orderId = Math.floor(1000 + Math.random() * 9000);
        orderIdEl.textContent = orderId;
        
        // Reset payment button
        currentPaymentBtn.textContent = originalText;
        currentPaymentBtn.disabled = false;
    }, 2000);
}