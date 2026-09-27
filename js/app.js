/**
 * Canteen Connect - Main Application Logic
 * Order Smart. Eat Fresh. Skip the Queue.
 */

// Application State
const state = {
    cart: [], // items in cart: [{ id, quantity, note }]
    selectedCategory: "all",
    selectedDiet: "all", // "all", "veg", "nonveg"
    searchQuery: "",
    appliedCoupon: null,
    selectedSlot: "slot-now",
    currentOrder: null
};

// DOM Elements cache
let elements = {};

document.addEventListener("DOMContentLoaded", () => {
    initElements();
    renderCanteenStatus();
    renderCategories();
    renderPickupSlots();
    renderMenuItems();
    updateCartUI();
    setupEventListeners();
});

function initElements() {
    elements = {
        // Status bar
        counterStatusBadge: document.getElementById("counterStatusBadge"),
        canteenRushBadge: document.getElementById("canteenRushBadge"),
        canteenWaitBadge: document.getElementById("canteenWaitBadge"),
        queueCountBadge: document.getElementById("queueCountBadge"),

        // Menu & Filters
        categoriesContainer: document.getElementById("categoriesContainer"),
        menuGrid: document.getElementById("menuGrid"),
        menuEmptyState: document.getElementById("menuEmptyState"),
        menuItemsCount: document.getElementById("menuItemsCount"),
        searchInput: document.getElementById("searchInput"),
        clearSearchBtn: document.getElementById("clearSearchBtn"),
        dietFilterAll: document.getElementById("dietFilterAll"),
        dietFilterVeg: document.getElementById("dietFilterVeg"),
        dietFilterNonveg: document.getElementById("dietFilterNonveg"),

        // Cart Drawer
        cartDrawer: document.getElementById("cartDrawer"),
        cartOverlay: document.getElementById("cartOverlay"),
        cartOpenBtn: document.getElementById("cartOpenBtn"),
        cartCloseBtn: document.getElementById("cartCloseBtn"),
        cartBadge: document.getElementById("cartBadge"),
        cartItemsContainer: document.getElementById("cartItemsContainer"),
        cartEmptyState: document.getElementById("cartEmptyState"),
        cartFooter: document.getElementById("cartFooter"),
        cartSubtotal: document.getElementById("cartSubtotal"),
        cartDiscountRow: document.getElementById("cartDiscountRow"),
        cartDiscountAmount: document.getElementById("cartDiscountAmount"),
        cartTotal: document.getElementById("cartTotal"),
        couponInput: document.getElementById("couponInput"),
        applyCouponBtn: document.getElementById("applyCouponBtn"),
        couponMessage: document.getElementById("couponMessage"),
        checkoutBtn: document.getElementById("checkoutBtn"),
        pickupSlotsContainer: document.getElementById("pickupSlotsContainer"),
        orderNotesInput: document.getElementById("orderNotesInput"),

        // Order Modal
        orderModal: document.getElementById("orderModal"),
        orderModalCloseBtn: document.getElementById("orderModalCloseBtn"),
        orderModalDoneBtn: document.getElementById("orderModalDoneBtn"),
        tokenNumberDisplay: document.getElementById("tokenNumberDisplay"),
        tokenTimeDisplay: document.getElementById("tokenTimeDisplay"),
        tokenSlotDisplay: document.getElementById("tokenSlotDisplay"),
        tokenItemsSummary: document.getElementById("tokenItemsSummary"),
        tokenTotalDisplay: document.getElementById("tokenTotalDisplay"),
        orderStatusStep1: document.getElementById("orderStatusStep1"),
        orderStatusStep2: document.getElementById("orderStatusStep2"),
        orderStatusStep3: document.getElementById("orderStatusStep3"),
        orderStatusStep4: document.getElementById("orderStatusStep4"),
        orderProgressBar: document.getElementById("orderProgressBar"),
        simulateStatusBtn: document.getElementById("simulateStatusBtn"),
        statusDescription: document.getElementById("statusDescription"),

        // Toast container
        toastContainer: document.getElementById("toastContainer")
    };
}

