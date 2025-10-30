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
import { Badge } from "@/components/ui/badge";
import { User, Lock, Phone, Mail, MapPin, Gift, LogIn, UserPlus, Award, Star, Heart, ShieldCheck, Send, Check } from "lucide-react";

export default function CustomerAuth() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    referralCode: "",
  });
  
  // États pour la vérification OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  const loginMutation = trpc.customers.login.useMutation();
  const registerMutation = trpc.customers.register.useMutation();
  const useReferralMutation = trpc.customers.useReferralCode.useMutation();
  const sendOTPMutation = trpc.otp.sendOTP.useMutation();
  const verifyOTPMutation = trpc.otp.verifyOTP.useMutation();
  const deleteOTPMutation = trpc.otp.deleteOTP.useMutation();

  // Envoyer le code OTP
  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length < 8) {
      toast.error("Veuillez entrer un numéro de téléphone valide");
      return;
    }

    try {
      const result = await sendOTPMutation.mutateAsync({ phone: formData.phone });
      setOtpSent(true);
      
      // En mode développement, afficher le code
      if (result.devCode) {
        setDevOtpCode(result.devCode);
        toast.success(`📱 Code envoyé ! (DEV: ${result.devCode})`);
      } else {
        toast.success("📱 Code envoyé par WhatsApp ! Vérifiez vos messages.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi du code");
    }
  };

  // Vérifier le code OTP
  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error("Le code doit contenir 6 chiffres");
      return;
    }

    try {
      await verifyOTPMutation.mutateAsync({
        phone: formData.phone,
        code: otpCode,
      });
      setPhoneVerified(true);
      toast.success("✅ Numéro vérifié avec succès !");
    } catch (error: any) {
      toast.error(error.message || "Code invalide ou expiré");
    }
  };

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
        // Validations pour l'inscription
        if (!phoneVerified) {
          toast.error("Veuillez vérifier votre numéro de téléphone avec le code OTP");
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error("Les mots de passe ne correspondent pas");
          return;
        }

        if (formData.password.length < 6) {
          toast.error("Le mot de passe doit contenir au moins 6 caractères");
          return;
        }

        await registerMutation.mutateAsync({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          password: formData.password,
          address: formData.address || undefined,
        });
        
        // Supprimer l'OTP après création du compte
        await deleteOTPMutation.mutateAsync({ phone: formData.phone });
        
        toast.success("✨ Compte créé avec succès ! Bienvenue dans la famille Coradis !");
        
        // Si un code de parrainage a été saisi, l'appliquer
        if (formData.referralCode.trim()) {
          try {
            await useReferralMutation.mutateAsync({ 
              referralCode: formData.referralCode.trim() 
            });
            toast.success("🎁 Code de parrainage validé ! Votre parrain recevra son ticket après votre première livraison.");
          } catch (error: any) {
            toast.error("Erreur avec le code de parrainage : " + error.message);
          }
        }
        
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
              <Badge className="bg-white/20 backdrop-blur px-6 py-3 text-base font-medium border-white/30">
                <Award className="w-5 h-5 mr-2" />
                Points de fidélité
              </Badge>
              <Badge className="bg-white/20 backdrop-blur px-6 py-3 text-base font-medium border-white/30">
                <Gift className="w-5 h-5 mr-2" />
                Récompenses
              </Badge>
              <Badge className="bg-white/20 backdrop-blur px-6 py-3 text-base font-medium border-white/30">
                <Heart className="w-5 h-5 mr-2" />
                Commandes favorites
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 shadow-2xl border-2 border-slate-100">
                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setOtpSent(false);
                      setPhoneVerified(false);
                      setOtpCode("");
                    }}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                      isLogin
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <LogIn className="w-5 h-5 inline mr-2" />
                    Se connecter
                  </button>
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setOtpSent(false);
                      setPhoneVerified(false);
                      setOtpCode("");
                    }}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                      !isLogin
                        ? "bg-purple-600 text-white shadow-lg scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <UserPlus className="w-5 h-5 inline mr-2" />
                    S'inscrire
                  </button>
                </div>

                {/* Form */}
                <AnimatePresence mode="wait">
                  <motion.form
                    key={isLogin ? "login" : "register"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
                            placeholder="Jean Kouassi"
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
                          disabled={!isLogin && phoneVerified}
                        />
                        {!isLogin && phoneVerified && (
                          <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      
                      {/* Vérification OTP pour inscription */}
                      {!isLogin && !phoneVerified && (
                        <div className="mt-3 space-y-3">
                          {!otpSent ? (
                            <Button
                              type="button"
                              onClick={handleSendOTP}
                              variant="outline"
                              className="w-full border-2 border-blue-200 hover:bg-blue-50"
                              disabled={sendOTPMutation.isPending || !formData.phone}
                            >
                              {sendOTPMutation.isPending ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Envoi en cours...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Envoyer le code de vérification
                                </>
                              )}
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                                <p className="text-sm font-semibold text-blue-900 mb-2">
                                  📱 Code envoyé par WhatsApp !
                                </p>
                                <p className="text-xs text-blue-700">
                                  Vérifiez vos messages WhatsApp et entrez le code à 6 chiffres
                                </p>
                                {devOtpCode && (
                                  <p className="text-xs font-mono bg-yellow-100 p-2 rounded mt-2 text-center">
                                    DEV CODE: <strong>{devOtpCode}</strong>
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  placeholder="Code à 6 chiffres"
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  maxLength={6}
                                  className="flex-1 text-center text-lg font-mono tracking-widest"
                                />
                                <Button
                                  type="button"
                                  onClick={handleVerifyOTP}
                                  disabled={verifyOTPMutation.isPending || otpCode.length !== 6}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {verifyOTPMutation.isPending ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <>
                                      <ShieldCheck className="w-4 h-4 mr-1" />
                                      Vérifier
                                    </>
                                  )}
                                </Button>
                              </div>
                              
                              <Button
                                type="button"
                                onClick={handleSendOTP}
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs"
                                disabled={sendOTPMutation.isPending}
                              >
                                Renvoyer le code
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!isLogin && phoneVerified && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600 font-semibold">
                          <Check className="w-4 h-4" />
                          Numéro vérifié
                        </div>
                      )}
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
                      {!isLogin && (
                        <p className="text-xs text-slate-500 mt-1">
                          Minimum 6 caractères
                        </p>
                      )}
                    </div>

                    {!isLogin && (
                      <>
                        <div>
                          <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              className="pl-10"
                              required
                            />
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                              <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                            )}
                          </div>
                          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">
                              ❌ Les mots de passe ne correspondent pas
                            </p>
                          )}
                          {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <p className="text-xs text-green-600 mt-1">
                              ✅ Les mots de passe correspondent
                            </p>
                          )}
                        </div>

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
                            🎁 Le parrain recevra un ticket à gratter lors de votre première livraison !
                          </p>
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      className={`w-full h-12 text-lg font-bold ${
                        isLogin
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                      disabled={
                        loginMutation.isPending || 
                        registerMutation.isPending ||
                        (!isLogin && !phoneVerified)
                      }
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
                        <p className="text-slate-600 text-sm">
                          Tickets à gratter, réductions, et cadeaux surprises pour nos clients fidèles !
                        </p>
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
                          Sauvegardez vos commandes favorites et recommandez en un clic !
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
                          Suivez vos commandes, vos économies et votre progression vers le statut VIP !
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Trust Banner */}
                <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold mb-1">+500 clients</p>
                      <p className="text-sm opacity-75">nous font confiance</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
