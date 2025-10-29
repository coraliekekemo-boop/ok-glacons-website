import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role").default("user").notNull(), // "user" or "admin"
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Admins table for local authentication
 */
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // hashed password
  email: text("email").notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

/**
 * Orders table
 */
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerName: text("customerName").notNull(),
  customerPhone: text("customerPhone").notNull(),
  deliveryAddress: text("deliveryAddress").notNull(),
  deliveryDate: text("deliveryDate").notNull(), // YYYY-MM-DD format
  isUrgent: integer("isUrgent").default(0).notNull(), // 0 = non, 1 = oui
  totalPrice: integer("totalPrice").notNull(), // in FCFA
  status: text("status").default("pending").notNull(), // pending, confirmed, in_delivery, delivered, cancelled
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items (products in an order)
 */
export const orderItems = sqliteTable("orderItems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("orderId").notNull(),
  productName: text("productName").notNull(),
  productUnit: text("productUnit").notNull(),
  quantity: integer("quantity").notNull(),
  pricePerUnit: integer("pricePerUnit").notNull(), // in FCFA
  totalPrice: integer("totalPrice").notNull(), // in FCFA
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Products table for OK Glaçons
 */
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "ice_block", "dry_ice", "ice_cubes", "ice_cups", "food_ice"
  price: integer("price").notNull(), // in FCFA
  image: text("image"),
  available: integer("available").default(1).notNull(), // stock quantity
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Contact messages
 */
export const contactMessages = sqliteTable("contactMessages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new").notNull(), // "new", "read", "replied"
  createdAt: integer("createdAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