// 1. Render Top Canteen Status Bar
function renderCanteenStatus() {
    if (elements.counterStatusBadge) {
        elements.counterStatusBadge.textContent = `${CANTEEN_CONFIG.counterStatus}`;
    }
    if (elements.canteenRushBadge) {
        elements.canteenRushBadge.textContent = `${CANTEEN_CONFIG.currentRush} Rush`;
    }
    if (elements.canteenWaitBadge) {
        elements.canteenWaitBadge.textContent = CANTEEN_CONFIG.currentWaitTime;
    }
    if (elements.queueCountBadge) {
        elements.queueCountBadge.textContent = `${CANTEEN_CONFIG.activeTokensInQueue} active orders`;
    }
}

// 2. Render Category Buttons
function renderCategories() {
    elements.categoriesContainer.innerHTML = "";
    MENU_CATEGORIES.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `category-btn px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
            state.selectedCategory === cat.id ? "active bg-orange-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-600"
        }`;
        btn.innerHTML = `<i class="${cat.icon}"></i> <span>${cat.name}</span>`;
        btn.addEventListener("click", () => {
            state.selectedCategory = cat.id;
            updateCategoryButtons();
            renderMenuItems();
        });
        elements.categoriesContainer.appendChild(btn);
    });
}

function updateCategoryButtons() {
    const buttons = elements.categoriesContainer.querySelectorAll(".category-btn");
    buttons.forEach((btn, index) => {
        const cat = MENU_CATEGORIES[index];
        if (cat.id === state.selectedCategory) {
            btn.className = "category-btn active px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 bg-orange-600 text-white shadow-md";
        } else {
            btn.className = "category-btn px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-600";
        }
    });
}

