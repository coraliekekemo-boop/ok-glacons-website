# 📋 Résumé de l'installation - Site Coradis

## ✅ Ce qui a été fait

### 1. Migration vers SQLite (solution simple, sans installation)
- ✅ Remplacement de MySQL par SQLite via `@libsql/client`
- ✅ Aucune installation de serveur de base de données requise
- ✅ Tout fonctionne avec un simple fichier `local.db`

### 2. Base de données initialisée
- ✅ Tables créées :
  - `users` - Utilisateurs OAuth
  - `admins` - Administrateurs du site
  - `orders` - Commandes clients
  - `orderItems` - Produits dans les commandes
  - `products` - Catalogue de produits
  - `contactMessages` - Messages de contact

### 3. Compte administrateur créé
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin123`
- **Email** : `admin@coradis.ci`

### 4. Scripts utiles ajoutés
```bash
# Initialiser la base de données
npx pnpm db:init

# Créer un compte admin
npx pnpm db:admin

# Démarrer le serveur
npx pnpm dev
```

## 🚀 Pour démarrer le site

1. **Ouvrez un terminal PowerShell** dans le dossier du projet :
   ```
   C:\Users\SCOLARITE\Downloads\ok_glacons_website
   ```

2. **Démarrez le serveur** :
   ```powershell
   npx pnpm dev
   ```

3. **Ouvrez votre navigateur** sur :
   - Site : http://localhost:3000
   - Admin : http://localhost:3000/admin/login

## 🔐 Connexion administrateur

Allez sur http://localhost:3000/admin/login et utilisez :
- **Nom d'utilisateur** : admin
- **Mot de passe** : admin123

## 📊 Tableau de bord admin

Une fois connecté, vous pourrez :
- ✅ Voir toutes les commandes
- ✅ Filtrer par statut (en attente, confirmée, en livraison, livrée, annulée)
- ✅ Mettre à jour le statut des commandes
- ✅ Supprimer des commandes
- ✅ Rechercher par nom, téléphone ou numéro de commande

## 🛍️ Fonctionnement du système de commande

1. **Client** : Navigue sur le site et ajoute des produits au panier
2. **Client** : Clique sur "Procéder à la commande"
3. **Client** : Remplit le formulaire (nom, téléphone, adresse, date de livraison)
4. **Client** : Confirme la commande
5. **Admin** : Reçoit la commande dans le tableau de bord
6. **Admin** : Peut changer le statut de la commande (confirmée → en livraison → livrée)

## 📝 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `.env` | Configuration (port, base de données) |
| `local.db` | Base de données SQLite |
| `INSTALLATION.md` | Guide d'installation complet |
| `server/initDb.ts` | Script d'initialisation de la BDD |
| `server/createAdmin.ts` | Script de création d'admin |

## 🌐 Structure des routes

### Pages publiques
- `/` - Accueil
- `/produits` - Liste des catégories
- `/produits/ok-glacons` - Détails OK Glaçons
- `/produits/lanaia` - Détails Lanaïa
- `/a-propos` - À propos de Coradis
- `/contact` - Informations de contact
- `/panier` - Panier d'achat
- `/commander` - Formulaire de commande

### Pages admin (nécessitent connexion)
- `/admin/login` - Page de connexion
- `/admin/dashboard` - Tableau de bord des commandes

## 🎨 Produits disponibles

### OK Glaçons
- Verres de Glaçons : 500 FCFA/verre
- Glaçons (Sac 5kg) : 1 000 FCFA/sac
- Blocs de Glace : 100 FCFA/unité
- Glace Carbonique : 6 000 FCFA/kg

### Lanaïa
- Mouchoirs - Tubes : 1 000 FCFA/tube
- Mouchoirs - Paquets : 500 FCFA/paquet
- Mouchoirs - Formats Individuels : 100 FCFA/poche

## ⚠️ Notes importantes

1. **Changez le mot de passe admin** dès la première connexion
2. **Le fichier `local.db`** contient toutes les données - **sauvegardez-le régulièrement**
3. **Pour la production**, envisagez Turso (SQLite hébergé gratuit)

## 🐛 En cas de problème

### Réinitialiser complètement la base de données
```powershell
# Supprimez le fichier de base de données
Remove-Item local.db

# Recréez les tables
npx pnpm db:init

# Recréez l'admin
npx pnpm db:admin
```

### Port 3000 déjà utilisé
Modifiez `.env` et changez :
```
PORT=3001
```

## 📞 Support

Coradis - OK Glaçons & Lanaïa  
📱 Téléphone : +225 0748330051  
📍 Adresse : Cocody Angré, Abidjan, Côte d'Ivoire  
🌐 Facebook : https://www.facebook.com/OKglacons/

