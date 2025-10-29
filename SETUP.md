# Configuration du système d'administration - OK Glaçons / Coradis

## 📋 Prérequis

- Node.js (v18+)
- MySQL database
- pnpm

## 🚀 Installation et Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
DATABASE_URL="mysql://user:password@localhost:3306/ok_glacons_db"
NODE_ENV="development"
PORT=3000
```

**Important :** Remplacez `user`, `password`, `localhost:3306` et `ok_glacons_db` par vos propres informations de connexion MySQL.

### 2. Installation des dépendances

```bash
npx pnpm install
```

### 3. Création de la base de données

Assurez-vous que votre base de données MySQL est créée :

```sql
CREATE DATABASE ok_glacons_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Génération et application des migrations

```bash
npx pnpm db:push
```

Cette commande va créer toutes les tables nécessaires :
- `admins` - Table des administrateurs
- `orders` - Table des commandes
- `orderItems` - Table des produits commandés
- `products` - Table des produits (optionnelle)
- `contactMessages` - Table des messages de contact

### 5. Création d'un compte administrateur

Exécutez le script de création d'admin :

```bash
npx tsx server/scripts/createAdmin.ts [username] [password] [email]
```

**Exemples :**

```bash
# Avec les valeurs par défaut (admin / admin123)
npx tsx server/scripts/createAdmin.ts

# Avec des valeurs personnalisées
npx tsx server/scripts/createAdmin.ts coradis_admin MotDePasse123 admin@coradis.ci
```

Notez les identifiants affichés !

### 6. Démarrage du serveur

```bash
npx pnpm dev
```

Le serveur démarre sur `http://localhost:3000`

## 🔐 Accès à l'administration

1. Ouvrez votre navigateur sur : `http://localhost:3000/admin/login`
2. Connectez-vous avec les identifiants créés à l'étape 5
3. Vous accédez au tableau de bord : `http://localhost:3000/admin/dashboard`

## 📊 Fonctionnalités du système

### Pour les clients

1. **Navigation** : Parcourir les produits (OK Glaçons et Lanaïa)
2. **Panier** : Ajouter des produits au panier avec quantités
3. **Commande** : Passer une commande avec :
   - Informations client (nom, téléphone, adresse)
   - Date de livraison souhaitée
   - Option "livraison urgente aujourd'hui"
   - Notes optionnelles
4. **Confirmation** : La commande est enregistrée dans la base de données

### Pour les administrateurs

1. **Authentification** : Connexion sécurisée avec session
2. **Dashboard** : Vue d'ensemble avec statistiques :
   - Total des commandes
   - Commandes en attente
   - Commandes en livraison
   - Commandes livrées
3. **Gestion des commandes** :
   - Liste complète de toutes les commandes
   - Détails de chaque commande (client, produits, montant)
   - Changement de statut :
     - En attente
     - Confirmée
     - En livraison
     - Livrée
     - Annulée
   - Suppression de commandes
4. **Déconnexion** : Bouton pour se déconnecter

## 🛠 Structure de la base de données

### Table `admins`
- `id` : ID auto-incrémenté
- `username` : Nom d'utilisateur (unique)
- `password` : Mot de passe hashé (bcrypt)
- `email` : Email de l'administrateur
- `createdAt` / `updatedAt` : Timestamps

### Table `orders`
- `id` : ID auto-incrémenté
- `customerName` : Nom du client
- `customerPhone` : Téléphone du client
- `deliveryAddress` : Adresse de livraison
- `deliveryDate` : Date de livraison souhaitée
- `isUrgent` : Livraison urgente (0/1)
- `totalPrice` : Prix total en FCFA
- `status` : Statut (pending, confirmed, in_delivery, delivered, cancelled)
- `notes` : Notes optionnelles
- `createdAt` / `updatedAt` : Timestamps

### Table `orderItems`
- `id` : ID auto-incrémenté
- `orderId` : ID de la commande
- `productName` : Nom du produit
- `productUnit` : Unité (tube, paquet, kg, etc.)
- `quantity` : Quantité commandée
- `pricePerUnit` : Prix unitaire en FCFA
- `totalPrice` : Prix total (quantity × pricePerUnit)
- `createdAt` : Timestamp

## 🎨 Produits disponibles

### OK Glaçons
- Verres de Glaçons : 500 FCFA / verre
- Glaçons (Sac 5kg) : 1000 FCFA / sac
- Blocs à l'ancienne : 100 FCFA / unité
- Glace Carbonique : 6000 FCFA / kg

### Lanaïa
- Mouchoirs Tubes : 1000 FCFA / tube
- Mouchoirs Paquets : 500 FCFA / paquet
- Mouchoirs Poches : 100 FCFA / poche

## 📞 Contact

- Téléphone / WhatsApp : +225 0748330051
- Facebook : https://www.facebook.com/OKglacons
- Adresse : Abidjan, Côte d'Ivoire

## 🚨 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les sessions admin sont sécurisées avec des cookies HTTP-only
- Les routes admin sont protégées par authentification
- HTTPS recommandé en production

## 📝 Notes importantes

1. **Production** : Changez tous les mots de passe par défaut
2. **Backup** : Sauvegardez régulièrement votre base de données
3. **HTTPS** : Utilisez HTTPS en production (certificat SSL)
4. **Variables d'env** : Ne commitez JAMAIS le fichier `.env`

