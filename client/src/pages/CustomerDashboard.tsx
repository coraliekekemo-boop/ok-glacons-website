import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold mb-2">Bienvenue, {profile?.name} !</h1>
              <p className="text-xl opacity-90">Votre espace personnel Coradis</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 text-white border-white hover:bg-white/10">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8" />
                <span className="text-3xl font-bold">{profile?.loyaltyPoints || 0}</span>
              </div>
              <h3 className="text-sm font-medium opacity-90">Points de Fidélité</h3>
              <p className="text-xs opacity-75 mt-1">{totalSavings.toLocaleString()} FCFA de crédit</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="w-8 h-8" />
                <span className="text-3xl font-bold">{profile?.totalOrders || 0}</span>
              </div>
              <h3 className="text-sm font-medium opacity-90">Commandes Totales</h3>
              <p className="text-xs opacity-75 mt-1">{deliveredOrders.length} livrées</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8" />
                <span className="text-3xl font-bold">{(profile?.totalSpent || 0).toLocaleString()}</span>
              </div>
              <h3 className="text-sm font-medium opacity-90">Total Dépensé (FCFA)</h3>
              <p className="text-xs opacity-75 mt-1">Économisé: {totalSavings.toLocaleString()} FCFA</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-pink-500 to-red-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <Gift className="w-8 h-8" />
                <span className="text-3xl font-bold">{nextReward}</span>
              </div>
              <h3 className="text-sm font-medium opacity-90">Prochaine Récompense</h3>
              <p className="text-xs opacity-75 mt-1">-10% sur votre commande</p>
            </Card>
          </motion.div>
        </div>

        {/* Code de parrainage */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Gift className="w-6 h-6" />
                Parrainez vos amis !
              </h3>
              <p className="text-sm opacity-90">
                Vous et votre filleul recevez 2000 FCFA de crédit (20 points) chacun
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-lg backdrop-blur">
              <span className="text-2xl font-bold tracking-wider">{profile?.referralCode}</span>
              <Button
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={copyReferralCode}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📊 Mon Profil
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "orders"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🛒 Mes Commandes
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "favorites"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ❤️ Favoris
          </button>
          <button
            onClick={() => setActiveTab("recurring")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "recurring"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🔄 Abonnements
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === "profile" && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-slate-600">Nom complet</Label>
                <p className="text-lg font-medium">{profile?.name}</p>
              </div>
              <div>
                <Label className="text-slate-600">Téléphone</Label>
                <p className="text-lg font-medium">{profile?.phone}</p>
              </div>
              <div>
                <Label className="text-slate-600">Email</Label>
                <p className="text-lg font-medium">{profile?.email || "Non renseigné"}</p>
              </div>
              <div>
                <Label className="text-slate-600">Adresse</Label>
                <p className="text-lg font-medium">{profile?.address || "Non renseignée"}</p>
              </div>
            </div>
          </Card>
        )}

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

