import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Lock, Phone, Mail, MapPin, Gift } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({
          phone: formData.phone,
          password: formData.password,
        });
        toast.success("Connexion réussie !");
        setLocation("/mon-espace");
      } else {
        await registerMutation.mutateAsync({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          password: formData.password,
          address: formData.address || undefined,
        });
        toast.success("Compte créé avec succès !");
        
        // Si un code de parrainage a été saisi, l'appliquer
        if (formData.referralCode) {
          // On appliquera le code après la connexion automatique
          setLocation("/mon-espace");
        } else {
          setLocation("/mon-espace");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8">
              <h1 className="text-3xl font-bold text-center mb-2">
                {isLogin ? "Connexion" : "Créer un compte"}
              </h1>
              <p className="text-center text-slate-600 mb-8">
                {isLogin
                  ? "Connectez-vous pour accéder à votre espace"
                  : "Inscrivez-vous pour profiter de la fidélité"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      Recevez 2000 FCFA de crédit avec un code parrain
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending || registerMutation.isPending}
                >
                  {loginMutation.isPending || registerMutation.isPending
                    ? "Chargement..."
                    : isLogin
                    ? "Se connecter"
                    : "S'inscrire"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {isLogin
                    ? "Pas encore de compte ? S'inscrire"
                    : "Déjà un compte ? Se connecter"}
                </button>
              </div>

              {!isLogin && (
                <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Avantages de l'inscription
                  </h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✅ 1 point = 100 FCFA dépensés</li>
                    <li>✅ 10 commandes = -10% de réduction</li>
                    <li>✅ 2000 FCFA offerts avec le parrainage</li>
                    <li>✅ Commandes favorites</li>
                    <li>✅ Historique et statistiques</li>
                  </ul>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