// 3. Render Pickup Time Slots in Cart
function renderPickupSlots() {
    if (!elements.pickupSlotsContainer) return;
    elements.pickupSlotsContainer.innerHTML = "";
    PICKUP_SLOTS.forEach(slot => {
        const isSelected = state.selectedSlot === slot.id;
        const div = document.createElement("div");
        div.className = `cursor-pointer p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
            isSelected ? "border-orange-500 bg-orange-50/70 font-semibold text-orange-900" : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
        }`;
        div.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fa-regular ${isSelected ? "fa-circle-dot text-orange-600" : "fa-circle text-gray-400"}"></i>
                <span>${slot.label}</span>
            </div>
            ${slot.recommended ? '<span class="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">FASTEST</span>' : ''}
        `;
        div.addEventListener("click", () => {
            state.selectedSlot = slot.id;
            renderPickupSlots();
        });
        elements.pickupSlotsContainer.appendChild(div);
    });
}

// 4. Filter & Render Menu Items
function getFilteredItems() {
    return MENU_ITEMS.filter(item => {
        // Category check
        const matchCategory = state.selectedCategory === "all" || item.category === state.selectedCategory;

        // Dietary check
        let matchDiet = true;
        if (state.selectedDiet === "veg") matchDiet = item.isVeg === true;
        if (state.selectedDiet === "nonveg") matchDiet = item.isVeg === false;

        // Search text query check
        let matchSearch = true;
        if (state.searchQuery.trim() !== "") {
            const query = state.searchQuery.toLowerCase();
            matchSearch = item.name.toLowerCase().includes(query) ||
                          item.description.toLowerCase().includes(query) ||
                          item.category.toLowerCase().includes(query);
        }

        return matchCategory && matchDiet && matchSearch;
    });
}

function renderMenuItems() {
    const items = getFilteredItems();
    elements.menuItemsCount.textContent = `${items.length} dishes available`;

    if (items.length === 0) {
        elements.menuGrid.classList.add("hidden");
        elements.menuEmptyState.classList.remove("hidden");
        return;
    }

    elements.menuGrid.classList.remove("hidden");
    elements.menuEmptyState.classList.add("hidden");
    elements.menuGrid.innerHTML = "";

    items.forEach(item => {
        const inCartItem = state.cart.find(c => c.id === item.id);
        const qty = inCartItem ? inCartItem.quantity : 0;

        const card = document.createElement("div");
        card.className = "food-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <!-- Image & Badges -->
                <div class="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy">
                    
                    <!-- Diet Badge -->
                    <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
                        <span class="${item.isVeg ? "food-mark-veg" : "food-mark-nonveg"}"></span>
                        <span class="text-[11px] font-bold ${item.isVeg ? "text-green-700" : "text-red-700"}">${item.isVeg ? "100% Veg" : "Non-Veg"}</span>
                    </div>

                    <!-- Bestseller / Rating Badge -->
                    <div class="absolute top-3 right-3 flex flex-col items-end gap-1">
                        ${item.isBestseller ? '<span class="bg-amber-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow"><i class="fa-solid fa-fire text-xs"></i> BESTSELLER</span>' : ''}
                        <span class="bg-gray-900/80 backdrop-blur-md text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <i class="fa-solid fa-star text-amber-400 text-[10px]"></i> ${item.rating}
                        </span>
                    </div>

                    <!-- Prep Time Pill -->
                    <div class="absolute bottom-3 left-3 bg-gray-900/85 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <i class="fa-regular fa-clock text-orange-400"></i> ${item.prepTime}
                    </div>
                </div>

                <!-- Info Section -->
                <div class="p-4">
                    <h3 class="font-bold text-gray-900 text-base leading-snug line-clamp-1 mb-1" title="${item.name}">${item.name}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">${item.description}</p>
                </div>
            </div>

            <!-- Price & Add Button Footer -->
            <div class="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                <div>
                    <span class="text-xs text-gray-400 block font-medium">Price</span>
                    <span class="text-lg font-black text-gray-900">₹${item.price}</span>
                </div>

                <div id="btn-container-${item.id}">
                    ${qty > 0 ? `
                        <div class="flex items-center gap-2 bg-orange-600 text-white px-2 py-1.5 rounded-xl shadow">
                            <button onclick="updateCartQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center hover:bg-orange-700 rounded-lg text-sm font-bold transition-all"><i class="fa-solid fa-minus text-xs"></i></button>
                            <span class="font-bold text-sm min-w-[16px] text-center">${qty}</span>
                            <button onclick="updateCartQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center hover:bg-orange-700 rounded-lg text-sm font-bold transition-all"><i class="fa-solid fa-plus text-xs"></i></button>
                        </div>
                    ` : `
                        <button onclick="addToCart('${item.id}')" class="bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-200 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95">
                            <i class="fa-solid fa-plus text-xs"></i> Add
                        </button>
                    `}
                </div>
            </div>
        `;
        elements.menuGrid.appendChild(card);
    });
}

// 5. Cart Logic
window.addToCart = function(itemId) {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const existing = state.cart.find(c => c.id === itemId);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ id: itemId, quantity: 1, note: "" });
    }

    showToast(`Added "${item.name}" to cart! 🍽️`, "success");
    updateCartUI();
    renderMenuItems();
};

window.updateCartQuantity = function(itemId, delta) {
    const index = state.cart.findIndex(c => c.id === itemId);
    if (index === -1) return;

    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
        const removedItem = MENU_ITEMS.find(i => i.id === itemId);
        state.cart.splice(index, 1);
        showToast(`Removed "${removedItem.name}" from cart`, "info");
    }

    updateCartUI();
    renderMenuItems();
};

window.removeFromCart = function(itemId) {
    const index = state.cart.findIndex(c => c.id === itemId);
    if (index !== -1) {
        state.cart.splice(index, 1);
        updateCartUI();
        renderMenuItems();
        showToast("Item removed from cart", "info");
    }
};

