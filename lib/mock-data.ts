import type { categories, products, orders } from "@/db/schema";

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;

export interface CartItem {
  id: number;
  name: string;
  categoryName: string;
  quantity: number;
  price: number;
  originalPrice?: number;
}

export interface OrderHistoryItem {
  id: number;
  order: Order;
  totalAmount: number;
  itemCount: number;
  itemImages: string[];
}

export type TimeRange = "daily" | "weekly" | "monthly" | "all-time";

export interface RevenueBreakdownItem {
  name: string;
  amount: number;
}

export interface CategoryBreakdownItem {
  name: string;
  value: number;
}

export interface AnalyticsMetric {
  revenue: string;
  productsSold: number;
  customers: number;
  topProduct: { name: string; salesCount: number };
  lowestProduct: { name: string; salesCount: number };
  incomeBreakdown: RevenueBreakdownItem[];
  categoryBreakdown: CategoryBreakdownItem[];
}

const OWNER = "dwyanesido";

export const mockCategories: Category[] = [
  { id: 1, createdBy: OWNER, name: "Breakfast", icon: "CookingPot" },
  { id: 2, createdBy: OWNER, name: "Lunch", icon: "Utensils" },
  { id: 3, createdBy: OWNER, name: "Dinner", icon: "Soup" },
  { id: 4, createdBy: OWNER, name: "Appetizer", icon: "Cookie" },
  { id: 5, createdBy: OWNER, name: "Drinks", icon: "CupSoda" },
];

export const mockProducts: Product[] = [
  { id: 1, categoryId: 1, name: "Tapsilog", description: "Beef tapa with garlic rice and a fried egg.", price: "145.00", stock: 24, discount: null, availability: true, imageUrl: null },
  { id: 2, categoryId: 1, name: "Pancake Stack", description: "Three fluffy pancakes with maple syrup.", price: "120.00", stock: 18, discount: "10.00", availability: true, imageUrl: null },
  { id: 3, categoryId: 2, name: "Chicken Katsu Bento", description: "Crispy chicken cutlet, rice, and pickled veggies.", price: "185.00", stock: 4, discount: null, availability: true, imageUrl: null },
  { id: 4, categoryId: 2, name: "Beef Tapa Bowl", description: "Sweet-savory beef over steamed rice.", price: "165.00", stock: 30, discount: "15.00", availability: true, imageUrl: null },
  { id: 5, categoryId: 3, name: "Sinigang na Baboy", description: "Pork in sour tamarind broth with vegetables.", price: "220.00", stock: 12, discount: null, availability: true, imageUrl: null },
  { id: 6, categoryId: 3, name: "Kare-Kare", description: "Oxtail stew in rich peanut sauce.", price: "280.00", stock: 0, discount: null, availability: false, imageUrl: null },
  { id: 7, categoryId: 4, name: "Gyoza (6 pcs)", description: "Pan-fried pork dumplings with dipping sauce.", price: "95.00", stock: 40, discount: null, availability: true, imageUrl: null },
  { id: 8, categoryId: 4, name: "Lumpiang Shanghai", description: "Crispy spring rolls with sweet chili sauce.", price: "85.00", stock: 3, discount: "5.00", availability: true, imageUrl: null },
  { id: 9, categoryId: 5, name: "Brown Sugar Milk Tea", description: "Classic milk tea with tapioca pearls.", price: "110.00", stock: 50, discount: null, availability: true, imageUrl: null },
  { id: 10, categoryId: 5, name: "Iced Matcha Latte", description: "Ceremonial matcha over milk and ice.", price: "130.00", stock: 0, discount: null, availability: false, imageUrl: null },
];

export const mockCartItems: CartItem[] = [
  { id: 1, name: "Light Espresso", categoryName: "Drinks", quantity: 2, price: 400 },
  { id: 2, name: "Hash Browns", categoryName: "Breakfast", quantity: 1, price: 310 },
  { id: 3, name: "Matcha Tea", categoryName: "Drinks", quantity: 2, price: 210, originalPrice: 250 },
];

