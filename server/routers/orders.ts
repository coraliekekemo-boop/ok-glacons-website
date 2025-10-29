import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { orders, orderItems } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const ordersRouter = router({
  // Create a new order
  create: publicProcedure
    .input(
      z.object({
        customerName: z.string().min(1),
        customerPhone: z.string().min(1),
        deliveryAddress: z.string().min(1),
        deliveryDate: z.string(),
        isUrgent: z.boolean(),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            productName: z.string(),
            productUnit: z.string(),
            quantity: z.number(),
            pricePerUnit: z.number(),
          })
        ),
        totalPrice: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // Create the order
      const result = await db.insert(orders).values({
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        deliveryAddress: input.deliveryAddress,
        deliveryDate: input.deliveryDate,
        isUrgent: input.isUrgent ? 1 : 0,
        notes: input.notes || null,
        totalPrice: input.totalPrice,
        status: "pending",
      });

      const orderId = Number(result.lastInsertRowid);

      // Create order items
      const itemsToInsert = input.items.map((item) => ({
        orderId: orderId,
        productName: item.productName,
        productUnit: item.productUnit,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        totalPrice: item.pricePerUnit * item.quantity,
      }));

      await db.insert(orderItems).values(itemsToInsert);

      return {
        success: true,
        orderId: orderId,
        message: "Commande enregistrée avec succès!",
      };
    }),

  // Get all orders (for admin)
  getAll: publicProcedure.query(async () => {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    // Get items for each order
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items,
        };
      })
    );

    return ordersWithItems;
  }),

  // Get a single order
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id));

      if (!order) {
        throw new Error("Commande non trouvée");
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      return {
        ...order,
        items,
      };
    }),

  // Update order status
  updateStatus: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "confirmed", "in_delivery", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.orderId));

      return {
        success: true,
        message: "Statut mis à jour",
      };
    }),

  // Delete an order
  delete: publicProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ input }) => {
      // Delete order items first (foreign key)
      await db.delete(orderItems).where(eq(orderItems.orderId, input.orderId));

      // Then delete the order
      await db.delete(orders).where(eq(orders.id, input.orderId));

      return {
        success: true,
        message: "Commande supprimée",
      };
    }),
});
