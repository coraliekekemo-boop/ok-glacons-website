import { Button } from "@/components/ui/button";
import { Phone, ShoppingCart, Menu } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Produits", path: "/produits" },
    { label: "À propos", path: "/a-propos" },
    { label: "Contact", path: "/contact" }
  ];

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
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a 
                    className={`text-slate-700 hover:text-blue-600 transition-colors font-medium ${
                      location === item.path ? 'text-blue-600 font-semibold' : ''
                    }`}
                  >
                    {item.label}
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
            <Link href="/contact">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4" />
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
                        location === item.path 
                          ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className={`w-1.5 h-8 rounded-full transition-colors ${
                        location === item.path ? 'bg-blue-600' : 'bg-transparent group-hover:bg-slate-300'
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
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="w-full gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-14 text-base font-semibold shadow-lg shadow-blue-600/30"
                  >
                    <ShoppingCart className="w-5 h-5" />
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

