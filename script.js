
const menuData = [
    // 🍵 MATCHA MENU (From Morikawa)
    { 
        id: 1, 
        name: "Matcha Strawberry", 
        desc: "มัทฉะสตรอว์เบอร์รี (From Morikawa)", 
        price: 105, 
        category: "matcha", 
        note: "Signature",
        img: "https://i.postimg.cc/DyBmK971/Matcha-Strawberry.jpg" 
    },
    { 
        id: 2, 
        name: "Pure matcha", 
        desc: "เพียวมัทฉะ (From Morikawa)", 
        price: 85, 
        category: "matcha",
        img: "https://i.postimg.cc/nc0Mtynd/Purematcha.jpg" 
    },
    { 
        id: 3, 
        name: "Matcha Latte", 
        desc: "มัทฉะลาเต้ (From Morikawa)", 
        price: 95, 
        category: "matcha", 
        note: "Best Seller",
        img: "https://i.postimg.cc/dtqDpsc6/Matcha-Latte.jpg" 
    },

    // 🥛 MILK / TEA MENU
    { 
        id: 4, 
        name: "Thai tea", 
        desc: "ชาไทย", 
        price: 45, 
        category: "tea",
        img: "https://i.postimg.cc/TYChXzT4/Thaitea.jpg" 
    },
    { 
        id: 5, 
        name: "Green tea", 
        desc: "ชาเขียว", 
        price: 45, 
        category: "tea",
        img: "https://i.postimg.cc/jdsCmxYh/Greentea.jpg" 
    },
    { 
        id: 6, 
        name: "Fresh milk", 
        desc: "นมสด", 
        price: 40, 
        category: "tea",
        img: "https://i.postimg.cc/4NJnqfR6/Freshmilk.jpg" 
    },
    { 
        id: 7, 
        name: "Strawberry milk", 
        desc: "นมสดสตรอว์เบอร์รี", 
        price: 45, 
        category: "tea",
        img: "https://i.postimg.cc/8PtsV2T4/Strawberrymilk.jpg" 
    },
    { 
        id: 8, 
        name: "Pink milk", 
        desc: "นมชมพู", 
        price: 45, 
        category: "tea",
        img: "https://i.postimg.cc/NfpLw3Qk/Pinkmilk.jpg" 
    },
    { 
        id: 9, 
        name: "Cocoa", 
        desc: "โกโก้", 
        price: 50, 
        category: "tea",
        img: "https://i.postimg.cc/28z3MkNn/Cocoa.jpg" 
    },
    { 
        id: 10, 
        name: "Fresh milk nutella", 
        desc: "นมสดนูเทลล่า", 
        price: 60, 
        category: "tea",
        img: "https://i.postimg.cc/Wb2tCNc6/Freshmilknutella.jpg" 
    },
    { 
        id: 11, 
        name: "Milk nutella", 
        desc: "นมนูเทลล่า", 
        price: 60, 
        category: "tea",
        img: "https://i.postimg.cc/Pr2NkgdW/Milknutella.jpg" 
    },
    { 
        id: 12, 
        name: "Cocoa strawberry", 
        desc: "โกโก้สตรอว์เบอร์รี", 
        price: 55, 
        category: "tea",
        img: "https://i.postimg.cc/Dy2mHv3P/Cocoastrawberry.jpg" 
    }
];

let cart = [];
let currentEditingProduct = null;
let activeCategory = "all";

// รูปภาพสำรองกรณีที่ยังไม่ได้ใส่ URL รูปภาพ
const defaultPlaceholder = "https://placehold.co/600x400/e2e8f0/64748b?text=BE+YOU+TEA";

// DOM Elements
const menuGrid = document.getElementById("menuGrid");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");

document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    setupModals();
    setupSearch();
});

