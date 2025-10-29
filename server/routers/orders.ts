import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

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
      // Create the order with items
      const orderData = {
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        deliveryAddress: input.deliveryAddress,
        deliveryDate: input.deliveryDate,
        isUrgent: input.isUrgent,
        notes: input.notes || "",
        totalPrice: input.totalPrice,
        status: "pending",
        items: input.items.map((item) => ({
          productName: item.productName,
          productUnit: item.productUnit,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit,
          totalPrice: item.pricePerUnit * item.quantity,
        })),
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      return {
        success: true,
        orderId: docRef.id,
        message: "Commande enregistrée avec succès!",
      };
    }),

  // Get all orders (for admin)
  getAll: publicProcedure.query(async () => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to ISO string
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }));

    return orders;
  }),

  // Get a single order
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const docRef = doc(db, "orders", input.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Commande non trouvée");
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      };
    }),

  // Update order status
  updateStatus: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(["pending", "confirmed", "in_delivery", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const docRef = doc(db, "orders", input.orderId);
      await updateDoc(docRef, {
        status: input.status,
      });

      return {
        success: true,
        message: "Statut mis à jour",
      };
    }),

  // Delete an order
  delete: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ input }) => {
      const docRef = doc(db, "orders", input.orderId);
      await deleteDoc(docRef);

      return {
        success: true,
        message: "Commande supprimée",
      };
    }),
});
