import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Award,
  ShoppingCart,
  TrendingUp,
  Gift,
  Star,
  Heart,
  RefreshCw,
  Copy,
  Calendar,
  Clock,
  Sparkles,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "in_delivery" | "delivered" | "cancelled";

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-blue-500";
    case "in_delivery":
      return "bg-purple-500";
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusLabel = (status: OrderStatus) => {
  const labels = {
    pending: "En attente",
    confirmed: "Confirmée",
    in_delivery: "En livraison",
    delivered: "Livrée",
    cancelled: "Annulée",
  };
  return labels[status] || status;
};

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "favorites" | "recurring">("profile");

  const { data: authData, isLoading: isLoadingAuth } = trpc.customers.checkAuth.useQuery();
  const { data: profile, refetch: refetchProfile } = trpc.customers.getProfile.useQuery(undefined, {
    enabled: authData?.isAuthenticated,
  });
  const { data: orders, refetch: refetchOrders } = trpc.customers.getMyOrders.useQuery(undefined, {
    enabled: authData?.isAuthenticated,
  });
  const { data: favorites, refetch: refetchFavorites } = trpc.customers.getFavoriteOrders.useQuery(undefined, {
    enabled: authData?.isAuthenticated,
  });

  const logoutMutation = trpc.customers.logout.useMutation();
  const addFavoriteMutation = trpc.customers.addFavoriteOrder.useMutation();

  useEffect(() => {
    if (!isLoadingAuth && !authData?.isAuthenticated) {
      setLocation("/connexion-client");
    }
  }, [authData, isLoadingAuth, setLocation]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Déconnexion réussie");
      setLocation("/");
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  const handleAddFavorite = async (orderId: string) => {
    try {
      await addFavoriteMutation.mutateAsync({ orderId });
      toast.success("Commande ajoutée aux favoris");
      refetchFavorites();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  const copyReferralCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      toast.success("Code copié !");
    }
  };

  if (isLoadingAuth || !authData?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculer les statistiques
  const deliveredOrders = orders?.filter((o: any) => o.status === "delivered") || [];
  const totalSavings = profile ? Math.floor(profile.loyaltyPoints * 100) : 0; // Points * 100 = FCFA
  const nextReward = 10 - (profile?.totalOrders || 0) % 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navigation />

      {/* Hero Section - Version PRO */}
      <section className="pt-24 pb-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/10 backdrop-blur p-2 rounded-xl">
                  <User className="w-8 h-8" />
                </div>
                <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 px-3 py-1 text-sm font-bold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Membre VIP
                </Badge>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bienvenue, {profile?.name} !
              </h1>
              <p className="text-xl opacity-90 max-w-2xl">
                Gérez vos commandes, suivez vos points et profitez d'avantages exclusifs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-3"
            >
              <Button
                onClick={() => setLocation("/produits")}
                className="gap-2 bg-white text-blue-600 hover:bg-blue-50 h-12 px-6 font-semibold shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Commander
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur h-12 px-6 font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)"/>
          </svg>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4 -mt-16 relative z-10">
        {/* Stats Cards - Version PRO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className="p-7 bg-white border-2 border-yellow-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {profile?.loyaltyPoints || 0}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">points</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Points de Fidélité</h3>
                <p className="text-lg font-semibold text-yellow-600">{totalSavings.toLocaleString()} FCFA</p>
                <p className="text-xs text-slate-500 mt-1">Crédit disponible</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className="p-7 bg-white border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {profile?.totalOrders || 0}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">commandes</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Commandes Totales</h3>
                <p className="text-lg font-semibold text-blue-600">{deliveredOrders.length} livrées</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profile?.totalOrders ? Math.min((deliveredOrders.length / profile.totalOrders) * 100, 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className="p-7 bg-white border-2 border-green-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 p-3 rounded-2xl shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                      {(profile?.totalSpent || 0).toLocaleString()}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">FCFA</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Total Dépensé</h3>
                <p className="text-lg font-semibold text-green-600">Économisé: {totalSavings.toLocaleString()} F</p>
                <p className="text-xs text-slate-500 mt-1">Grâce à vos points</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className="p-7 bg-white border-2 border-pink-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-pink-500 to-red-600 p-3 rounded-2xl shadow-lg">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                      {nextReward}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">commandes</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Prochaine Récompense</h3>
                <p className="text-lg font-semibold text-pink-600">-10% de réduction</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((10 - nextReward) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Code de parrainage - Version PRO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 mb-12 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white shadow-2xl border-0 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 backdrop-blur p-3 rounded-2xl">
                    <Gift className="w-8 h-8" />
                  </div>
                  <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 px-3 py-1 font-bold">
                    Offre Spéciale
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Parrainez vos amis !
                </h2>
                <p className="text-lg opacity-90 mb-4">
                  Vous et votre filleul recevez <span className="font-bold text-yellow-300">2000 FCFA de crédit</span> (20 points) chacun
                </p>
                <div className="flex items-center gap-2 text-sm opacity-75">
                  <Star className="w-4 h-4 fill-white" />
                  <span>Illimité • Instantané • Facile</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur p-6 rounded-3xl border-2 border-white/20">
                <p className="text-sm font-medium opacity-90">Votre code de parrainage</p>
                <div className="bg-white text-purple-600 px-8 py-4 rounded-2xl shadow-xl">
                  <span className="font-mono text-3xl font-bold tracking-wider">{profile?.referralCode || "------"}</span>
                </div>
                <Button
                  onClick={copyReferralCode}
                  className="gap-2 bg-white/20 backdrop-blur text-white hover:bg-white/30 border-2 border-white/30 w-full"
                >
                  <Copy className="w-4 h-4" />
                  Copier le code
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs - Version PRO */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 p-2 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Mon Profil</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Mes Commandes</span>
              <span className="sm:hidden">Commandes</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("favorites")}
              className={`px-6 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "favorites"
                  ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Favoris</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("recurring")}
              className={`px-6 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "recurring"
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden sm:inline">Abonnements</span>
              <span className="sm:hidden">Abos</span>
            </motion.button>
          </div>
        </div>

        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-xl border-2 border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Informations personnelles
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-2 border-blue-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-slate-500 font-medium">Nom complet</Label>
                        <p className="text-xl font-bold text-slate-900 mt-1">{profile?.name}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-2 border-green-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-slate-500 font-medium">Téléphone</Label>
                        <p className="text-xl font-bold text-slate-900 mt-1">{profile?.phone}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-2 border-purple-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-slate-500 font-medium">Email</Label>
                        <p className="text-xl font-bold text-slate-900 mt-1">{profile?.email || "Non renseigné"}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-2 border-orange-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-slate-500 font-medium">Adresse</Label>
                        <p className="text-xl font-bold text-slate-900 mt-1">{profile?.address || "Non renseignée"}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border-2 border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Membre depuis</h3>
                      <p className="text-sm text-slate-600">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("fr-FR", { 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        }) : "Date inconnue"}
                      </p>
                    </div>
                    <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-5 h-5" />
                      Membre VIP
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <Card key={order.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        Commande #{order.id.substring(0, 8)}
                        {order.isUrgent === 1 && (
                          <Badge variant="destructive" className="ml-2">URGENT</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")} - {order.deliveryDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      {order.loyaltyPointsEarned > 0 && (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          +{order.loyaltyPointsEarned} points
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold mb-2">Produits:</h4>
                    <ul className="space-y-1">
                      {order.items?.map((item: any, idx: number) => (
                        <li key={idx} className="text-sm text-slate-600">
                          {item.quantity}x {item.productName} ({item.productUnit}) - {item.totalPrice.toLocaleString()} FCFA
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <p className="font-bold text-lg">{order.totalPrice.toLocaleString()} FCFA</p>
                    {order.status === "delivered" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddFavorite(order.id)}
                        className="gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Ajouter aux favoris
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">Aucune commande pour le moment</p>
                <Button className="mt-4" onClick={() => setLocation("/produits")}>
                  Voir nos produits
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="space-y-4">
            {favorites && favorites.length > 0 ? (
              favorites.map((fav: any) => (
                <Card key={fav.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      Commande Favorite
                    </h3>
                    <Button size="sm">Commander à nouveau</Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Produits:</h4>
                    <ul className="space-y-1">
                      {fav.items?.map((item: any, idx: number) => (
                        <li key={idx} className="text-sm text-slate-600">
                          {item.quantity}x {item.productName} - {item.totalPrice.toLocaleString()} FCFA
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-slate-500 mt-2">
                      <strong>Adresse:</strong> {fav.deliveryAddress}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Heart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">Aucune commande favorite</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === "recurring" && (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Abonnements Récurrents</h3>
            <p className="text-slate-500 mb-6">
              Cette fonctionnalité sera bientôt disponible !
            </p>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Vous pourrez bientôt programmer des livraisons automatiques chaque semaine
              (ex: 2 sacs de glace tous les lundis)
            </p>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className || ""}`}>{children}</label>;
}

