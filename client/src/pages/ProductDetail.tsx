import { motion } from "framer-motion";
import { Sparkles, Snowflake, Box, ChevronRight, ArrowLeft, ShoppingCart, Package, Heart, Plus, Minus } from "lucide-react";
import { Link, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart, products as cartProducts } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetail() {
  const [, params] = useRoute("/produits/:id");
  const categoryId = params?.id;
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Mapping between display names and cart product IDs
  const productMapping: Record<string, string> = {
    "Verres de Glaçons": "glacons-verres",
    "Glaçons": "glacons-5kg",
    "Blocs de Glace": "blocs-ancienne",
    "Glace Carbonique": "glace-carbonique",
    "Mouchoirs Lanaïa - Tubes": "lanaia-tubes",
    "Mouchoirs Lanaïa - Paquets": "lanaia-paquets",
    "Mouchoirs Lanaïa - Formats Individuels": "lanaia-poches"
  };

  const getQuantity = (productTitle: string) => quantities[productTitle] || 1;
  
  const updateQuantity = (productTitle: string, delta: number) => {
    const currentQty = getQuantity(productTitle);
    const newQty = Math.max(1, currentQty + delta);
    setQuantities({ ...quantities, [productTitle]: newQty });
  };

  const handleAddToCart = (productTitle: string) => {
    const productId = productMapping[productTitle];
    const cartProduct = cartProducts.find(p => p.id === productId);
    
    if (cartProduct) {
      const quantity = getQuantity(productTitle);
      addToCart(cartProduct, quantity);
      toast.success(`${quantity} ${cartProduct.name} ajouté${quantity > 1 ? 's' : ''} au panier !`);
    }
  };

  const productsData = {
    "ok-glacons": {
      name: "OK Glaçons",
      color: "blue",
      icon: <Snowflake className="w-8 h-8" />,
      products: [
        {
          icon: <Sparkles className="w-8 h-8" />,
          title: "Verres de Glaçons",
          description: "Notre innovation exclusive ! Des verres entièrement en glace pour une expérience unique et mémorable.",
          longDescription: "Parfaits pour les cocktails, événements premium, mariages et soirées d'entreprise. Chaque verre est sculpté avec précision pour offrir une expérience inoubliable à vos invités.",
          features: ["100% comestible", "Durée de vie optimale", "Design personnalisable", "Livraison sécurisée"],
          highlight: true,
          badge: "NOUVEAU",
          image: "/product-cup.jpg"
        },
        {
          icon: <Snowflake className="w-8 h-8" />,
          title: "Glaçons",
          description: "Glaçons de qualité premium, parfaits pour toutes vos boissons. Disponibles en différents formats.",
          longDescription: "Glaçons transparents et purs pour bars, restaurants, événements et usage domestique. Disponibles en sacs de différentes tailles.",
          features: ["Eau purifiée", "Transparence parfaite", "Sans goût ni odeur", "Plusieurs formats"],
          highlight: false,
          image: null
        },
        {
          icon: <Box className="w-8 h-8" />,
          title: "Blocs de Glace",
          description: "Blocs de glace massifs pour conservation longue durée. Idéal pour événements et professionnels.",
          longDescription: "Blocs de glace de 10kg à 50kg pour la conservation alimentaire, événements extérieurs et besoins industriels. Fonte lente garantie.",
          features: ["Longue durée", "Plusieurs tailles", "Usage professionnel", "Conservation optimale"],
          highlight: false,
          image: null
        },
        {
          icon: <Box className="w-8 h-8" />,
          title: "Glace Carbonique",
          description: "Glace sèche de haute qualité pour transport frigorifique et effets spéciaux spectaculaires.",
          longDescription: "CO2 solide à -78°C pour le transport de produits surgelés, effets spéciaux pour événements et nettoyage cryogénique.",
          features: ["Température -78°C", "Sans résidu", "Effets visuels", "Transport médical"],
          highlight: false,
          image: null
        }
      ]
    },
    "lanaia": {
      name: "Lanaïa",
      color: "green",
      icon: <Heart className="w-8 h-8" />,
      products: [
        {
          icon: <Package className="w-8 h-8" />,
          title: "Mouchoirs Lanaïa - Tubes",
          description: "Mouchoirs doux et résistants en tubes pratiques, disponibles en 5 couleurs élégantes.",
          longDescription: "Nos tubes de mouchoirs allient praticité et style. Format compact parfait pour sac à main, voiture ou bureau. Disponibles en 5 couleurs tendance.",
          features: ["Format compact", "Ultra-doux", "Résistants", "Design élégant"],
          highlight: true,
          image: "/ImageLanaia1.jpg",
          colors: ["Orange", "Bleu", "Noir", "Rose", "Vert"]
        },
        {
          icon: <Package className="w-8 h-8" />,
          title: "Mouchoirs Lanaïa - Paquets",
          description: "Paquets familiaux de mouchoirs de qualité premium. Idéal pour la maison.",
          longDescription: "Paquets économiques pour un usage quotidien à la maison. Douceur et résistance garanties pour toute la famille.",
          features: ["Format familial", "Économique", "Qualité premium", "Usage quotidien"],
          highlight: false,
          image: null
        },
        {
          icon: <Package className="w-8 h-8" />,
          title: "Mouchoirs Lanaïa - Formats Individuels",
          description: "Pochettes individuelles pratiques à emporter partout. Hygiène et confort garantis.",
          longDescription: "Pochettes individuelles parfaites pour les déplacements. Format poche ultra-pratique pour être toujours prêt.",
          features: ["Format poche", "Hygiénique", "Pratique", "Toujours à portée"],
          highlight: false,
          image: null
        }
      ]
    }
  };

  const categoryData = categoryId && productsData[categoryId as keyof typeof productsData];

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Catégorie non trouvée</h1>
          <Link href="/produits">
            <Button>Retour aux produits</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isBlue = categoryData.color === "blue";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className={`pt-24 pb-32 px-4 relative overflow-hidden min-h-[60vh] flex flex-col ${
        isBlue 
          ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900' 
          : 'bg-gradient-to-br from-green-600 via-green-700 to-green-900'
      } text-white`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-24 -right-24 w-96 h-96 ${isBlue ? 'bg-blue-500/20' : 'bg-green-500/20'} rounded-full blur-3xl`}></div>
          <div className={`absolute -bottom-32 -left-32 w-96 h-96 ${isBlue ? 'bg-blue-400/10' : 'bg-green-400/10'} rounded-full blur-3xl`}></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto relative z-10 flex-1 flex flex-col justify-center">
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Link href="/produits">
              <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
                Retour aux gammes
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
              >
                {categoryData.icon}
              </motion.div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Gamme {categoryData.name}
            </h1>
            <p className="text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
              {categoryData.products.length} produits disponibles
            </p>
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="space-y-16">
            {categoryData.products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                  product.highlight 
                    ? `border-2 ${isBlue ? 'border-blue-600 shadow-2xl bg-gradient-to-br from-white to-blue-50/30' : 'border-green-600 shadow-2xl bg-gradient-to-br from-white to-green-50/30'}` 
                    : 'shadow-lg border border-slate-200'
                }`}>
                  <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Image Section */}
                    <div className={`relative ${
                      product.image 
                        ? 'bg-gradient-to-br from-slate-50 to-slate-100' 
                        : `bg-gradient-to-br ${isBlue ? 'from-blue-50 to-blue-100' : 'from-green-50 to-green-100'}`
                    } flex items-center justify-center p-12 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      {product.badge && (
                        <div className={`absolute top-6 right-6 bg-gradient-to-r ${
                          isBlue ? 'from-blue-600 to-blue-700' : 'from-green-600 to-green-700'
                        } text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-xl z-10 animate-pulse`}>
                          {product.badge}
                        </div>
                      )}
                      {product.image ? (
                        <div className="relative group/img">
                          <div className={`absolute inset-0 bg-gradient-to-t ${
                            isBlue ? 'from-blue-600/20' : 'from-green-600/20'
                          } to-transparent rounded-2xl`}></div>
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-auto rounded-2xl shadow-2xl transform group-hover/img:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className={`bg-gradient-to-br ${
                          isBlue ? 'from-blue-200 to-blue-300' : 'from-green-200 to-green-300'
                        } shadow-xl w-56 h-56 rounded-3xl flex items-center justify-center ${
                          isBlue ? 'text-blue-600' : 'text-green-600'
                        } transform group-hover:rotate-6 transition-transform duration-300`}>
                          <div className="transform scale-150">
                            {product.icon}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''} bg-white`}>
                      <div className={`bg-gradient-to-br ${
                        isBlue ? 'from-blue-100 to-blue-50' : 'from-green-100 to-green-50'
                      } w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                        isBlue ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {product.icon}
                      </div>
                      
                      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.title}
                      </h2>
                      
                      <p className="text-lg text-slate-600 mb-3 leading-relaxed font-medium">
                        {product.description}
                      </p>
                      
                      <p className="text-base text-slate-500 mb-6 leading-relaxed">
                        {product.longDescription}
                      </p>

                      {/* Color badges for Lanaïa Tubes */}
                      {product.colors && (
                        <div className="mb-6">
                          <p className="text-sm font-semibold text-slate-700 mb-3">Couleurs disponibles :</p>
                          <div className="flex flex-wrap gap-2">
                            {product.colors.map((color, idx) => (
                              <div 
                                key={idx}
                                className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg transition-shadow ${
                                  color === 'Orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                  color === 'Bleu' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                  color === 'Noir' ? 'bg-gradient-to-r from-slate-800 to-slate-900' :
                                  color === 'Rose' ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                                  'bg-gradient-to-r from-green-500 to-green-600'
                                }`}
                              >
                                {color}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                              isBlue ? 'from-blue-600 to-blue-700' : 'from-green-600 to-green-700'
                            }`}></div>
                            <span className="text-sm text-slate-700 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price */}
                      {(() => {
                        const productId = productMapping[product.title];
                        const cartProduct = cartProducts.find(p => p.id === productId);
                        return cartProduct && (
                          <div className="mb-6">
                            <p className="text-3xl font-bold text-slate-900">
                              {cartProduct.price.toLocaleString()} FCFA
                              <span className="text-base text-slate-600 font-normal ml-2">/ {cartProduct.unit}</span>
                            </p>
                          </div>
                        );
                      })()}

                      <div className="flex flex-wrap gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 border-2 border-slate-200 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(product.title, -1)}
                            className="h-12 w-12"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-xl font-bold w-12 text-center">
                            {getQuantity(product.title)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(product.title, 1)}
                            className="h-12 w-12"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Add to Cart Button */}
                        <Button 
                          size="lg"
                          onClick={() => handleAddToCart(product.title)}
                          className={`gap-3 h-12 px-8 font-semibold shadow-lg bg-gradient-to-r ${
                            isBlue 
                              ? 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/30'
                              : 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-600/30'
                          }`}
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Ajouter au panier
                        </Button>
                        
                        <Link href="/contact">
                          <Button 
                            size="lg"
                            variant="outline"
                            className="gap-2 h-12 px-6 font-semibold"
                          >
                            Demander un devis
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

