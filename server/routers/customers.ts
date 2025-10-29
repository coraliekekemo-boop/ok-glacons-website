import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import bcrypt from "bcryptjs";

export const customersRouter = router({
  // Inscription client
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        phone: z.string().min(10),
        email: z.string().email().optional(),
        password: z.string().min(6),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const customersCollection = collection(db, "customers");
      
      // Vérifier si le téléphone existe déjà
      const q = query(customersCollection, where("phone", "==", input.phone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("Ce numéro de téléphone est déjà utilisé");
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Créer le client
      const newCustomerRef = await addDoc(customersCollection, {
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        password: hashedPassword,
        address: input.address || null,
        loyaltyPoints: 0,
        totalSpent: 0,
        totalOrders: 0,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referredBy: null,
        createdAt: new Date().toISOString(),
      });

      // Set session cookie
      if (ctx.res) {
        ctx.res.cookie("customer_session", JSON.stringify({
          id: newCustomerRef.id,
          name: input.name,
          phone: input.phone,
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          sameSite: "lax",
        });
      }

      return {
        success: true,
        customerId: newCustomerRef.id,
        message: "Compte créé avec succès!",
      };
    }),

  // Connexion client
  login: publicProcedure
    .input(
      z.object({
        phone: z.string().min(10),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const customersCollection = collection(db, "customers");
      const q = query(customersCollection, where("phone", "==", input.phone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Numéro de téléphone ou mot de passe incorrect");
      }

      const customerDoc = querySnapshot.docs[0];
      const customer = { id: customerDoc.id, ...customerDoc.data() };

      // Vérifier le mot de passe
      const isValid = await bcrypt.compare(input.password, customer.password as string);

      if (!isValid) {
        throw new Error("Numéro de téléphone ou mot de passe incorrect");
      }

      // Set session cookie
      if (ctx.res) {
        ctx.res.cookie("customer_session", JSON.stringify({
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          sameSite: "lax",
        });
      }

      return {
        success: true,
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          loyaltyPoints: customer.loyaltyPoints,
        },
      };
    }),

  // Vérifier authentification
  checkAuth: publicProcedure.query(async ({ ctx }) => {
    const sessionCookie = ctx.req?.cookies?.customer_session;

    if (!sessionCookie) {
      return { isAuthenticated: false };
    }

    try {
      const session = JSON.parse(sessionCookie);
      
      const customerRef = doc(db, "customers", session.id);
      const customerSnap = await getDoc(customerRef);

      if (!customerSnap.exists()) {
        return { isAuthenticated: false };
      }

      const customer = { id: customerSnap.id, ...customerSnap.data() };

      return {
        isAuthenticated: true,
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          loyaltyPoints: customer.loyaltyPoints,
          totalSpent: customer.totalSpent,
          totalOrders: customer.totalOrders,
          referralCode: customer.referralCode,
        },
      };
    } catch (error) {
      return { isAuthenticated: false };
    }
  }),

  // Déconnexion
  logout: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.res) {
      ctx.res.clearCookie("customer_session");
    }

    return {
      success: true,
    };
  }),

  // Obtenir le profil complet
  getProfile: publicProcedure.query(async ({ ctx }) => {
    const sessionCookie = ctx.req?.cookies?.customer_session;

    if (!sessionCookie) {
      throw new Error("Non authentifié");
    }

    const session = JSON.parse(sessionCookie);
    
    const customerRef = doc(db, "customers", session.id);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      throw new Error("Client non trouvé");
    }

    const customer = { id: customerSnap.id, ...customerSnap.data() };

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      loyaltyPoints: customer.loyaltyPoints,
      totalSpent: customer.totalSpent,
      totalOrders: customer.totalOrders,
      referralCode: customer.referralCode,
      createdAt: customer.createdAt,
    };
  }),

  // Mettre à jour le profil
  updateProfile: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const sessionCookie = ctx.req?.cookies?.customer_session;

      if (!sessionCookie) {
        throw new Error("Non authentifié");
      }

      const session = JSON.parse(sessionCookie);
      
      const customerRef = doc(db, "customers", session.id);
      await updateDoc(customerRef, input);

      return {
        success: true,
        message: "Profil mis à jour",
      };
    }),

  // Utiliser un code de parrainage lors de l'inscription
  useReferralCode: publicProcedure
    .input(
      z.object({
        referralCode: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const sessionCookie = ctx.req?.cookies?.customer_session;

      if (!sessionCookie) {
        throw new Error("Non authentifié");
      }

      const session = JSON.parse(sessionCookie);
      
      // Trouver le parrain
      const customersCollection = collection(db, "customers");
      const q = query(customersCollection, where("referralCode", "==", input.referralCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Code de parrainage invalide");
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerId = referrerDoc.id;

      if (referrerId === session.id) {
        throw new Error("Vous ne pouvez pas utiliser votre propre code");
      }

      // Fonction pour générer un reward aléatoire
      const generateRandomReward = () => {
        const rewards = [
          { type: "lanaia_tube", label: "Tube Lanaïa Gratuit" },
          { type: "lanaia_paquet", label: "Paquet Lanaïa Gratuit" },
          { type: "lanaia_poche", label: "Paquet Lanaïa Poche Gratuit" },
          { type: "livraison_gratuite", label: "Livraison Gratuite" },
        ];
        return rewards[Math.floor(Math.random() * rewards.length)];
      };

      // Créer un ticket à gratter pour le filleul
      const scratchCardsCollection = collection(db, "scratchCards");
      const referredReward = generateRandomReward();
      await addDoc(scratchCardsCollection, {
        customerId: session.id,
        reward: referredReward.type,
        rewardLabel: referredReward.label,
        scratched: false,
        createdAt: new Date().toISOString(),
        scratchedAt: null,
      });

      // Créer un ticket à gratter pour le parrain
      const referrerReward = generateRandomReward();
      await addDoc(scratchCardsCollection, {
        customerId: referrerId,
        reward: referrerReward.type,
        rewardLabel: referrerReward.label,
        scratched: false,
        createdAt: new Date().toISOString(),
        scratchedAt: null,
      });

      // Marquer le client comme parrainé
      const customerRef = doc(db, "customers", session.id);
      await updateDoc(customerRef, {
        referredBy: referrerId,
      });

      return {
        success: true,
        message: "Code de parrainage appliqué ! Grattez votre ticket pour découvrir votre cadeau 🎁",
      };
    }),

  // Obtenir l'historique des commandes du client
  getMyOrders: publicProcedure.query(async ({ ctx }) => {
    const sessionCookie = ctx.req?.cookies?.customer_session;

    if (!sessionCookie) {
      throw new Error("Non authentifié");
    }

    const session = JSON.parse(sessionCookie);
    
    const ordersCollection = collection(db, "orders");
    const q = query(
      ordersCollection, 
      where("customerId", "==", session.id),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return orders;
  }),

  // Ajouter une commande aux favoris
  addFavoriteOrder: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const sessionCookie = ctx.req?.cookies?.customer_session;

      if (!sessionCookie) {
        throw new Error("Non authentifié");
      }

      const session = JSON.parse(sessionCookie);
      
      // Récupérer la commande
      const orderRef = doc(db, "orders", input.orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        throw new Error("Commande non trouvée");
      }

      const order = orderSnap.data();

      // Créer un favori
      const favoritesCollection = collection(db, "favoriteOrders");
      await addDoc(favoritesCollection, {
        customerId: session.id,
        items: order.items,
        deliveryAddress: order.deliveryAddress,
        notes: order.notes,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: "Commande ajoutée aux favoris",
      };
    }),

  // Obtenir les commandes favorites
  getFavoriteOrders: publicProcedure.query(async ({ ctx }) => {
    const sessionCookie = ctx.req?.cookies?.customer_session;

    if (!sessionCookie) {
      throw new Error("Non authentifié");
    }

    const session = JSON.parse(sessionCookie);
    
    const favoritesCollection = collection(db, "favoriteOrders");
    const q = query(
      favoritesCollection, 
      where("customerId", "==", session.id),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const favorites = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return favorites;
  }),

  // Calculer la réduction disponible pour le client
  getAvailableDiscount: publicProcedure.query(async ({ ctx }) => {
    const sessionCookie = ctx.req?.cookies?.customer_session;

    if (!sessionCookie) {
      return { hasDiscount: false, discount: 0, reason: null };
    }

    const session = JSON.parse(sessionCookie);
    
    const customerRef = doc(db, "customers", session.id);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      return { hasDiscount: false, discount: 0, reason: null };
    }

    const customer = customerSnap.data();
    const totalOrders = customer.totalOrders || 0;

    // 10 commandes = -10% sur la prochaine
    if (totalOrders > 0 && totalOrders % 10 === 0) {
      return {
        hasDiscount: true,
        discount: 10,
        reason: "🎉 Félicitations ! Vous avez atteint 10 commandes et bénéficiez de -10% sur cette commande !",
      };
    }

    return { hasDiscount: false, discount: 0, reason: null };
  }),

  // Obtenir les tickets à gratter du client
  getScratchCards: publicProcedure.query(async ({ ctx }) => {
    const sessionCookie = ctx.req?.cookies?.customer_session;

    if (!sessionCookie) {
      throw new Error("Non authentifié");
    }

    const session = JSON.parse(sessionCookie);
    
    const scratchCardsCollection = collection(db, "scratchCards");
    const q = query(
      scratchCardsCollection, 
      where("customerId", "==", session.id),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const scratchCards = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return scratchCards;
  }),

  // Gratter un ticket
  scratchCard: publicProcedure
    .input(
      z.object({
        cardId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const sessionCookie = ctx.req?.cookies?.customer_session;

      if (!sessionCookie) {
        throw new Error("Non authentifié");
      }

      const session = JSON.parse(sessionCookie);
      
      // Vérifier que le ticket appartient au client
      const cardRef = doc(db, "scratchCards", input.cardId);
      const cardSnap = await getDoc(cardRef);

      if (!cardSnap.exists()) {
        throw new Error("Ticket introuvable");
      }

      const cardData = cardSnap.data();

      if (cardData.customerId !== session.id) {
        throw new Error("Ce ticket ne vous appartient pas");
      }

      if (cardData.scratched) {
        throw new Error("Ce ticket a déjà été gratté");
      }

      // Marquer le ticket comme gratté
      await updateDoc(cardRef, {
        scratched: true,
        scratchedAt: new Date().toISOString(),
      });

      return {
        success: true,
        reward: cardData.reward,
        rewardLabel: cardData.rewardLabel,
      };
    }),
});

