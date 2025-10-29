# 🔥 Configuration Firebase

## ✅ Firebase est maintenant configuré !

Votre site utilise maintenant **Firebase Firestore** pour stocker les commandes et les comptes administrateurs.

---

## 📋 **Informations importantes**

### **Base de données : Firestore**
- **Projet** : `ok-glacons-website`
- **Collections** :
  - `orders` : Toutes les commandes clients
  - `admins` : Comptes administrateurs

### **Compte Admin par défaut**
- **Username** : `admin`
- **Password** : `admin123`
- **Email** : `admin@coradis.ci`

⚠️ **IMPORTANT** : Changez ce mot de passe dès que possible !

---

## 🚀 **Commandes**

### **1. Créer un compte admin**
```bash
npm run db:admin
```

### **2. Lancer le serveur local**
```bash
npm run dev
```

### **3. Accéder au site**
- **Site** : http://localhost:3000
- **Admin** : http://localhost:3000/admin/login

---

## 📊 **Voir vos données Firestore**

1. Allez sur : https://console.firebase.google.com/
2. Sélectionnez votre projet : **ok-glacons-website**
3. Menu de gauche → **Firestore Database**
4. Vous verrez toutes vos commandes en temps réel !

---

## 🌍 **Déploiement sur Render**

Pour que Firebase fonctionne sur Render, **AUCUNE configuration supplémentaire n'est nécessaire** !

Le code Firebase est déjà intégré et fonctionnera automatiquement en production.

---

## ✨ **Avantages de Firebase**

- ✅ **Gratuit** (jusqu'à 50K lectures/jour)
- ✅ **Temps réel** (les commandes apparaissent instantanément)
- ✅ **Zéro maintenance**
- ✅ **Interface web** pour voir les données
- ✅ **Fonctionne partout** (localhost, Render, etc.)

---

## 🔒 **Sécurité**

⚠️ **Pour la production, configurez les règles Firestore** :

1. Allez sur : https://console.firebase.google.com/
2. Sélectionnez votre projet
3. Menu → **Firestore Database** → **Règles**
4. Ajoutez ces règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tout le monde peut créer des commandes
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false; // Seulement via le backend
    }
    
    // Personne ne peut accéder directement aux admins
    match /admins/{adminId} {
      allow read, write: if false; // Seulement via le backend
    }
  }
}
```

---

## 📝 **Notes**

- Les données Firestore sont **permanentes** (ne seront jamais supprimées)
- Vous pouvez voir toutes les commandes dans la console Firebase
- Le système est **100% fonctionnel** localement et en production

