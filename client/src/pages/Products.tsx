import { motion } from "framer-motion";
import { Snowflake, Package, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Products() {
  const categories = [
    {
      id: "ok-glacons",
      name: "OK Glaçons",
      icon: <Snowflake className="w-16 h-16" />,
      description: "Glace alimentaire premium pour tous vos besoins",
      longDescription: "Découvrez notre gamme complète de produits de glace : verres de glaçons innovants, glaçons traditionnels, blocs de glace et glace carbonique.",
      image: "/product-cup.jpg",
      color: "blue",
      products: ["Verres de Glaçons", "Glaçons", "Blocs de Glace", "Glace Carbonique"],
      badge: "NOUVEAU : Verres de Glaçons"
    },
    {
      id: "lanaia",
      name: "Lanaïa",
      icon: <Package className="w-16 h-16" />,
      description: "Mouchoirs de qualité premium",
      longDescription: "Nos mouchoirs Lanaïa sont disponibles en plusieurs formats pour s'adapter à tous vos besoins : tubes pratiques en 5 couleurs, paquets familiaux et formats individuels.",
      image: "/ImageLanaia1.jpg",
      color: "green",
      products: ["Tubes (5 couleurs)", "Paquets", "Formats Individuels"],
      badge: "5 couleurs disponibles"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-32 px-4 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Decorative geometric shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-xl rotate-12"></div>
          <div className="absolute top-20 right-40 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 border-2 border-white rounded-lg -rotate-6"></div>
          <div className="absolute bottom-32 right-20 w-14 h-14 border-2 border-white rounded-full"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Icons decoration */}
            <div className="flex justify-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
              >
                <Snowflake className="w-8 h-8" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
              >
                <Package className="w-8 h-8" />
              </motion.div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nos Produits
            </h1>
            <p className="text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
              Choisissez votre gamme
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

      {/* Categories Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Deux gammes d'excellence
            </h2>
            <p className="text-2xl text-slate-500 max-w-3xl mx-auto font-light">
              Découvrez nos produits premium
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Link href={`/produits/${category.id}`}>
                  <a className="block group">
                    <div className={`relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border-2 ${
                      category.color === 'blue' 
                        ? 'border-blue-100 hover:border-blue-300' 
                        : 'border-green-100 hover:border-green-300'
                    }`}>
                      {/* Badge */}
                      {category.badge && (
                        <div className={`absolute top-6 right-6 ${
                          category.color === 'blue' ? 'bg-blue-600' : 'bg-green-600'
                        } text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10`}>
                          {category.badge}
                        </div>
                      )}

                      {/* Image Section */}
                      <div className="relative h-72 lg:h-96 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                        {category.image ? (
                          <img 
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            category.color === 'blue' ? 'bg-blue-50' : 'bg-green-50'
                          }`}>
                            <div className={`${
                              category.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                            } transform scale-150`}>
                              {category.icon}
                            </div>
                          </div>
                        )}
                        
                        {/* Icon Overlay - Plus subtil */}
                        <div className={`absolute bottom-6 left-6 ${
                          category.color === 'blue' ? 'bg-white' : 'bg-white'
                        } p-3 rounded-xl shadow-lg z-20`}>
                          <div className={`${
                            category.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                          }`}>
                            {category.icon}
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-10 bg-white">
                        <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {category.name}
                        </h3>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                          {category.description}
                        </p>

                        {/* Products List - Plus épuré */}
                        <div className="mb-8">
                          <div className="flex flex-wrap gap-3">
                            {category.products.map((product, idx) => (
                              <span 
                                key={idx}
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                  category.color === 'blue'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-green-50 text-green-700 border border-green-200'
                                }`}
                              >
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTA Button - Plus simple */}
                        <Button 
                          size="lg"
                          className={`w-full gap-3 h-16 font-bold text-base shadow-md hover:shadow-lg transition-all rounded-2xl ${
                            category.color === 'blue'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          Voir tous les produits
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-50 to-white p-12 rounded-3xl border-2 border-slate-200">
              <h3 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Une question ?
              </h3>
              <p className="text-xl text-slate-600 mb-8">
                Notre équipe est là pour vous accompagner
              </p>
              <Link href="/contact">
                <Button size="lg" className="gap-3 h-16 px-10 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg rounded-2xl">
                  Contactez-nous
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