function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update Floating Cart Button Badge
    if (elements.cartBadge) {
        elements.cartBadge.textContent = totalCount;
        if (totalCount > 0) {
            elements.cartBadge.classList.remove("hidden");
        } else {
            elements.cartBadge.classList.add("hidden");
        }
    }

    // Toggle Empty State vs Items
    if (state.cart.length === 0) {
        elements.cartEmptyState.classList.remove("hidden");
        elements.cartItemsContainer.classList.add("hidden");
        elements.cartFooter.classList.add("hidden");
        state.appliedCoupon = null;
        if (elements.couponMessage) elements.couponMessage.textContent = "";
        return;
    }

    elements.cartEmptyState.classList.add("hidden");
    elements.cartItemsContainer.classList.remove("hidden");
    elements.cartFooter.classList.remove("hidden");

    // Render Cart Items
    elements.cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    state.cart.forEach(cartEntry => {
        const item = MENU_ITEMS.find(i => i.id === cartEntry.id);
        if (!item) return;

        const lineTotal = item.price * cartEntry.quantity;
        subtotal += lineTotal;

        const row = document.createElement("div");
        row.className = "flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100";
        row.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-lg object-cover flex-shrink-0">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 mb-1">
                    <span class="${item.isVeg ? "food-mark-veg" : "food-mark-nonveg"} scale-75"></span>
                    <h4 class="font-bold text-gray-900 text-sm truncate">${item.name}</h4>
                </div>
                <div class="text-xs text-gray-500 font-semibold mb-2">₹${item.price} each</div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-0.5 shadow-sm">
                        <button onclick="updateCartQuantity('${item.id}', -1)" class="text-gray-600 hover:text-orange-600 font-bold px-1 text-sm">-</button>
                        <span class="text-xs font-bold text-gray-800">${cartEntry.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', 1)" class="text-gray-600 hover:text-orange-600 font-bold px-1 text-sm">+</button>
                    </div>
                    <span class="text-sm font-extrabold text-gray-900">₹${lineTotal}</span>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 text-xs p-1" title="Remove">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        elements.cartItemsContainer.appendChild(row);
    });

    // Discount Calculation
    let discount = 0;
    if (state.appliedCoupon) {
        if (state.appliedCoupon.discountPercent) {
            discount = Math.round((subtotal * state.appliedCoupon.discountPercent) / 100);
        } else if (state.appliedCoupon.discountFlat) {
            discount = state.appliedCoupon.discountFlat;
        }
        elements.cartDiscountRow.classList.remove("hidden");
        elements.cartDiscountAmount.textContent = `- ₹${discount}`;
    } else {
        elements.cartDiscountRow.classList.add("hidden");
    }

    const total = Math.max(0, subtotal - discount);

    elements.cartSubtotal.textContent = `₹${subtotal}`;
    elements.cartTotal.textContent = `₹${total}`;
}

// 6. Coupon Application
function handleApplyCoupon() {
    const code = elements.couponInput.value.trim().toUpperCase();
    if (!code) {
        elements.couponMessage.textContent = "Please enter a valid coupon code.";
        elements.couponMessage.className = "text-xs text-red-500 mt-1 block";
        return;
    }

    const coupon = PROMO_CODES[code];
    if (!coupon) {
        elements.couponMessage.textContent = "Invalid promo code! Try STUDENT10 or CAMPUS50";
        elements.couponMessage.className = "text-xs text-red-500 mt-1 block";
        return;
    }

    const subtotal = state.cart.reduce((sum, item) => {
        const original = MENU_ITEMS.find(i => i.id === item.id);
        return sum + (original ? original.price * item.quantity : 0);
    }, 0);

    if (subtotal < coupon.minAmount) {
        elements.couponMessage.textContent = `Requires minimum order of ₹${coupon.minAmount} (Current: ₹${subtotal})`;
        elements.couponMessage.className = "text-xs text-amber-600 mt-1 block";
        return;
    }

    state.appliedCoupon = coupon;
    elements.couponMessage.textContent = `🎉 Coupon applied: ${coupon.label}!`;
    elements.couponMessage.className = "text-xs text-green-600 font-semibold mt-1 block";
    showToast(`Promo "${code}" applied successfully!`, "success");
    updateCartUI();
}

