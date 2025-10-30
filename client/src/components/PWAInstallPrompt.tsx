import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Interface pour l'événement d'installation PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Vérifier si c'est iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iOS);

    // Vérifier si l'app est déjà installée (mode standalone)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Sur iOS, afficher le prompt après 5 secondes (pas d'événement beforeinstallprompt)
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    // Écouter l'événement beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Attendre 5 secondes avant d'afficher le prompt
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Afficher le prompt natif
    deferredPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response: ${outcome}`);

    // Réinitialiser
    setDeferredPrompt(null);
    setShowPrompt(false);

    // Sauvegarder la décision pour ne plus afficher le prompt
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
    } else {
      localStorage.setItem('pwa-dismissed', 'true');
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  // Ne pas afficher si :
  // - Déjà en mode standalone (installé)
  // - Pas de prompt disponible
  // - L'utilisateur a déjà décidé
  if (isStandalone || !showPrompt) return null;
  if (localStorage.getItem('pwa-installed') || localStorage.getItem('pwa-dismissed')) return null;

  // Prompt spécial pour iOS
  if (isIOS) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <Card className="p-6 shadow-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Installer Coradis sur votre iPhone
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Ajoutez Coradis à votre écran d'accueil pour un accès rapide et une meilleure expérience !
                </p>
                <div className="bg-blue-100 p-3 rounded-lg text-xs text-slate-700 space-y-1">
                  <p>📱 Appuyez sur le bouton <strong>Partager</strong></p>
                  <p>➕ Puis <strong>"Sur l'écran d'accueil"</strong></p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Prompt standard pour Android/Chrome
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <Card className="p-6 shadow-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl shadow-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Installer l'application Coradis
              </h3>
              <p className="text-sm text-slate-600">
                Ajoutez Coradis à votre écran d'accueil pour commander plus rapidement et recevoir des notifications exclusives !
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Installer
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="px-4"
            >
              Plus tard
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

