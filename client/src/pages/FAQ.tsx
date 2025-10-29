import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Phone, Mail, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const faqs = [
  {
    category: "Produits",
    questions: [
      {
        q: "Quelle est la qualité de la glace OK Glaçons ?",
        a: "Notre glace est 100% alimentaire, fabriquée à partir d'eau potable traitée et conforme aux normes d'hygiène en vigueur. Elle est parfaite pour la consommation humaine et la conservation des aliments."
      },
      {
        q: "Combien de temps la glace reste-t-elle froide ?",
        a: "Dans des conditions normales (sacs isothermes ou glacières), notre glace peut rester froide pendant 6 à 12 heures. Pour une conservation optimale, nous recommandons de la garder dans un congélateur jusqu'à utilisation."
      },
      {
        q: "Quelles sont les tailles disponibles pour les mouchoirs Lanaïa ?",
        a: "Lanaïa est disponible en plusieurs formats : mouchoirs de poche (10 paquets), boîtes de mouchoirs (100 feuilles), et formats professionnels pour restaurants et hôtels."
      },
      {
        q: "Qu'est-ce que les verres de glaçons ?",
        a: "C'est notre innovation ! Des gobelets entièrement en glace que vous pouvez utiliser pour servir vos boissons. Une expérience unique qui impressionne vos invités et maintient vos boissons fraîches naturellement."
      }
    ]
  },
  {
    category: "Livraison",
    questions: [
      {
        q: "Livrez-vous le weekend ?",
        a: "Oui ! Nous assurons les livraisons 7j/7, y compris les weekends et jours fériés. Notre service est disponible 24/7 pour répondre à tous vos besoins."
      },
      {
        q: "Quels sont les frais de livraison ?",
        a: "Les frais varient selon la zone : Zone 1 (Plateau, Cocody) : 1000 FCFA · Zone 2 (Yopougon, Abobo) : 1500 FCFA · Zone 3 (Bingerville, Anyama) : 2000 FCFA. Livraison GRATUITE pour les commandes supérieures à 15 000 FCFA."
      },
      {
        q: "Acceptez-vous les commandes de dernière minute ?",
        a: "Absolument ! Nous proposons même un service de livraison express (1-2h) moyennant un supplément de 500 FCFA. Parfait pour les urgences !"
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Vous recevrez des notifications SMS à chaque étape : confirmation de commande, départ du livreur, et arrivée imminente (10 minutes avant). Vous pouvez également appeler notre service client."
      }
    ]
  },
  {
    category: "Paiement",
    questions: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons : Paiement à la livraison (Cash), Orange Money, MTN Mobile Money, Moov Money, et Virement bancaire pour les grosses commandes."
      },
      {
        q: "Proposez-vous des remises pour les grosses commandes ?",
        a: "Oui ! Remises progressives : > 50 kg de glace : -15% · Commandes mensuelles : Tarif professionnel · Abonnements réguliers : Jusqu'à -20%"
      },
      {
        q: "Puis-je payer en plusieurs fois ?",
        a: "Pour les commandes B2B (entreprises, restaurants, hôtels), nous proposons des facilités de paiement et une facturation mensuelle avec crédit 30 jours après validation du dossier."
      }
    ]
  },
  {
    category: "Services B2B",
    questions: [
      {
        q: "Proposez-vous des contrats pour les entreprises ?",
        a: "Oui ! Nous avons des offres spéciales pour les restaurants, hôtels, bars, maquis, supermarchés et entreprises. Contactez-nous pour un devis personnalisé."
      },
      {
        q: "Faites-vous des gobelets personnalisés avec logo ?",
        a: "Oui ! Nous pouvons imprimer votre logo sur les gobelets. Minimum de commande : 1000 pièces. Délai : 2 semaines. Parfait pour les événements et la promotion de votre marque !"
      },
      {
        q: "Livrez-vous pour les événements (mariages, anniversaires) ?",
        a: "Bien sûr ! Nous proposons des packs événementiels incluant glace, gobelets, et mouchoirs. Service de livraison et installation sur site disponible. Contactez-nous pour un devis."
      }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  // Filter FAQs based on search term
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Questions Fréquentes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto"
          >
            Trouvez rapidement les réponses à vos questions
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <Input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-16 text-lg rounded-2xl bg-white/95 border-0 shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="h-10 w-2 bg-blue-600 rounded-full" />
                  {category.category}
                </h2>

                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const faqId = `${catIndex}-${index}`;
                    const isOpen = openIndex === faqId;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl shadow-md overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : faqId)}
                          className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-lg font-semibold text-slate-900 pr-8">
                            {faq.q}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-6 h-6 text-blue-600 flex-shrink-0" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 text-slate-700 text-lg leading-relaxed">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-slate-500 mb-6">
                Aucune question trouvée pour "{searchTerm}"
              </p>
              <Button
                onClick={() => setSearchTerm("")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Réinitialiser la recherche
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Notre équipe est là pour vous aider
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="https://wa.me/2250748330051"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">WhatsApp</h3>
              <p className="text-slate-600 text-sm">Réponse immédiate</p>
            </a>

            <a
              href="tel:+2250748330051"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Téléphone</h3>
              <p className="text-slate-600 text-sm">+225 07 48 33 00 51</p>
            </a>

            <Link href="/contact">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Email</h3>
                <p className="text-slate-600 text-sm">Formulaire de contact</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