// 7. Cart Drawer Open / Close
function openCart() {
    elements.cartDrawer.classList.remove("translate-x-full");
    elements.cartOverlay.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
}

function closeCart() {
    elements.cartDrawer.classList.add("translate-x-full");
    elements.cartOverlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
}

// 8. Order Checkout & Token Generation
function handleCheckout() {
    if (state.cart.length === 0) {
        showToast("Your cart is empty!", "info");
        return;
    }

    // Generate simulated Token (e.g. #CC-42)
    const randomTokenNum = Math.floor(10 + Math.random() * 90);
    const tokenString = `#CC-${randomTokenNum}`;

    // Calculate maximum prep time among items in order
    let maxPrepMins = 8;
    state.cart.forEach(entry => {
        const item = MENU_ITEMS.find(i => i.id === entry.id);
        if (item) {
            const mins = parseInt(item.prepTime);
            if (mins && mins > maxPrepMins) maxPrepMins = mins;
        }
    });

    const now = new Date();
    const pickupTime = new Date(now.getTime() + maxPrepMins * 60000);
    const timeFormatted = pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Find Slot name
    const slotObj = PICKUP_SLOTS.find(s => s.id === state.selectedSlot) || PICKUP_SLOTS[0];

    // Build Order Object
    state.currentOrder = {
        token: tokenString,
        placedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedTime: timeFormatted,
        slotName: slotObj.label,
        items: [...state.cart],
        statusIndex: 0 // 0: Placed, 1: In Kitchen, 2: Ready for Pickup, 3: Completed
    };

    // Populate Modal
    elements.tokenNumberDisplay.textContent = state.currentOrder.token;
    elements.tokenTimeDisplay.textContent = `${maxPrepMins} Mins (~${state.currentOrder.estimatedTime})`;
    elements.tokenSlotDisplay.textContent = state.currentOrder.slotName;
    elements.tokenTotalDisplay.textContent = elements.cartTotal.textContent;

    // Items list in modal
    elements.tokenItemsSummary.innerHTML = "";
    state.currentOrder.items.forEach(entry => {
        const item = MENU_ITEMS.find(i => i.id === entry.id);
        if (!item) return;
        const li = document.createElement("div");
        li.className = "flex justify-between items-center text-xs py-1 text-gray-700 border-b border-gray-100 last:border-0";
        li.innerHTML = `
            <span>${cartEntrySummary(item, entry.quantity)}</span>
            <span class="font-bold">₹${item.price * entry.quantity}</span>
        `;
        elements.tokenItemsSummary.appendChild(li);
    });

    // Close Cart & Open Order Modal
    closeCart();
    updateOrderStatusVisuals();
    elements.orderModal.classList.remove("hidden");

    // Clear cart
    state.cart = [];
    state.appliedCoupon = null;
    elements.couponInput.value = "";
    if (elements.couponMessage) elements.couponMessage.textContent = "";
    updateCartUI();
    renderMenuItems();

    showToast("🎉 Order placed successfully! Token generated.", "success");
}

function cartEntrySummary(item, qty) {
    return `${qty}x ${item.name}`;
}

// 9. Live Order Status Updates & Kitchen Sync
const ORDER_STAGES = [
    { title: "Order Confirmed", desc: "Sent to canteen kitchen terminal. Token generated." },
    { title: "In Preparation", desc: "Chef is preparing your fresh order now." },
    { title: "Ready for Pickup!", desc: "Please proceed to Counter #2 with Token " },
    { title: "Order Completed", desc: "Order collected. Enjoy your fresh meal!" }
];

