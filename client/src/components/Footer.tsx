import { Clock, Phone, MessageCircle, Facebook } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 py-16 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <img 
              src="/logo-ok-glacons.png" 
              alt="OK Glaçons" 
              className="h-14 w-auto mb-5 brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <p className="text-sm text-slate-400 leading-relaxed">
              Coradis - Distributeur de produits essentiels : <span className="text-blue-400 font-semibold">OK Glaçons</span> (glace alimentaire) et <span className="text-green-400 font-semibold">Lanaïa</span> (mouchoirs premium).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 text-lg">Produits</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-blue-400 font-bold text-base mt-2">OK Glaçons</li>
              <li><Link href="/produits"><a className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Verres de Glaçons</a></Link></li>
              <li><Link href="/produits"><a className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Glaçons & Blocs</a></Link></li>
              <li className="text-green-400 font-bold text-base mt-4">Lanaïa</li>
              <li><Link href="/produits"><a className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Mouchoirs Tubes</a></Link></li>
              <li><Link href="/produits"><a className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Mouchoirs Paquets</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 text-lg">Entreprise</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/a-propos"><a className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ À Propos</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Contact</a></Link></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Nos Valeurs</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">→ Carrières</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 text-lg">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="tel:+2250748330051" 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>+225 07 48 33 00 51</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/2250748330051" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/OKglacons/?locale=fr_FR" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Facebook className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>@OKglacons</span>
                </a>
              </li>
              <li className="text-slate-300 mt-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Service 24/7 à Abidjan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-slate-400 text-sm mb-2">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Coradis</span> - OK Glaçons & Lanaïa. Tous droits réservés.
          </p>
          <p className="text-slate-500 text-xs">
            Abidjan, Côte d'Ivoire 🇨🇮
          </p>
        </div>
      </div>
    </footer>
  );
}

