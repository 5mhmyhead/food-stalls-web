import type { categories, products } from "@/db/schema";

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;

const OWNER = "dwyanesido";

export const mockCategories: Category[] = [
  { id: 1, createdBy: OWNER, name: "Breakfast", icon: "🍳" },
  { id: 2, createdBy: OWNER, name: "Lunch", icon: "🍱" },
  { id: 3, createdBy: OWNER, name: "Dinner", icon: "🍛" },
  { id: 4, createdBy: OWNER, name: "Appetizer", icon: "🥟" },
  { id: 5, createdBy: OWNER, name: "Drinks", icon: "🧋" },
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