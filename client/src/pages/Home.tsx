import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ChevronRight,
  Phone,
  Award,
  Users,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 min-h-[85vh] flex items-center">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/logo-ok-glacons.png" 
                  alt="OK Glaçons" 
                  className="h-16 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h1 className="text-6xl lg:text-8xl font-bold text-slate-900 mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Distribution
                <span className="text-blue-600"> & Excellence</span>
              </h1>
              <p className="text-2xl lg:text-3xl text-slate-500 mb-12 leading-relaxed font-light">
                Vos produits essentiels livrés rapidement
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl">
                <strong className="text-blue-600 font-semibold">OK Glaçons</strong> pour la glace alimentaire · 
                <strong className="text-green-600 font-semibold"> Lanaïa</strong> pour les mouchoirs premium
              </p>
              <div className="flex flex-wrap gap-5">
                <Link href="/produits">
                  <Button 
                    size="lg" 
                    className="gap-3 bg-blue-600 hover:bg-blue-700 text-lg px-10 h-16 rounded-2xl font-bold shadow-lg"
                  >
                    Voir les produits
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-3 text-lg px-10 h-16 rounded-2xl font-bold border-2"
                  >
                    <Phone className="w-5 h-5" />
                    Contacter
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Award className="w-5 h-5" />
                    <span className="text-3xl font-bold">15+</span>
                  </div>
                  <p className="text-slate-600 text-sm">Années d'expertise</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Users className="w-5 h-5" />
                    <span className="text-3xl font-bold">500+</span>
                  </div>
                  <p className="text-slate-600 text-sm">Clients satisfaits</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-3xl font-bold">24/7</span>
                  </div>
                  <p className="text-slate-600 text-sm">Service disponible</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/product-cup.jpg" 
                  alt="Verres de Glaçons" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Nouveau !</h3>
                    <p className="text-sm text-slate-600">Verres de glaçons - L'innovation qui révolutionne vos événements</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pourquoi nous choisir ?
            </h2>
            <p className="text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-light">
              L'excellence au service de vos besoins
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              {
                title: "Deux Gammes Premium",
                description: "OK Glaçons pour la glace alimentaire et Lanaïa pour les mouchoirs de qualité.",
                icon: <Award className="w-10 h-10" />
              },
              {
                title: "Livraison Rapide",
                description: "Service de livraison 24/7 pour tous vos besoins.",
                icon: <TrendingUp className="w-10 h-10" />
              },
              {
                title: "Innovation",
                description: "Des produits innovants comme les verres de glaçons.",
                icon: <Sparkles className="w-10 h-10" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-3xl border-2 border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg"
              >
                <div className="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Link href="/produits">
              <Button size="lg" className="gap-3 bg-blue-600 hover:bg-blue-700 text-lg px-12 h-16 rounded-2xl font-bold shadow-lg">
                Découvrir nos produits
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
