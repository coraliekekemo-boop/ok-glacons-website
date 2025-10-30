import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Lock, Phone, Mail, MapPin, Gift, LogIn, UserPlus, Award, Star, Heart } from "lucide-react";

export default function CustomerAuth() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    referralCode: "",
  });

  const loginMutation = trpc.customers.login.useMutation();
  const registerMutation = trpc.customers.register.useMutation();
  const useReferralMutation = trpc.customers.useReferralCode.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({
          phone: formData.phone,
          password: formData.password,
        });
        toast.success("🎉 Connexion réussie ! Bienvenue !");
        setLocation("/mon-espace");
      } else {
        await registerMutation.mutateAsync({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          password: formData.password,
          address: formData.address || undefined,
        });
        toast.success("✨ Compte créé avec succès ! Bienvenue dans la famille Coradis !");
        
        // Si un code de parrainage a été saisi, l'appliquer
        if (formData.referralCode.trim()) {
          console.log("[FRONTEND] Applying referral code:", formData.referralCode.trim());
          try {
            const result = await useReferralMutation.mutateAsync({ 
              referralCode: formData.referralCode.trim() 
            });
            console.log("[FRONTEND] Referral code applied successfully:", result);
            toast.success("🎁 Code de parrainage appliqué ! Découvrez votre ticket à gratter dans votre espace !");
          } catch (error: any) {
            console.error("[FRONTEND] Error applying referral code:", error);
            toast.error("Erreur avec le code de parrainage : " + error.message);
          }
        }
        
        // Petite pause pour que les tickets soient chargés
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLocation("/mon-espace");
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Rejoignez Coradis
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Profitez de récompenses exclusives et d'une expérience personnalisée
            </p>
            
            {/* Benefits Icons */}
            <div className="flex justify-center gap-8 flex-wrap">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full"
              >
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Points de fidélité</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full"
              >
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium">Récompenses</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full"
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Commandes favorites</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 shadow-2xl border-2 border-blue-100">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b-2">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 font-bold text-lg transition-all ${
                      isLogin
                        ? "text-blue-600 border-b-4 border-blue-600 -mb-0.5"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Se connecter
                    </div>
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 font-bold text-lg transition-all ${
                      !isLogin
                        ? "text-purple-600 border-b-4 border-purple-600 -mb-0.5"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      S'inscrire
                    </div>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.form
                    key={isLogin ? "login" : "register"}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Jean Dupont"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="phone">Numéro de téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0748330051"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="email">Email (optionnel)</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="jean@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse de livraison (optionnel)</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <Input
                          id="address"
                          type="text"
                          placeholder="Cocody, Riviera..."
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="referralCode">Code de parrainage (optionnel)</Label>
                    <div className="relative">
                      <Gift className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        id="referralCode"
                        type="text"
                        placeholder="ABC123"
                        value={formData.referralCode}
                        onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      🎁 Recevez un ticket à gratter pour gagner un cadeau surprise !
                    </p>
                  </div>
                )}

                    <Button
                      type="submit"
                      className={`w-full h-12 text-lg font-bold ${
                        isLogin
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                      disabled={loginMutation.isPending || registerMutation.isPending}
                    >
                      {loginMutation.isPending || registerMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Chargement...
                        </span>
                      ) : isLogin ? (
                        <span className="flex items-center gap-2">
                          <LogIn className="w-5 h-5" />
                          Se connecter
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <UserPlus className="w-5 h-5" />
                          Créer mon compte
                        </span>
                      )}
                    </Button>
                  </motion.form>
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* Right Side - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="sticky top-24">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  {isLogin ? "Bon retour !" : "Pourquoi nous rejoindre ?"}
                </h2>

                {/* Benefits Cards */}
                <div className="space-y-4">
                  <Card className="p-6 border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-500 text-white p-3 rounded-xl">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Points de Fidélité</h3>
                        <p className="text-slate-600 text-sm">
                          Gagnez 1 point pour chaque 100 FCFA dépensés. Utilisez vos points pour des réductions !
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-2 border-green-100 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500 text-white p-3 rounded-xl">
                        <Gift className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Récompenses Exclusives</h3>
                        <p className="text-slate-600 text-sm mb-2">
                          Profitez de réductions automatiques tous les 10 achats !
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            -10% / 10 commandes
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            🎁 Ticket à gratter
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 text-white p-3 rounded-xl">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Commandes Simplifiées</h3>
                        <p className="text-slate-600 text-sm">
                          Enregistrez vos commandes favorites et recommandez en 1 clic. Plus besoin de tout re-saisir !
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500 text-white p-3 rounded-xl">
                        <Star className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Historique & Statistiques</h3>
                        <p className="text-slate-600 text-sm">
                          Suivez toutes vos commandes, consultez vos statistiques et gérez vos points facilement.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Trust Banner */}
                <Card className="p-6 mt-6 bg-gradient-to-r from-slate-900 to-slate-700 text-white border-0">
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-2">Déjà membre de la famille Coradis</p>
                    <p className="text-3xl font-bold">+500 clients</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
