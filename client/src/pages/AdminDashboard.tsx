import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, RefreshCw, Trash2 } from "lucide-react";

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

  const handleDeleteOrder = async (orderId: number) => {
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

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
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