function advanceOrderStatus() {
    if (!state.currentOrder) return;

    if (state.currentOrder.statusIndex < 3) {
        state.currentOrder.statusIndex += 1;
        updateOrderStatusVisuals();
        
        const stage = ORDER_STAGES[state.currentOrder.statusIndex];
        showToast(`Kitchen Update: ${stage.title}!`, "info");
    } else {
        showToast("Order is already collected and completed!", "info");
    }
}

function updateOrderStatusVisuals() {
    if (!state.currentOrder) return;
    const idx = state.currentOrder.statusIndex;

    const steps = [
        elements.orderStatusStep1,
        elements.orderStatusStep2,
        elements.orderStatusStep3,
        elements.orderStatusStep4
    ];

    steps.forEach((step, i) => {
        if (!step) return;
        const iconCircle = step.querySelector(".step-circle");
        const stepText = step.querySelector(".step-title");

        if (i <= idx) {
            iconCircle.className = "step-circle w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-md";
            stepText.className = "step-title text-xs font-bold text-orange-600";
        } else {
            iconCircle.className = "step-circle w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs";
            stepText.className = "step-title text-xs font-medium text-gray-400";
        }
    });

    // Progress bar width percentage
    const progressPercentages = ["5%", "35%", "70%", "100%"];
    if (elements.orderProgressBar) {
        elements.orderProgressBar.style.width = progressPercentages[idx];
    }

    if (elements.statusDescription) {
        const stage = ORDER_STAGES[idx];
        elements.statusDescription.textContent = idx === 2 
            ? `${stage.desc} ${state.currentOrder.token}`
            : stage.desc;
    }
}

// 10. Event Listeners Setup
function setupEventListeners() {
    // Search input
    elements.searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        if (state.searchQuery) {
            elements.clearSearchBtn.classList.remove("hidden");
        } else {
            elements.clearSearchBtn.classList.add("hidden");
        }
        renderMenuItems();
    });

    elements.clearSearchBtn.addEventListener("click", () => {
        elements.searchInput.value = "";
        state.searchQuery = "";
        elements.clearSearchBtn.classList.add("hidden");
        renderMenuItems();
    });

    // Diet filter buttons
    elements.dietFilterAll.addEventListener("click", () => setDietFilter("all"));
    elements.dietFilterVeg.addEventListener("click", () => setDietFilter("veg"));
    elements.dietFilterNonveg.addEventListener("click", () => setDietFilter("nonveg"));

    // Cart Drawer buttons
    elements.cartOpenBtn.addEventListener("click", openCart);
    elements.cartCloseBtn.addEventListener("click", closeCart);
    elements.cartOverlay.addEventListener("click", closeCart);

    // Coupon
    elements.applyCouponBtn.addEventListener("click", handleApplyCoupon);

    // Checkout
    elements.checkoutBtn.addEventListener("click", handleCheckout);

    // Order Modal
    elements.orderModalCloseBtn.addEventListener("click", () => {
        elements.orderModal.classList.add("hidden");
    });
    elements.orderModalDoneBtn.addEventListener("click", () => {
        elements.orderModal.classList.add("hidden");
    });
    elements.simulateStatusBtn.addEventListener("click", advanceOrderStatus);
}

function setDietFilter(type) {
    state.selectedDiet = type;
    const filterButtons = [
        { el: elements.dietFilterAll, type: "all" },
        { el: elements.dietFilterVeg, type: "veg" },
        { el: elements.dietFilterNonveg, type: "nonveg" }
    ];

    filterButtons.forEach(fb => {
        if (fb.type === type) {
            fb.el.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-900 text-white shadow-sm transition-all";
        } else {
            fb.el.className = "px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all";
        }
    });

    renderMenuItems();
}

// 11. Toast Notifications
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast-msg flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-xl border ${
        type === "success" 
            ? "bg-emerald-950 text-white border-emerald-700" 
            : "bg-gray-900 text-white border-gray-800"
    }`;

    const icon = type === "success" 
        ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>' 
        : '<i class="fa-solid fa-circle-info text-orange-400"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px) scale(0.95)";
        toast.style.transition = "all 0.25s ease-out";
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}
