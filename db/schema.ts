import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  text,
  boolean,
  numeric,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const accountType = pgEnum("account_type", ["WORKER", "ADMIN"]);
export const orderStatus = pgEnum("order_status", [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  accountType: accountType("account_type").notNull().default("WORKER"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}).enableRLS();

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => profiles.id),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
}).enableRLS();

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  discount: numeric("discount", { precision: 5, scale: 2 }),
  availability: boolean("availability").notNull().default(true),
  imageUrl: text("image_url"),
}).enableRLS();

export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => profiles.id),
  customerId: integer("customer_id"),
  status: orderStatus("status").notNull().default("PENDING"),
  orderedAt: timestamp("ordered_at").notNull().defaultNow(),
}).enableRLS();

export const orderItems = pgTable(
  "order_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  },
  (t) => [unique().on(t.orderId, t.productId)],
).enableRLS();
