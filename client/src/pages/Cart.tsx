import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, PackageX } from "lucide-react";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setLocation("/commander");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
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
              Mon Panier
            </h1>
            <p className="text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              {getTotalItems()} article{getTotalItems() > 1 ? "s" : ""} dans votre panier
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

      {/* Cart Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <PackageX className="w-24 h-24 mx-auto text-slate-300 mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Votre panier est vide</h2>
              <p className="text-lg text-slate-600 mb-8">
                Ajoutez des produits pour commencer votre commande
              </p>
              <Link href="/produits">
                <Button size="lg" className="gap-3 bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="w-5 h-5" />
                  Voir nos produits
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-6">
                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {item.product.name}
                          </h3>
                          <p className="text-lg font-semibold text-blue-600">
                            {item.product.price.toLocaleString()} FCFA / {item.product.unit}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-10 w-10"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-xl font-bold w-12 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-10 w-10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Total & Delete */}
                        <div className="flex flex-col items-end gap-3">
                          <p className="text-2xl font-bold text-slate-900">
                            {(item.product.price * item.quantity).toLocaleString()} F
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Retirer
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {/* Clear Cart Button */}
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vider le panier
                </Button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="sticky top-24"
                >
                  <Card className="p-8 border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Résumé de la commande
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-slate-600">
                        <span>Articles ({getTotalItems()})</span>
                        <span className="font-semibold">
                          {getTotalPrice().toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="border-t-2 border-slate-200 pt-4">
                        <div className="flex justify-between text-2xl font-bold text-slate-900">
                          <span>Total</span>
                          <span className="text-blue-600">
                            {getTotalPrice().toLocaleString()} F
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      onClick={handleCheckout}
                      className="w-full gap-3 h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl rounded-2xl"
                    >
                      Commander
                      <ArrowRight className="w-6 h-6" />
                    </Button>

                    <Link href="/produits">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full gap-2 h-12 mt-4 font-semibold"
                      >
                        Continuer mes achats
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

