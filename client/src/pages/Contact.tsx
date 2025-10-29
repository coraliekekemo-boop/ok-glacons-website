import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ShoppingCart, MessageCircle, Facebook } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Contact() {
  const phoneNumber = "+2250748330051";
  const whatsappNumber = "2250748330051";
  const facebookUrl = "https://www.facebook.com/OKglacons/?locale=fr_FR";

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

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
              >
                <Phone className="w-8 h-8" />
              </motion.div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contactez-Nous
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Notre équipe à Abidjan est à votre disposition 24/7 pour répondre à vos besoins
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

      {/* Contact Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            {/* Téléphone */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-blue-100">
                <CardHeader className="text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">Téléphone</CardTitle>
                  <CardDescription className="text-sm mb-4">
                    Appelez-nous directement
                  </CardDescription>
                  <div className="pt-2">
                    <a 
                      href={`tel:${phoneNumber}`}
                      className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors block"
                    >
                      +225 07 48 33 00 51
                    </a>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="lg"
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-semibold"
                      onClick={() => window.location.href = `tel:${phoneNumber}`}
                    >
                      <Phone className="w-4 h-4" />
                      Appeler
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-green-100">
                <CardHeader className="text-center">
                  <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">WhatsApp</CardTitle>
                  <CardDescription className="text-sm mb-4">
                    Commandez via WhatsApp
                  </CardDescription>
                  <div className="pt-2">
                    <a 
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors block"
                    >
                      +225 07 48 33 00 51
                    </a>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="lg"
                      className="w-full gap-2 bg-green-600 hover:bg-green-700 h-12 rounded-xl font-semibold"
                      onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Facebook */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-blue-200">
                <CardHeader className="text-center">
                  <div className="bg-[#1877F2] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Facebook className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">Facebook</CardTitle>
                  <CardDescription className="text-sm mb-4">
                    Suivez-nous sur Facebook
                  </CardDescription>
                  <div className="pt-2">
                    <a 
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-[#1877F2] hover:text-blue-700 transition-colors block"
                    >
                      @OKglacons
                    </a>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="lg"
                      className="w-full gap-2 bg-[#1877F2] hover:bg-blue-700 h-12 rounded-xl font-semibold"
                      onClick={() => window.open(facebookUrl, '_blank')}
                    >
                      <Facebook className="w-4 h-4" />
                      Suivre
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Adresse */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-orange-100">
                <CardHeader className="text-center">
                  <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">Adresse</CardTitle>
                  <CardDescription className="text-sm mb-4">
                    Notre siège à Abidjan
                  </CardDescription>
                  <div className="pt-2">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong className="text-base">Coradis - OK Glaçons</strong><br />
                      Abidjan<br />
                      Côte d'Ivoire
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          {/* Hours & Quick Order */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Horaires</CardTitle>
                      <CardDescription className="text-base">Service disponible</CardDescription>
                    </div>
                  </div>
                  <div className="space-y-3 text-slate-700">
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-semibold">Service Client</span>
                      <span className="text-blue-600 font-bold text-lg">24/7</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-semibold">Livraisons</span>
                      <span className="text-blue-600 font-bold text-lg">24/7</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-semibold">Bureaux</span>
                      <span>Lun-Ven : 8h-18h</span>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mt-4">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        <strong className="text-blue-600 text-base">Urgences ?</strong> Notre service de livraison 
                        fonctionne 24h/24 et 7j/7 pour répondre à tous vos besoins à Abidjan.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <ShoppingCart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">Commande Rapide</CardTitle>
                      <CardDescription className="text-blue-100 text-base">Contactez-nous maintenant</CardDescription>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-blue-50 leading-relaxed text-base">
                      Besoin de glace ou de mouchoirs rapidement ? Contactez-nous par téléphone, 
                      WhatsApp ou Facebook pour une commande express.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2 border border-white/20">
                      <p className="text-sm font-semibold">Pour votre commande, précisez :</p>
                      <ul className="text-sm space-y-1.5 text-blue-100">
                        <li>• Type de produit (OK Glaçons ou Lanaïa)</li>
                        <li>• Quantité nécessaire</li>
                        <li>• Date et heure de livraison</li>
                        <li>• Adresse de livraison à Abidjan</li>
                      </ul>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                      <Button 
                        size="lg"
                        className="w-full gap-3 bg-white text-blue-600 hover:bg-blue-50 h-14 rounded-xl font-bold shadow-lg"
                        onClick={() => window.location.href = `tel:${phoneNumber}`}
                      >
                        <Phone className="w-5 h-5" />
                        Appeler pour commander
                      </Button>
                      <Button 
                        size="lg"
                        className="w-full gap-3 bg-green-600 hover:bg-green-700 h-14 rounded-xl font-bold shadow-lg"
                        onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
                      >
                        <MessageCircle className="w-5 h-5" />
                        Commander sur WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Zones de Livraison
            </h2>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed font-light">
              Nous livrons partout à Abidjan et ses environs
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border-2 border-slate-200 hover:border-blue-300 transition-all">
                <div className="text-4xl font-bold text-blue-600 mb-3">Abidjan Nord</div>
                <p className="text-slate-600 font-medium">Yopougon, Abobo...</p>
                <p className="text-sm text-slate-500 mt-3">Livraison express</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border-2 border-blue-300 hover:border-blue-400 transition-all shadow-lg">
                <div className="text-4xl font-bold text-blue-600 mb-3">Centre</div>
                <p className="text-slate-600 font-medium">Plateau, Cocody...</p>
                <p className="text-sm text-slate-500 mt-3">Livraison express</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border-2 border-slate-200 hover:border-blue-300 transition-all">
                <div className="text-4xl font-bold text-blue-600 mb-3">Abidjan Sud</div>
                <p className="text-slate-600 font-medium">Marcory, Koumassi...</p>
                <p className="text-sm text-slate-500 mt-3">Livraison express</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
