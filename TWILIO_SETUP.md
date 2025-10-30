# 📱 Configuration Twilio pour WhatsApp

Ce guide vous explique comment configurer Twilio pour envoyer de vrais messages WhatsApp pour la vérification OTP.

---

## 🚀 Étape 1 : Créer un compte Twilio

1. **Allez sur** : [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. **Cliquez sur** "Sign up"
3. **Remplissez** le formulaire :
   - Email
   - Mot de passe
   - Nom de l'entreprise : `Coradis`
   - Pays : `Ivory Coast` ou `Côte d'Ivoire`
4. **Vérifiez** votre email
5. **Vérifiez** votre numéro de téléphone
6. 🎁 **Vous recevez 15$ de crédit gratuit !**

---

## 🔑 Étape 2 : Obtenir vos identifiants

### **1. Account SID et Auth Token**

Après connexion, vous êtes sur le **Dashboard** :

```
┌──────────────────────────────────────────┐
│ Twilio Dashboard                         │
├──────────────────────────────────────────┤
│ Account SID:                             │
│ ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx       │
│                                          │
│ Auth Token:      [Show]                  │
│ ********************************         │
└──────────────────────────────────────────┘
```

**Copiez ces deux valeurs !**

### **2. Numéro WhatsApp Sandbox (Pour débuter)**

1. Dans le menu gauche, cliquez sur **"Messaging"**
2. Cliquez sur **"Try it out"**
3. Sélectionnez **"Send a WhatsApp message"**
4. Vous voyez votre numéro Sandbox : `+1 415 523 8886`

### **3. Activer le Sandbox WhatsApp**

Pour tester, vous devez :

1. **Envoyer un message** depuis votre WhatsApp personnel au numéro : `+1 415 523 8886`
2. **Avec le texte** : `join <code>` (le code est affiché sur la page Twilio)
3. **Exemple** : `join yellow-tiger`
4. Vous recevez un message de confirmation ✅

**⚠️ Important :** Seuls les numéros qui ont rejoint le Sandbox peuvent recevoir des messages !

---

## ⚙️ Étape 3 : Configurer sur Render

1. **Allez sur** : [render.com](https://render.com)
2. **Connectez-vous** et sélectionnez votre service `ok-glacons-website`
3. **Cliquez sur** "Environment"
4. **Ajoutez** ces 3 variables d'environnement :

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxx<truncated />

