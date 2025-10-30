# 📱 Guide PWA - Coradis

## ✅ Ce qui a été ajouté

Votre site Coradis est maintenant une **Progressive Web App (PWA)** complète !

### Fichiers ajoutés :
```
✅ client/public/manifest.json      - Métadonnées de l'application
✅ client/public/sw.js               - Service Worker pour cache et mode hors-ligne
✅ client/src/components/PWAInstallPrompt.tsx  - Prompt d'installation élégant
✅ client/index.html                 - Meta tags PWA ajoutés
✅ client/src/main.tsx               - Enregistrement du Service Worker
✅ client/src/App.tsx                - Intégration du prompt d'installation
```

---

## 🎯 Fonctionnalités PWA Activées

### 1. **Installation sur l'écran d'accueil**
- Les visiteurs peuvent installer l'app comme une vraie application
- Icône "Coradis" sur l'écran d'accueil (mobile + desktop)
- Ouverture en plein écran (sans barre d'adresse du navigateur)

### 2. **Mode Hors-ligne**
- Pages principales mises en cache
- Fonctionne sans connexion internet (partiellement)
- Stratégie : Network First, fallback to Cache

### 3. **Notifications Push (prêt)**
- Infrastructure en place pour envoyer des notifications
- À activer quand nécessaire (promotions, nouvelles commandes, etc.)

### 4. **Performance Améliorée**
- Chargement plus rapide (mise en cache)
- Expérience fluide type "app native"

### 5. **Raccourcis Rapides**
- Raccourci vers "Commander"
- Raccourci vers "Mon Espace"
- Raccourci vers "Produits"

---

## 📱 Comment Installer (Pour les Clients)

### **Sur Android (Chrome, Firefox, Edge) :**
1. Visitez le site : https://votre-site.com
2. Un popup apparaît : "Installer l'application Coradis"
3. Cliquez sur **"Installer"**
4. L'icône Coradis apparaît sur l'écran d'accueil
5. Ouvrez l'app depuis l'icône !

**OU :**
1. Ouvrez le menu du navigateur (⋮)
2. Cliquez sur **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**

### **Sur iOS (Safari) :**
1. Visitez le site : https://votre-site.com
2. Cliquez sur le bouton **Partager** (icône carré avec flèche ↑)
3. Faites défiler vers le bas
4. Sélectionnez **"Sur l'écran d'accueil"**
5. Donnez un nom (Coradis) et cliquez sur **"Ajouter"**
6. L'icône Coradis apparaît sur l'écran d'accueil !

### **Sur Desktop (Chrome, Edge) :**
1. Visitez le site
2. Regardez la barre d'adresse, une icône ⊕ ou 💾 apparaît
3. Cliquez dessus
4. Cliquez sur **"Installer"**
5. L'app s'ouvre dans sa propre fenêtre !

---

## 🧪 Comment Tester Localement

### **1. Lancez le serveur de développement :**
```bash
npx pnpm dev
```

### **2. Ouvrez le navigateur :**
```
http://localhost:3000
```

### **3. Ouvrez les DevTools (F12) :**
- Onglet **Console** : Vérifiez le message `✅ [PWA] Service Worker enregistré avec succès`
- Onglet **Application** > **Service Workers** : Vérifiez que le SW est actif
- Onglet **Application** > **Manifest** : Vérifiez les métadonnées

### **4. Testez l'installation :**
- Sur Chrome : Menu (⋮) > "Installer Coradis"
- Ou attendez 5 secondes pour voir le popup automatique

### **5. Testez le mode hors-ligne :**
- Installez l'app
- Ouvrez les DevTools > **Network**
- Cochez **"Offline"**
- Naviguez sur le site → Les pages en cache fonctionnent !

---

## 🚀 Déploiement

Le site PWA est **automatiquement prêt** après le push sur GitHub :

```bash
git add .
git commit -m "Ajout de la PWA avec installation et mode hors-ligne"
git push origin main
```

Render va déployer et le site sera installable en tant qu'app !

---

## 🔧 Configuration Avancée

### **Changer la couleur du thème :**
Éditez `client/public/manifest.json` :
```json
"theme_color": "#2563eb"  ← Changez cette couleur
```

### **Changer les icônes :**
1. Créez des icônes PNG de 192x192 et 512x512
2. Placez-les dans `client/public/`
3. Mettez à jour `manifest.json` :
```json
"icons": [
  {
    "src": "/votre-icone-192.png",
    "sizes": "192x192",
    "type": "image/png"
  }
]
```

### **Modifier la stratégie de cache :**
Éditez `client/public/sw.js` :
- **Network First** (actuel) : Essaie internet d'abord, puis cache
- **Cache First** : Cache d'abord, puis internet (plus rapide mais moins à jour)
- **Stale While Revalidate** : Sert le cache et met à jour en arrière-plan

### **Ajouter des pages au cache :**
Éditez `client/public/sw.js` :
```javascript
const ASSETS_TO_CACHE = [
  '/',
  '/produits',
  '/contact',
  '/ma-nouvelle-page',  ← Ajoutez vos pages
];
```

---

## 📊 Statistiques PWA (À surveiller)

Après le déploiement, surveillez :

1. **Taux d'installation** : Combien de clients installent l'app ?
2. **Taux de rétention** : Combien reviennent via l'app installée ?
3. **Usage hors-ligne** : Combien utilisent l'app sans connexion ?

**Outils recommandés :**
- Google Analytics 4 (avec événements PWA)
- Lighthouse (score PWA dans Chrome DevTools)

---

## 🎁 Fonctionnalités Futures Possibles

### **Notifications Push :**
```javascript
// Backend : Envoyer une notification
await webpush.sendNotification(subscription, JSON.stringify({
  title: "🎉 Nouvelle promotion !",
  body: "Réduction de 20% sur les glaçons aujourd'hui !",
  icon: "/logo-coradis.png",
  url: "/produits/ok-glacons"
}));
```

### **Synchronisation en arrière-plan :**
- Envoyer les commandes quand la connexion revient
- Télécharger les nouvelles promotions automatiquement

### **Partage natif :**
```javascript
navigator.share({
  title: 'Coradis',
  text: 'Commandez vos glaçons en ligne !',
  url: 'https://coradis.com'
});
```

---

## ✅ Checklist de Vérification

Avant de déployer en production, vérifiez :

- [ ] Le Service Worker est enregistré (Console : `✅ [PWA] Service Worker enregistré`)
- [ ] Le manifest.json est accessible (`/manifest.json`)
- [ ] Les icônes sont correctes (192x192 et 512x512)
- [ ] Le popup d'installation apparaît après 5 secondes
- [ ] L'app s'installe correctement sur mobile
- [ ] Le mode hors-ligne fonctionne (pages principales)
- [ ] Le nom et la description sont corrects
- [ ] Les raccourcis fonctionnent

---

## 🆘 Problèmes Courants

### **Le Service Worker ne s'enregistre pas :**
- Vérifiez que le site est en HTTPS (obligatoire, sauf localhost)
- Vérifiez la console pour les erreurs
- Videz le cache du navigateur (Ctrl+Shift+R)

### **Le popup d'installation n'apparaît pas :**
- Attendez 5 secondes après le chargement
- Vérifiez localStorage : `localStorage.clear()` dans la console
- Sur iOS : Utilisez le bouton Partager (pas de popup automatique)

### **Le mode hors-ligne ne fonctionne pas :**
- Installez d'abord l'app
- Vérifiez que les pages sont dans `ASSETS_TO_CACHE`
- Ouvrez DevTools > Application > Cache Storage

### **L'icône ne s'affiche pas :**
- Vérifiez que l'icône existe dans `client/public/`
- Vérifiez le chemin dans `manifest.json`
- Désinstallez et réinstallez l'app

---

## 📚 Ressources

- [Documentation PWA de Google](https://web.dev/progressive-web-apps/)
- [Workbox (bibliothèque Service Worker)](https://developers.google.com/web/tools/workbox)
- [Can I Use - Service Workers](https://caniuse.com/serviceworkers)

---

**🎉 Félicitations ! Votre site est maintenant une PWA complète !**

Vos clients peuvent désormais installer Coradis comme une vraie application sur leur téléphone ! 📱✨

