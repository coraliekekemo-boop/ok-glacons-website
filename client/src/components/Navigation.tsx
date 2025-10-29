import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, ShoppingCart, Menu, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";

export default function Navigation() {
  const [location] = useLocation();
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();
  const { data: customerAuth } = trpc.customers.checkAuth.useQuery();

  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Produits", path: "/produits" },
    { label: "À propos", path: "/a-propos" },
    { label: "Contact", path: "/contact" }
  ];

  // Fonction pour vérifier si un lien est actif
  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="flex items-center gap-3">
                <img 
                  src="/logo-coradis.png" 
                  alt="Coradis Logo" 
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </a>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a 
                    className={`relative px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                      isActive(item.path)
                        ? 'text-blue-600 bg-blue-50 font-semibold' 
                        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                    {isActive(item.path) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full"></span>
                    )}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact">
              <Button variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                Appeler
              </Button>
            </Link>
            <Link href="/panier">
              <Button variant="outline" className="gap-2 relative">
                <ShoppingCart className="w-4 h-4" />
                Panier
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center bg-red-500 hover:bg-red-600 text-xs px-1.5">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
            {customerAuth?.isAuthenticated ? (
              <Link href="/mon-espace">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  Mon Espace
                </Button>
              </Link>
            ) : (
              <Link href="/connexion-client">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  Connexion
                </Button>
              </Link>
            )}
            <Link href="/commander">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                Commander
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-slate-300">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              {/* Logo in mobile menu */}
              <div className="flex items-center justify-center py-6 border-b border-slate-200">
                <img 
                  src="/logo-coradis.png" 
                  alt="Coradis" 
                  className="h-14 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item, index) => (
                  <Link key={item.path} href={item.path}>
                    <a 
                      className={`group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className={`w-1.5 h-8 rounded-full transition-colors ${
                        isActive(item.path) ? 'bg-blue-600' : 'bg-transparent group-hover:bg-slate-300'
                      }`}></div>
                      <span className="text-lg">{item.label}</span>
                    </a>
                  </Link>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="absolute bottom-8 left-4 right-4 flex flex-col gap-3 pt-6 border-t border-slate-200">
                <Link href="/contact">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full gap-3 border-2 hover:bg-slate-50 h-14 text-base font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    Appeler maintenant
                  </Button>
                </Link>
                <Link href="/panier">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full gap-3 border-2 hover:bg-slate-50 h-14 text-base font-semibold relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Mon Panier
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 right-4 h-6 min-w-6 flex items-center justify-center bg-red-500 hover:bg-red-600">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                {customerAuth?.isAuthenticated ? (
                  <Link href="/mon-espace">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="w-full gap-3 border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 h-14 text-base font-semibold"
                    >
                      <User className="w-5 h-5" />
                      Mon Espace
                    </Button>
                  </Link>
                ) : (
                  <Link href="/connexion-client">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="w-full gap-3 border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 h-14 text-base font-semibold"
                    >
                      <User className="w-5 h-5" />
                      Connexion
                    </Button>
                  </Link>
                )}
                <Link href="/commander">
                  <Button 
                    size="lg"
                    className="w-full gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-14 text-base font-semibold shadow-lg shadow-blue-600/30"
                  >
                    Commander
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

