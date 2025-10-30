import twilio from 'twilio';

// Configuration Twilio (à configurer via variables d'environnement)
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Numéro Twilio Sandbox par défaut

let twilioClient: ReturnType<typeof twilio> | null = null;

// Initialiser le client Twilio
function getTwilioClient() {
  if (!twilioClient && accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

// Vérifier si Twilio est configuré
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken);
}

// Envoyer un message WhatsApp via Twilio
export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  const client = getTwilioClient();
  
  if (!client) {
    console.warn('[WhatsApp] Twilio non configuré. Variables d\'environnement manquantes.');
    console.log('[WhatsApp] Message à envoyer:', message);
    return false;
  }

  try {
    // Normaliser le numéro de téléphone
    let normalizedTo = to;
    if (!normalizedTo.startsWith('whatsapp:')) {
      normalizedTo = `whatsapp:${normalizedTo}`;
    }

    console.log(`[WhatsApp] Envoi du message à ${normalizedTo}`);
    
    const result = await client.messages.create({
      from: whatsappFrom,
      to: normalizedTo,
      body: message,
    });

    console.log(`[WhatsApp] Message envoyé avec succès ! SID: ${result.sid}`);
    return true;
  } catch (error: any) {
    console.error('[WhatsApp] Erreur lors de l\'envoi:', error.message);
    
    // Erreurs courantes et solutions
    if (error.code === 21408) {
      console.error('[WhatsApp] Numéro non autorisé dans le Sandbox Twilio.');
      console.error('[WhatsApp] Solution: Ajoutez le numéro dans le Sandbox ou passez en compte production.');
    } else if (error.code === 21211) {
      console.error('[WhatsApp] Numéro de téléphone invalide.');
    } else if (error.code === 20003) {
      console.error('[WhatsApp] Authentification Twilio échouée. Vérifiez vos identifiants.');
    }
    
    throw error;
  }
}

// Envoyer un code OTP par WhatsApp
export async function sendOTPWhatsApp(phone: string, code: string): Promise<boolean> {
  const message = `🔐 *Coradis - Code de Vérification*

Votre code de vérification est : *${code}*

Ce code expire dans 10 minutes.

Ne partagez ce code avec personne ! 🔒`;

  return await sendWhatsAppMessage(phone, message);
}

