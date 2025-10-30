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
        customerId: z.string().optional(), // ID du client si connecté
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
        customerId: input.customerId || null, // Associer au client si connecté
        loyaltyPointsEarned: 0, // Sera mis à jour quand la commande est livrée
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
      const orderSnap = await getDoc(docRef);
      
      if (!orderSnap.exists()) {
        throw new Error("Commande non trouvée");
      }

      const orderData = orderSnap.data();

      // Si la commande passe à "delivered" et qu'elle a un customerId
      if (input.status === "delivered" && orderData.customerId && orderData.loyaltyPointsEarned === 0) {
        const customerId = orderData.customerId;
        const totalPrice = orderData.totalPrice;
        
        // Calculer les points : 1 point = 100 FCFA
        const pointsEarned = Math.floor(totalPrice / 100);

        // Mettre à jour le client
        const customerRef = doc(db, "customers", customerId);
        const customerSnap = await getDoc(customerRef);
        
        if (customerSnap.exists()) {
          const customerData = customerSnap.data();
          const currentTotalOrders = customerData.totalOrders || 0;
          
          await updateDoc(customerRef, {
            loyaltyPoints: (customerData.loyaltyPoints || 0) + pointsEarned,
            totalSpent: (customerData.totalSpent || 0) + totalPrice,
            totalOrders: currentTotalOrders + 1,
          });

          // Si c'est la PREMIÈRE commande livrée (currentTotalOrders === 0) 
          // ET que le client a été parrainé, donner un ticket au PARRAIN
          if (currentTotalOrders === 0 && customerData.referredBy) {
            const referrerId = customerData.referredBy;
            console.log("[ORDER_DELIVERY] First order delivered for referred customer! Creating scratch card for referrer:", referrerId);
            
            // Générer un reward aléatoire
            const rewards = [
              { type: "lanaia_tube", label: "Tube Lanaïa Gratuit" },
              { type: "lanaia_paquet", label: "Paquet Lanaïa Gratuit" },
              { type: "lanaia_poche", label: "Paquet Lanaïa Poche Gratuit" },
              { type: "livraison_gratuite", label: "Livraison Gratuite" },
            ];
            const reward = rewards[Math.floor(Math.random() * rewards.length)];
            
            // Créer un ticket à gratter pour le PARRAIN
            const scratchCardsCollection = collection(db, "scratchCards");
            const cardRef = await addDoc(scratchCardsCollection, {
              customerId: referrerId,
              reward: reward.type,
              rewardLabel: reward.label,
              scratched: false,
              createdAt: new Date().toISOString(),
              scratchedAt: null,
              reason: "referral_reward", // Raison du ticket
            });
            console.log("[ORDER_DELIVERY] Scratch card created for referrer:", cardRef.id, reward.label);
          }

          // Mettre à jour la commande
          await updateDoc(docRef, {
            status: input.status,
            loyaltyPointsEarned: pointsEarned,
          });

          return {
            success: true,
            message: `Statut mis à jour. Le client a gagné ${pointsEarned} points de fidélité !`,
          };
        }
      }

      // Sinon, mise à jour normale
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
