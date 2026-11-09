import { getOrdersData } from "@/components/orders/actions";
import OrdersClient from "@/components/orders/orders-client";

export default async function OrdersPage() {
  const { categories, products } = await getOrdersData();

  return <OrdersClient categories={categories} products={products} />;
}