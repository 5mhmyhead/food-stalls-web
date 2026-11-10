import {
  CookingPot, Utensils, UtensilsCrossed, Soup, Cookie, CupSoda, Pizza, Coffee,
  IceCream, Sandwich, Salad, Beef, Fish, Egg, EggFried, Croissant, Cake,
  CakeSlice, Candy, Apple, Cherry, Citrus, Carrot, Beer, Wine, Martini, Milk,
  GlassWater, Drumstick, Ham, Popcorn, Wheat, Vegan, Donut, ChefHat, Flame,
  type LucideIcon,
} from "lucide-react";

export type CategoryIconOption = {
  id: string;
  label: string;
  keywords: string[];
  Icon: LucideIcon;
};

export const CATEGORY_ICONS: CategoryIconOption[] = [
  { id: "CookingPot", label: "Mains", keywords: ["main", "stew", "dinner"], Icon: CookingPot },
  { id: "Utensils", label: "Meals", keywords: ["lunch", "rice", "plate"], Icon: Utensils },
  { id: "Soup", label: "Soups", keywords: ["broth", "noodles", "ramen"], Icon: Soup },
  { id: "Salad", label: "Salads", keywords: ["healthy", "greens", "vegetarian"], Icon: Salad },
  { id: "Sandwich", label: "Sandwiches", keywords: ["bread", "burger", "sub"], Icon: Sandwich },
  { id: "Pizza", label: "Pizza", keywords: ["italian"], Icon: Pizza },
  { id: "Beef", label: "Beef", keywords: ["meat", "steak", "grill"], Icon: Beef },
  { id: "Drumstick", label: "Chicken", keywords: ["fried", "poultry", "meat"], Icon: Drumstick },
  { id: "Ham", label: "Pork", keywords: ["meat", "bacon"], Icon: Ham },
  { id: "Fish", label: "Seafood", keywords: ["fish", "shrimp", "sushi"], Icon: Fish },
  { id: "Egg", label: "Eggs", keywords: ["breakfast"], Icon: Egg },
  { id: "EggFried", label: "Breakfast", keywords: ["egg", "morning", "silog"], Icon: EggFried },
  { id: "Croissant", label: "Pastries", keywords: ["bakery", "bread", "breakfast"], Icon: Croissant },
  { id: "Wheat", label: "Bakery", keywords: ["bread", "grain", "flour"], Icon: Wheat },
  { id: "Vegan", label: "Vegan", keywords: ["vegetarian", "plant", "leaf"], Icon: Vegan },
  { id: "Carrot", label: "Vegetables", keywords: ["veggie", "produce"], Icon: Carrot },
  { id: "Apple", label: "Fruits", keywords: ["produce", "fresh"], Icon: Apple },
  { id: "Cherry", label: "Berries", keywords: ["fruit", "sweet"], Icon: Cherry },
  { id: "Citrus", label: "Citrus", keywords: ["lemon", "orange", "fruit"], Icon: Citrus },
  { id: "Cookie", label: "Snacks", keywords: ["biscuit", "dessert"], Icon: Cookie },
  { id: "Popcorn", label: "Popcorn", keywords: ["snack", "movie"], Icon: Popcorn },
  { id: "Donut", label: "Donuts", keywords: ["dessert", "sweet"], Icon: Donut },
  { id: "Cake", label: "Cakes", keywords: ["dessert", "birthday"], Icon: Cake },
  { id: "CakeSlice", label: "Desserts", keywords: ["sweet", "slice", "pastry"], Icon: CakeSlice },
  { id: "IceCream", label: "Ice Cream", keywords: ["dessert", "frozen", "cold"], Icon: IceCream },
  { id: "Candy", label: "Candy", keywords: ["sweet", "dessert"], Icon: Candy },
  { id: "CupSoda", label: "Drinks", keywords: ["soda", "beverage", "milk tea"], Icon: CupSoda },
  { id: "Coffee", label: "Coffee", keywords: ["cafe", "hot", "espresso"], Icon: Coffee },
  { id: "Milk", label: "Milk", keywords: ["dairy", "milk tea"], Icon: Milk },
  { id: "GlassWater", label: "Water", keywords: ["juice", "beverage"], Icon: GlassWater },
  { id: "Beer", label: "Beer", keywords: ["alcohol", "bar"], Icon: Beer },
  { id: "Wine", label: "Wine", keywords: ["alcohol", "bar"], Icon: Wine },
  { id: "Martini", label: "Cocktails", keywords: ["alcohol", "bar"], Icon: Martini },
  { id: "Flame", label: "Grilled", keywords: ["bbq", "hot", "spicy"], Icon: Flame },
  { id: "ChefHat", label: "Specials", keywords: ["chef", "signature"], Icon: ChefHat },
];

const ICON_BY_ID = new Map(CATEGORY_ICONS.map((o) => [o.id, o.Icon]));

export function getCategoryIcon(id?: string | null): LucideIcon {
  return (id && ICON_BY_ID.get(id)) || UtensilsCrossed;
}