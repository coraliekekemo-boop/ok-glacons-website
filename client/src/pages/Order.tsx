import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Calendar, Clock, User, Phone, MapPin, Send, PackageX, Gift } from "lucide-react";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Order() {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { data: customerAuth } = trpc.customers.checkAuth.useQuery();
  const { data: discountData } = trpc.customers.getAvailableDiscount.useQuery(undefined, {
    enabled: customerAuth?.isAuthenticated,
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    isToday: "non",
    notes: ""
  });

  // Calculer le prix final avec réduction
  const basePrice = getTotalPrice();
  const discount = discountData?.hasDiscount ? discountData.discount : 0;
  const discountAmount = Math.floor(basePrice * (discount / 100));
  const finalPrice = basePrice - discountAmount;

  // Pré-remplir le formulaire si le client est connecté
  useEffect(() => {
    if (customerAuth?.isAuthenticated && customerAuth.customer) {
      setFormData(prev => ({
        ...prev,
        name: customerAuth.customer.name || "",
        phone: customerAuth.customer.phone || "",
      }));
    }
  }, [customerAuth]);

  useEffect(() => {
    // Redirect to cart if empty
    if (cart.length === 0) {
      setLocation("/panier");
    }
  }, [cart.length, setLocation]);

  // Create order mutation
  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success("Commande enregistrée avec succès ! Numéro: #" + data.orderId);
      clearCart();
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    },
    onError: (error) => {
      toast.error("Erreur lors de l'enregistrement: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare order data
    createOrderMutation.mutate({
      customerName: formData.name,
      customerPhone: formData.phone,
      deliveryAddress: formData.address,
      deliveryDate: formData.deliveryDate,
      isUrgent: formData.isToday === "oui",
      notes: formData.notes || undefined,
      items: cart.map(item => ({
        productName: item.product.name,
        productUnit: item.product.unit,
        quantity: item.quantity,
        pricePerUnit: item.product.price,
      })),
      totalPrice: finalPrice, // Envoyer le prix final (avec réduction si applicable)
      customerId: customerAuth?.isAuthenticated ? customerAuth.customer.id : undefined, // Associer au client si connecté
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <PackageX className="w-24 h-24 mx-auto text-slate-300 mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Votre panier est vide</h1>
          <p className="text-lg text-slate-600 mb-8">
            Ajoutez des produits avant de passer commande
          </p>
          <Link href="/produits">
            <Button size="lg" className="gap-3 bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="w-5 h-5" />
              Voir nos produits
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
              >
                <ShoppingCart className="w-12 h-12" />
              </motion.div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Finaliser la commande
            </h1>
            <p className="text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''} - {getTotalPrice().toLocaleString()} FCFA
            </p>
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Order Form */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-24"
              >
                <Card className="p-6 border-2 border-green-100 bg-gradient-to-br from-white to-green-50/30">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Votre commande</h2>
                  
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="pb-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {item.quantity} × {item.product.price.toLocaleString()}F
                        </p>
                        <p className="text-sm font-bold text-green-600 mt-1">
                          {(item.product.price * item.quantity).toLocaleString()} FCFA
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-green-200 pt-4 space-y-2">
                    {discountData?.hasDiscount && (
                      <>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Sous-total</span>
                          <span>{basePrice.toLocaleString()} F</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-green-600">
                          <span>Réduction fidélité (-{discount}%)</span>
                          <span>-{discountAmount.toLocaleString()} F</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2"></div>
                      </>
                    )}
                    <div className="flex justify-between text-2xl font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-green-600">
                        {finalPrice.toLocaleString()} F
                      </span>
                    </div>
                  </div>

                  <Link href="/panier">
                    <Button variant="outline" className="w-full mt-4">
                      Modifier le panier
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                {/* Discount Banner */}
                {discountData?.hasDiscount && (
                  <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <div className="flex items-center gap-3">
                      <Gift className="w-8 h-8" />
                      <div>
                        <h3 className="font-bold text-lg mb-1">{discountData.reason}</h3>
                        <p className="text-sm opacity-90">Vous économisez {discountAmount.toLocaleString()} FCFA sur cette commande</p>
                      </div>
                    </div>
                  </Card>
                )}

                <Card className="p-8 lg:p-12 shadow-2xl border-2 border-green-100">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Informations client */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <User className="w-6 h-6 text-green-600" />
                        Vos informations
                      </h2>

                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Votre nom"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+225 XX XX XX XX XX"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse de livraison *</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Indiquez votre adresse complète à Abidjan"
                          required
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>

                    {/* Livraison */}
                    <div className="space-y-6 pt-6 border-t-2 border-slate-100">
                      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-green-600" />
                        Livraison
                      </h2>

                      <div className="space-y-2">
                        <Label htmlFor="deliveryDate">Date de livraison souhaitée *</Label>
                        <Input
                          id="deliveryDate"
                          name="deliveryDate"
                          type="date"
                          value={formData.deliveryDate}
                          onChange={handleChange}
                          required
                          className="h-12"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          Avez-vous besoin de la livraison aujourd'hui ? *
                        </Label>
                        <RadioGroup
                          name="isToday"
                          value={formData.isToday}
                          onValueChange={(value) => setFormData({ ...formData, isToday: value })}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oui" id="today-yes" />
                            <Label htmlFor="today-yes" className="cursor-pointer font-normal">
                              Oui, c'est urgent
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="non" id="today-no" />
                            <Label htmlFor="today-no" className="cursor-pointer font-normal">
                              Non, pas urgent
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Des précisions sur votre commande..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={createOrderMutation.isPending}
                        className="w-full gap-3 h-16 text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-xl rounded-2xl"
                      >
                        {createOrderMutation.isPending ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Enregistrement en cours...
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6" />
                            Confirmer la commande
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-slate-500 text-center mt-4">
                        Votre commande sera enregistrée et traitée par notre équipe
                      </p>
                    </div>
                  </form>
                </Card>

                {/* Info Card */}
                <Card className="mt-8 p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
                  <div className="flex gap-4">
                    <div className="bg-green-600 text-white p-3 rounded-xl h-fit">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Zone de livraison</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Nous livrons partout à Abidjan. Pour les commandes urgentes (aujourd'hui), 
                        veuillez nous contacter avant 14h pour garantir la livraison le jour même.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