// 1. เรนเดอร์เมนู
function renderMenu() {
    menuGrid.innerHTML = "";
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
    
    const filtered = menuData.filter(item => {
        const matchCategory = activeCategory === "all" || item.category === activeCategory;
        const matchSearch = item.name.toLowerCase().includes(searchTerm) || item.desc.toLowerCase().includes(searchTerm);
        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        menuGrid.innerHTML = `<div class="text-center text-muted" style="grid-column: 1/-1; padding: 3rem 0;">ไม่พบเมนูที่ค้นหา</div>`;
        return;
    }
    
    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "menu-card";
        card.onclick = (e) => {
            if(!e.target.closest('.add-btn')) openCustomization(item.id);
        };
        
        const imgSrc = item.img && item.img.trim() !== "" ? item.img : defaultPlaceholder;

        card.innerHTML = `
            <img src="${imgSrc}" alt="${item.name}" class="card-img">
            <div class="card-body">
                <div>
                    <div class="card-header">
                        <h4>${item.name}</h4>
                        ${item.note ? `<span class="badge">${item.note}</span>` : ''}
                    </div>
                    <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 10px;">${item.desc}</p>
                </div>
                <div class="card-footer">
                    <div class="price">${item.price} ฿</div>
                    <button class="add-btn" onclick="openCustomization(${item.id})">สั่งเครื่องดื่ม</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// ระบบ Filter
filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        filterBtns.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        activeCategory = e.target.dataset.filter;
        renderMenu();
    });
});

// ระบบ Search
function setupSearch() {
    if(searchInput) {
        searchInput.addEventListener("input", () => {
            renderMenu();
        });
    }
}

// 2. ระบบ Modal ปรับแต่ง (Customization)
const customizeModal = document.getElementById("customizeModal");
const customizeContent = document.getElementById("customizeContent");

function openCustomization(id) {
    const product = menuData.find(p => p.id === id);
    currentEditingProduct = { ...product, sweetness: "ปกติ 100%", quantity: 1 };
    
    const imgSrc = product.img && product.img.trim() !== "" ? product.img : defaultPlaceholder;

    customizeContent.innerHTML = `
        <div class="custom-header text-center">
            <img src="${imgSrc}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="text-muted">${product.price} ฿</p>
        </div>
        
        <div class="mt-4">
            <div class="option-title">ระดับความหวาน</div>
            <div class="radio-group" id="sweetnessOpts">
                <div class="radio-btn" data-level="หวานน้อย 50%">50%</div>
                <div class="radio-btn active" data-level="ปกติ 100%">100%</div>
                <div class="radio-btn" data-level="หวานมาก 125%">125%</div>
            </div>
        </div>

        <button class="btn-dark w-100 mt-3" onclick="addToCartFromModal()">
            เพิ่มลงตะกร้า ${product.price} ฿
        </button>
    `;
    
    customizeModal.classList.add("active");

    const radioBtns = customizeContent.querySelectorAll(".radio-btn");
    radioBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            radioBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentEditingProduct.sweetness = e.target.dataset.level;
        });
    });
}

function addToCartFromModal() {
    const existing = cart.find(item => item.id === currentEditingProduct.id && item.sweetness === currentEditingProduct.sweetness);
    if(existing) {
        existing.quantity += 1;
    } else {
        cart.push(currentEditingProduct);
    }
    customizeModal.classList.remove("active");
    updateCartUI();
    openCartSidebar();
}

// 3. ระบบตะกร้าสินค้า
const cartSidebar = document.getElementById("cartSidebar");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItems = document.getElementById("cartItems");
const checkoutBtn = document.getElementById("checkoutBtn");

function updateCartUI() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    if(cart.length === 0) {
        cartItems.innerHTML = `<div class="text-center text-muted mt-4"><p>ไม่มีสินค้าในตะกร้า</p></div>`;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;

            const imgSrc = item.img && item.img.trim() !== "" ? item.img : defaultPlaceholder;

            cartItems.innerHTML += `
                <div class="cart-item">
                    <img src="${imgSrc}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>ความหวาน: ${item.sweetness} | ${item.price} ฿</p>
                        <div class="qty-control">
                            <button class="qty-btn" onclick="changeQty(${index}, -1)"><i class="fa-solid fa-minus" style="font-size:0.7rem"></i></button>
                            <span style="font-size:0.9rem; font-weight:600;">${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQty(${index}, 1)"><i class="fa-solid fa-plus" style="font-size:0.7rem"></i></button>
                        </div>
                    </div>
                    <div style="font-weight: 600; color: var(--primary);">${itemTotal} ฿</div>
                </div>
            `;
        });
    }

    document.getElementById("cartTotal").innerText = `${total} ฿`;
    document.getElementById("cartBadge").innerText = count;
    document.getElementById("paymentTotal").innerText = `${total} ฿`;
}

function changeQty(index, change) {
    cart[index].quantity += change;
    if(cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
}

function openCartSidebar() { cartSidebar.classList.add("open"); cartBackdrop.style.display = "block"; }
function closeCartSidebar() { cartSidebar.classList.remove("open"); cartBackdrop.style.display = "none"; }

// 4. Setup Events & Modals
function setupModals() {
    document.getElementById("cartTrigger").addEventListener("click", openCartSidebar);
    document.getElementById("closeCartBtn").addEventListener("click", closeCartSidebar);
    cartBackdrop.addEventListener("click", closeCartSidebar);
    
    document.querySelector(".close-modal").addEventListener("click", () => customizeModal.classList.remove("active"));
    customizeModal.addEventListener("click", (e) => { if(e.target === customizeModal) customizeModal.classList.remove("active"); });

    checkoutBtn.addEventListener("click", () => {
        closeCartSidebar();
        document.getElementById("paymentModal").classList.add("active");
    });

    document.getElementById("confirmPaymentBtn").addEventListener("click", () => {
        document.getElementById("paymentModal").classList.remove("active");
        fireBlueConfetti();
        setTimeout(() => {
            document.getElementById("trackingModal").classList.add("active");
            cart = [];
            updateCartUI();
        }, 600);
    });
}

// 5. Confetti โทนสีน้ำเงิน ขาว ทอง
function fireBlueConfetti() {
    if(typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#0A3D91', '#1E50A2', '#FFFFFF', '#FFD700'],
            zIndex: 9999
        });
    }
}