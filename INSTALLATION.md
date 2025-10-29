# 🚀 Installation du site Coradis - OK Glaçons & Lanaïa

## ✅ Prérequis

- Node.js (version 18 ou supérieure)
- npm ou pnpm

## 📦 Installation

### 1. Installer les dépendances

```bash
npx pnpm install
```

### 2. Configuration de la base de données

Le projet utilise **SQLite** (aucune installation requise !). Tout est stocké dans un fichier local `local.db`.

#### Initialiser la base de données :

```bash
npx pnpm db:init
```

#### Créer un compte administrateur :

```bash
npx pnpm db:admin
```

Cela créera un compte avec :
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin123`
- **Email** : `admin@coradis.ci`

⚠️ **IMPORTANT** : Changez ce mot de passe après la première connexion !

### 3. Démarrer le serveur

```bash
npx pnpm dev
```

Le site sera accessible sur : **http://localhost:3000**

## 🔑 Accès au tableau de bord admin

Allez sur : **http://localhost:3000/admin/login**

Utilisez les identifiants créés à l'étape 2.

## 📝 Commandes utiles

| Commande | Description |
|----------|-------------|
| `npx pnpm dev` | Démarre le serveur de développement |
| `npx pnpm build` | Compile le projet pour la production |
| `npx pnpm start` | Démarre le serveur en mode production |
| `npx pnpm db:init` | Initialise la base de données |
| `npx pnpm db:admin` | Crée un nouveau compte administrateur |
| `npx pnpm db:generate` | Génère de nouvelles migrations |

## 🌐 Déploiement

Le fichier `.env` actuel utilise SQLite local. Pour le déploiement en production, vous pouvez :

1. **Continuer avec SQLite** : Assurez-vous que le fichier `local.db` est persistant
2. **Utiliser Turso** (SQLite hébergé gratuit) :
   - Créez un compte sur https://turso.tech
   - Créez une base de données
   - Modifiez `DATABASE_URL` dans `.env` avec l'URL Turso fournie

## 📱 Structure du site

- **Page d'accueil** : `/`
- **Produits** : `/produits`
- **À propos** : `/a-propos`
- **Contact** : `/contact`
- **Panier** : `/panier`
- **Commander** : `/commander`
- **Admin Login** : `/admin/login`
- **Admin Dashboard** : `/admin/dashboard`

## 🛍️ Fonctionnalités

✅ Catalogue de produits (OK Glaçons & Lanaïa)  
✅ Panier d'achat  
✅ Système de commande  
✅ Tableau de bord administrateur  
✅ Gestion des commandes  
✅ Design responsive (mobile & desktop)

## 🆘 Problèmes courants

### Le serveur ne démarre pas
- Vérifiez que le port 3000 est disponible
- Essayez de changer le port dans `.env` : `PORT=3001`

### Erreur de base de données
- Supprimez le fichier `local.db` et relancez `npx pnpm db:init`

### Mot de passe administrateur oublié
- Supprimez le fichier `local.db`
- Relancez `npx pnpm db:init` puis `npx pnpm db:admin`

## 📞 Contact

Pour toute question ou support, contactez l'équipe Coradis :
- **Téléphone** : +225 0748330051
- **Facebook** : https://www.facebook.com/OKglacons/
- **Adresse** : Cocody Angré, Abidjan, Côte d'Ivoire

