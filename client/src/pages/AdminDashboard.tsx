import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  RefreshCw, 
  Trash2, 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle,
  DollarSign,
  Users,
  Calendar
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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  
  const { data: authData, isLoading: isLoadingAuth } = trpc.adminAuth.checkAuth.useQuery();
  const { data: ordersData, isLoading: isLoadingOrders, refetch } = trpc.orders.getAll.useQuery();
  const logoutMutation = trpc.adminAuth.logout.useMutation();
  const deleteOrderMutation = trpc.orders.delete.useMutation();
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();

  useEffect(() => {
    if (!isLoadingAuth && !authData?.isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [authData, isLoadingAuth, setLocation]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Déconnexion réussie");
      setLocation("/admin/login");
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      return;
    }
    
    try {
      await deleteOrderMutation.mutateAsync({ orderId });
      toast.success("Commande supprimée");
      refetch();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
      toast.success("Statut mis à jour");
      refetch();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    }
  };

  if (isLoadingAuth || isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authData?.isAuthenticated) {
    return null;
  }

  // Calculate statistics
  const stats = useMemo(() => {
    if (!ordersData) return null;

    const totalRevenue = ordersData.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter((o: any) => o.status === "pending").length;
    const deliveredOrders = ordersData.filter((o: any) => o.status === "delivered").length;
    const urgentOrders = ordersData.filter((o: any) => o.isUrgent === 1 || o.isUrgent === true).length;
    
    // Get unique customers
    const uniqueCustomers = new Set(ordersData.map((o: any) => o.customerPhone)).size;
    
    // Calculate today's orders
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = ordersData.filter((o: any) => {
      if (!o.createdAt) return false;
      const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
      return orderDate === today;
    }).length;

    // Average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      urgentOrders,
      uniqueCustomers,
      todaysOrders,
      averageOrderValue
    };
  }, [ordersData]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-4">Tableau de bord Admin</h1>
          <p className="text-xl">Gestion des commandes Coradis</p>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Chiffre d'affaires</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {stats.totalRevenue.toLocaleString()} F
                    </h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-blue-100 text-sm">
                  Moyenne: {stats.averageOrderValue.toLocaleString()} F
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Commandes</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {stats.totalOrders}
                    </h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-green-100 text-sm">
                  Livrées: {stats.deliveredOrders}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">En attente</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {stats.pendingOrders}
                    </h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-yellow-100 text-sm">
                  Urgent: {stats.urgentOrders}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Aujourd'hui</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {stats.todaysOrders}
                    </h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-purple-100 text-sm">
                  Clients: {stats.uniqueCustomers}
                </p>
              </Card>
            </motion.div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Commandes ({ordersData?.length || 0})
          </h2>
          <div className="flex gap-4">
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2 text-red-600 border-red-200">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {ordersData && ordersData.length > 0 ? (
          <div className="space-y-4">
            {ordersData.map((order: any) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Commande #{order.id}
                      {order.isUrgent === 1 && (
                        <Badge variant="destructive" className="ml-2">URGENT</Badge>
                      )}
                    </h3>
                    <p className="text-slate-600">{order.customerName} - {order.customerPhone}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Livraison: {order.deliveryDate}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>

                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold mb-2">Produits:</h4>
                  <ul className="space-y-1">
                    {order.items?.map((item: any, idx: number) => (
                      <li key={idx} className="text-sm text-slate-600">
                        {item.quantity}x {item.productName} - {item.totalPrice.toLocaleString()} FCFA
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4 mb-4">
                  <p className="font-bold text-lg">
                    Total: {order.totalPrice.toLocaleString()} FCFA
                  </p>
                  {order.notes && (
                    <p className="text-sm text-slate-600 mt-2">
                      <strong>Notes:</strong> {order.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="in_delivery">En livraison</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-slate-500 text-lg">Aucune commande pour le moment</p>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
