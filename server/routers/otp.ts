import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { sendOTPWhatsApp, isTwilioConfigured } from "../services/whatsapp";

// Générer un code OTP à 6 chiffres
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Normaliser le numéro de téléphone (format international)
function normalizePhone(phone: string): string {
  // Retirer espaces, tirets, parenthèses
  let normalized = phone.replace(/[\s\-()]/g, '');
  
  // Si commence par 0, remplacer par +225 (Côte d'Ivoire)
  if (normalized.startsWith('0')) {
    normalized = '+225' + normalized.substring(1);
  }
  
  // Si ne commence pas par +, ajouter +225
  if (!normalized.startsWith('+')) {
    normalized = '+225' + normalized;
  }
  
  return normalized;
}

export const otpRouter = router({
  // Envoyer un code OTP par WhatsApp
  sendOTP: publicProcedure
    .input(
      z.object({
        phone: z.string().min(8, "Numéro de téléphone invalide"),
      })
    )
    .mutation(async ({ input }) => {
      const normalizedPhone = normalizePhone(input.phone);
      
      // Vérifier si le numéro existe déjà
      const customersCollection = collection(db, "customers");
      const q = query(customersCollection, where("phone", "==", normalizedPhone));
      const existingCustomers = await getDocs(q);
      
      if (!existingCustomers.empty) {
        throw new Error("Ce numéro de téléphone est déjà enregistré");
      }
      
      // Générer le code OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      console.log(`[OTP] Code généré pour ${normalizedPhone}: ${otpCode}`);
      
      // Supprimer les anciens OTP pour ce numéro
      const otpCollection = collection(db, "otp");
      const oldOtpQuery = query(otpCollection, where("phone", "==", normalizedPhone));
      const oldOtpDocs = await getDocs(oldOtpQuery);
      
      for (const oldDoc of oldOtpDocs.docs) {
        await deleteDoc(doc(db, "otp", oldDoc.id));
      }
      
      // Sauvegarder le nouveau OTP
      await addDoc(otpCollection, {
        phone: normalizedPhone,
        code: otpCode,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        verified: false,
      });
      
      // Envoyer le code par WhatsApp avec Twilio
      let whatsappSent = false;
      
      if (isTwilioConfigured()) {
        try {
          console.log(`[OTP] Envoi du code via Twilio WhatsApp...`);
          whatsappSent = await sendOTPWhatsApp(normalizedPhone, otpCode);
          
          if (whatsappSent) {
            console.log(`[OTP] ✅ Code envoyé avec succès via WhatsApp à ${normalizedPhone}`);
          }
        } catch (error: any) {
          console.error(`[OTP] ❌ Erreur Twilio:`, error.message);
          // Continuer même si l'envoi échoue (afficher le code en fallback)
        }
      } else {
        console.warn('[OTP] ⚠️  Twilio non configuré. Ajoutez TWILIO_ACCOUNT_SID et TWILIO_AUTH_TOKEN.');
      }
      
      // Fallback : Si Twilio n'est pas configuré ou a échoué, afficher le code dans les logs
      if (!whatsappSent) {
        console.log(`[OTP] 📝 MODE DÉVELOPPEMENT - Code pour ${normalizedPhone}: ${otpCode}`);
        console.log(`[OTP] Message qui aurait été envoyé:\n🔐 Coradis - Votre code: ${otpCode} (expire dans 10 min)`);
      }
      
      return {
        success: true,
        message: whatsappSent 
          ? `Code de vérification envoyé au ${normalizedPhone} via WhatsApp`
          : `Code de vérification généré (Twilio non configuré)`,
        // Retourner le code UNIQUEMENT si Twilio n'est pas configuré (mode dev)
        ...(!whatsappSent && { devCode: otpCode }),
      };
    }),

  // Vérifier le code OTP
  verifyOTP: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        code: z.string().length(6, "Le code doit contenir 6 chiffres"),
      })
    )
    .mutation(async ({ input }) => {
      const normalizedPhone = normalizePhone(input.phone);
      
      console.log(`[OTP] Vérification du code pour ${normalizedPhone}`);
      
      // Chercher l'OTP
      const otpCollection = collection(db, "otp");
      const q = query(
        otpCollection, 
        where("phone", "==", normalizedPhone),
        where("code", "==", input.code)
      );
      const otpDocs = await getDocs(q);
      
      if (otpDocs.empty) {
        console.log(`[OTP] Code invalide pour ${normalizedPhone}`);
        throw new Error("Code de vérification invalide");
      }
      
      const otpDoc = otpDocs.docs[0];
      const otpData = otpDoc.data();
      
      // Vérifier l'expiration
      const expiresAt = new Date(otpData.expiresAt);
      if (expiresAt < new Date()) {
        console.log(`[OTP] Code expiré pour ${normalizedPhone}`);
        await deleteDoc(doc(db, "otp", otpDoc.id));
        throw new Error("Code de vérification expiré. Demandez un nouveau code.");
      }
      
      // Marquer comme vérifié
      console.log(`[OTP] Code vérifié avec succès pour ${normalizedPhone}`);
      
      // Note: On ne supprime pas l'OTP ici, il sera supprimé après la création du compte
      // ou automatiquement après expiration
      
      return {
        success: true,
        message: "Numéro vérifié avec succès !",
        phone: normalizedPhone,
      };
    }),

  // Supprimer l'OTP après utilisation (appelé après création de compte)
  deleteOTP: publicProcedure
    .input(
      z.object({
        phone: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const normalizedPhone = normalizePhone(input.phone);
      
      const otpCollection = collection(db, "otp");
      const q = query(otpCollection, where("phone", "==", normalizedPhone));
      const otpDocs = await getDocs(q);
      
      for (const otpDoc of otpDocs.docs) {
        await deleteDoc(doc(db, "otp", otpDoc.id));
      }
      
      console.log(`[OTP] Codes supprimés pour ${normalizedPhone}`);
      
      return { success: true };
    }),
});