export const mockOrderHistory: OrderHistoryItem[] = [
  { id: 82923, order: { id: 82923, employeeId: "d9b23f80-7b5c-4e89-a2e1-88f1c324901a", customerId: null, status: "PENDING", orderedAt: new Date("2026-10-12T10:30:00Z") }, totalAmount: 920.0, itemCount: 3, itemImages: ["/mock/chocolate-drinks.jpg", "/mock/tapsilog.jpg"] },
  { id: 45239, order: { id: 45239, employeeId: "d9b23f80-7b5c-4e89-a2e1-88f1c324901a", customerId: null, status: "CANCELLED", orderedAt: new Date("2026-10-10T14:15:00Z") }, totalAmount: 220.0, itemCount: 1, itemImages: ["/mock/hash-browns-bacon.jpg"] },
  { id: 9752, order: { id: 9752, employeeId: "d9b23f80-7b5c-4e89-a2e1-88f1c324901a", customerId: null, status: "COMPLETED", orderedAt: new Date("2026-09-29T16:45:00Z") }, totalAmount: 120.0, itemCount: 1, itemImages: ["/mock/iced-matcha.jpg"] },
  { id: 61840, order: { id: 61840, employeeId: "d9b23f80-7b5c-4e89-a2e1-88f1c324901a", customerId: null, status: "COMPLETED", orderedAt: new Date("2026-09-15T11:20:00Z") }, totalAmount: 1450.0, itemCount: 5, itemImages: ["/mock/chocolate-drinks.jpg", "/mock/tapsilog.jpg", "/mock/hash-browns-bacon.jpg", "/mock/iced-matcha.jpg", "/mock/pancakes.jpg"] },
];

export const mockAnalyticsData: Record<TimeRange, AnalyticsMetric> = {
  daily: {
    revenue: "₱501.50",
    productsSold: 18,
    customers: 12,
    topProduct: { name: "Matcha Tea", salesCount: 8 },
    lowestProduct: { name: "Hash Browns", salesCount: 1 },
    incomeBreakdown: [
      { name: "Matcha Tea", amount: 255.75 },
      { name: "Hot Chocolate", amount: 150.45 },
      { name: "Light Espresso", amount: 60.18 },
      { name: "Hash Browns", amount: 35.12 },
    ],
    categoryBreakdown: [
      { name: "Drinks", value: 45 },
      { name: "Breakfast", value: 25 },
      { name: "Lunch", value: 18 },
      { name: "Appetizer", value: 12 },
    ],
  },
  weekly: {
    revenue: "₱2,840.00",
    productsSold: 124,
    customers: 85,
    topProduct: { name: "Brown Sugar Milk Tea", salesCount: 42 },
    lowestProduct: { name: "Chicken Katsu Bento", salesCount: 3 },
    incomeBreakdown: [
      { name: "Brown Sugar Milk Tea", amount: 1136.00 },
      { name: "Tapsilog", amount: 994.00 },
      { name: "Gyoza", amount: 426.00 },
      { name: "Pancake Stack", amount: 184.00 },
      { name: "Chicken Katsu Bento", amount: 100.00 },
    ],
    categoryBreakdown: [
      { name: "Drinks", value: 40 },
      { name: "Breakfast", value: 30 },
      { name: "Lunch", value: 20 },
      { name: "Dinner", value: 10 },
    ],
  },
  monthly: {
    revenue: "₱11,250.00",
    productsSold: 540,
    customers: 310,
    topProduct: { name: "Matcha Tea", salesCount: 136 },
    lowestProduct: { name: "Beef Tapa Bowl", salesCount: 12 },
    incomeBreakdown: [
      { name: "Matcha Tea", amount: 4500.00 },
      { name: "Tapsilog", amount: 2812.50 },
      { name: "Brown Sugar Milk Tea", amount: 2025.00 },
      { name: "Pancake Stack", amount: 1350.00 },
      { name: "Beef Tapa Bowl", amount: 562.50 },
    ],
    categoryBreakdown: [
      { name: "Drinks", value: 35 },
      { name: "Lunch", value: 30 },
      { name: "Breakfast", value: 20 },
      { name: "Dinner", value: 15 },
    ],
  },
  "all-time": {
    revenue: "₱48,920.00",
    productsSold: 2150,
    customers: 142,
    topProduct: { name: "Tapsilog", salesCount: 520 },
    lowestProduct: { name: "Lumpiang Shanghai", salesCount: 15 },
    incomeBreakdown: [
      { name: "Tapsilog", amount: 24460.00 },
      { name: "Brown Sugar Milk Tea", amount: 12230.00 },
      { name: "Chicken Katsu Bento", amount: 7338.00 },
      { name: "Lumpiang Shanghai", amount: 2935.20 },
      { name: "Pancake Stack", amount: 1956.80 },
    ],
    categoryBreakdown: [
      { name: "Breakfast", value: 40 },
      { name: "Drinks", value: 30 },
      { name: "Lunch", value: 20 },
      { name: "Dinner", value: 10 },
    ],
  },
};