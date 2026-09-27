/**
 * Canteen Connect - Menu Data & Configuration
 * Tagline: Order Smart. Eat Fresh. Skip the Queue.
 */

const CANTEEN_CONFIG = {
    canteenName: "Canteen Connect",
    tagline: "Order Smart. Eat Fresh. Skip the Queue.",
    institution: "I E M Kolkata Canteen",
    counterStatus: "Open",
    currentRush: "Moderate",
    currentWaitTime: "10-12 mins",
    activeTokensInQueue: 14,
    openingHours: "8:00 AM - 7:30 PM",
    currencySymbol: "₹"
};

const MENU_CATEGORIES = [
    { id: "all", name: "All Items", icon: "fa-solid fa-border-all" },
    { id: "breakfast", name: "Breakfast", icon: "fa-solid fa-mug-saucer" },
    { id: "lunch", name: "Lunch & Thali", icon: "fa-solid fa-bowl-rice" },
    { id: "snacks", name: "Snacks & Chaat", icon: "fa-solid fa-burger" },
    { id: "beverages", name: "Drinks & Shakes", icon: "fa-solid fa-glass-water" },
    { id: "desserts", name: "Desserts", icon: "fa-solid fa-ice-cream" }
];

const MENU_ITEMS = [
    {
        id: "item-1",
        name: "Crispy Masala Dosa",
        category: "breakfast",
        price: 70,
        prepTime: "8 mins",
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        reviewsCount: 142,
        description: "Crispy dosa stuffed with aloo masala, served with hot sambar and coconut chutney.",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-2",
        name: "Paneer Butter Masala Combo",
        category: "lunch",
        price: 130,
        prepTime: "12 mins",
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        reviewsCount: 230,
        description: "Paneer butter masala served with 2 butter naans and jeera rice.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-3",
        name: "Crispy Veg Cheese Burger",
        category: "snacks",
        price: 85,
        prepTime: "7 mins",
        isVeg: true,
        isBestseller: false,
        rating: 4.5,
        reviewsCount: 98,
        description: "Veg patty with cheese slice, fresh lettuce, and burger sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-4",
        name: "Hyderabadi Chicken Biryani",
        category: "lunch",
        price: 160,
        prepTime: "10 mins",
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        reviewsCount: 312,
        description: "Basmati rice cooked with spiced chicken, served with raita.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-5",
        name: "Steamed Veg Momos (6 Pcs)",
        category: "snacks",
        price: 65,
        prepTime: "9 mins",
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        reviewsCount: 88,
        description: "Steamed vegetable dumplings served with spicy red chili chutney.",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-6",
        name: "Adrak Masala Chai & Samosa (2)",
        category: "snacks",
        price: 45,
        prepTime: "5 mins",
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        reviewsCount: 410,
        description: "Hot ginger tea served with 2 crispy potato samosas and chutney.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-7",
        name: "Chilled Cold Coffee with Ice Cream",
        category: "beverages",
        price: 60,
        prepTime: "4 mins",
        isVeg: true,
        isBestseller: true,
        rating: 4.7,
        reviewsCount: 167,
        description: "Thick cold coffee topped with a scoop of vanilla ice cream.",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-8",
        name: "Chipotle Chicken Roll Wrap",
        category: "snacks",
        price: 110,
        prepTime: "10 mins",
        isVeg: false,
        isBestseller: false,
        rating: 4.7,
        reviewsCount: 115,
        description: "Grilled chicken chunks and sliced onions wrapped in toasted flatbread.",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-9",
        name: "Idli Vada Combo Plate",
        category: "breakfast",
        price: 55,
        prepTime: "5 mins",
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        reviewsCount: 120,
        description: "2 soft idlis and 1 crispy medu vada served with sambar and chutney.",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-10",
        name: "Fresh Alphonso Mango Lassi",
        category: "beverages",
        price: 65,
        prepTime: "5 mins",
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        reviewsCount: 74,
        description: "Sweet mango yogurt lassi served chilled.",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-11",
        name: "Sizzling Chocolate Fudge Brownie",
        category: "desserts",
        price: 75,
        prepTime: "4 mins",
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        reviewsCount: 195,
        description: "Warm chocolate brownie drizzled with hot chocolate fudge.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "item-12",
        name: "Campus Deluxe Special Thali",
        category: "lunch",
        price: 150,
        prepTime: "12 mins",
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        reviewsCount: 280,
        description: "Paneer sabzi, dal makhani, 3 rotis, jeera rice, salad and gulab jamun.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
    }
];

const PROMO_CODES = {
    "STUDENT10": { discountPercent: 10, minAmount: 100, label: "10% Student Discount" },
    "FRESH20": { discountFlat: 20, minAmount: 150, label: "Flat ₹20 Off on Fresh Orders" },
    "CAMPUS50": { discountFlat: 50, minAmount: 300, label: "Group Feast Savings (₹50 Off)" }
};

const PICKUP_SLOTS = [
    { id: "slot-now", label: "Immediate (Next 10-15 Mins)", recommended: true },
    { id: "slot-1130", label: "Morning Recess (11:30 AM)", recommended: false },
    { id: "slot-1315", label: "Lunch Break (1:15 PM)", recommended: false },
    { id: "slot-1600", label: "Evening Snack Break (4:00 PM)", recommended: false }
];
