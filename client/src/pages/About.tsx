import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Award, Users, TrendingUp, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function About() {
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
                <Award className="w-8 h-8" />
              </motion.div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              À propos
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Leader ivoirien en distribution de glace alimentaire et de produits essentiels
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

      {/* Company Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Notre Histoire
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Coradis est une entreprise leader dans la distribution de produits essentiels. 
                Fondée avec la vision d'excellence et d'innovation, nous avons développé deux gammes de produits 
                complémentaires pour répondre aux besoins quotidiens de nos clients.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                <strong className="text-blue-600">OK Glaçons</strong>, notre gamme de glace alimentaire premium, 
                propose des solutions innovantes incluant les verres de glaçons révolutionnaires, des glaçons de qualité, 
                des blocs de glace et de la glace carbonique pour tous vos besoins professionnels et événementiels.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                <strong className="text-green-600">Lanaïa</strong>, notre marque de mouchoirs premium, offre une gamme 
                complète de formats (tubes, paquets, individuels) alliant douceur, résistance et praticité pour 
                accompagner votre quotidien.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Nous sommes fiers d'être le partenaire de confiance des hôtels, restaurants, événements, entreprises 
                et particuliers à travers tout le pays. Notre engagement : l'excellence dans chaque produit, la rapidité 
                de livraison et un service client irréprochable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                <CardHeader>
                  <Award className="w-10 h-10 mb-4" />
                  <CardTitle className="text-white text-2xl">Qualité Premium</CardTitle>
                  <CardDescription className="text-blue-100">
                    Excellence dans chaque produit livré
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
                <CardHeader>
                  <Users className="w-10 h-10 mb-4" />
                  <CardTitle className="text-white text-2xl">500+</CardTitle>
                  <CardDescription className="text-slate-300">
                    Clients satisfaits et fidèles
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
                <CardHeader>
                  <TrendingUp className="w-10 h-10 mb-4" />
                  <CardTitle className="text-white text-2xl">2 Gammes</CardTitle>
                  <CardDescription className="text-green-100">
                    OK Glaçons & Lanaïa pour tous vos besoins
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white border-0">
                <CardHeader>
                  <Clock className="w-10 h-10 mb-4" />
                  <CardTitle className="text-white text-2xl">24/7</CardTitle>
                  <CardDescription className="text-orange-100">
                    Service disponible à toute heure
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nos Valeurs
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Ce qui nous guide dans notre mission quotidienne
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Qualité",
                description: "Nous ne faisons aucun compromis sur la qualité de nos produits et services.",
                icon: <Award className="w-8 h-8" />
              },
              {
                title: "Innovation",
                description: "Nous innovons constamment pour offrir des solutions uniques à nos clients.",
                icon: <TrendingUp className="w-8 h-8" />
              },
              {
                title: "Fiabilité",
                description: "Un service disponible 24/7 et des livraisons toujours ponctuelles.",
                icon: <Clock className="w-8 h-8" />
              },
              {
                title: "Excellence",
                description: "L'excellence dans chaque aspect de notre travail, du produit au service client.",
                icon: <CheckCircle className="w-8 h-8" />
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{value.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nos Engagements
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              "Deux gammes premium : OK Glaçons et Lanaïa",
              "Qualité garantie et certifications professionnelles",
              "Livraison rapide et fiable 24/7 partout en France",
              "Service client réactif et personnalisé",
              "Innovation constante : verres de glaçons, mouchoirs en tube",
              "Respect des normes sanitaires et environnementales",
              "Prix compétitifs et transparents",
              "Solutions adaptées aux professionnels et particuliers",
              "Accompagnement et conseils d'experts"
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-slate-700 text-lg">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Prêt à travailler avec nous ?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Rejoignez les centaines d'entreprises qui nous font confiance pour leurs besoins en glace
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                  Contactez-nous
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/produits">
                <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-white/20 text-lg px-8">
                  Voir nos produits
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

