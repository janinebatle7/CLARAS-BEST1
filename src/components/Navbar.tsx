import { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onShowLogin: () => void;
}

export default function Navbar({ currentPage, onNavigate, onShowLogin }: NavbarProps) {
  const store = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const quickLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Kakanin Menu', page: 'menu' },
    { name: 'About Us', page: 'about' },
    { name: 'Contact Us', page: 'contact' },
  ];
  const mobileLinks = [...quickLinks, { name: 'Reservations', page: 'reservations' }];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-8 min-w-0">
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
              <img src="/images/logo.png" alt="Clara's Best" className="h-12 w-12 object-contain" />
              <div className="hidden sm:block">
                <h1 className="font-serif text-maroon font-bold text-base leading-tight">CLARA'S BEST</h1>
                <p className="text-[9px] text-maroon-light tracking-[0.15em] font-medium -mt-0.5">KAKANIN DELICACIES</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-5">
              {quickLinks.map(link => (
                <button key={link.page} onClick={() => onNavigate(link.page)}
                  className={`text-sm font-medium transition-colors pb-0.5 whitespace-nowrap ${currentPage === link.page ? 'text-maroon border-b-2 border-maroon' : 'text-gray-600 hover:text-maroon'}`}>
                  {link.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('reservations')} className={`hidden lg:block text-sm font-medium transition-colors pb-0.5 ${currentPage === 'reservations' ? 'text-maroon border-b-2 border-maroon' : 'text-gray-600 hover:text-maroon'}`}>
              Reservations
            </button>
            <button onClick={() => onNavigate('cart')} className="relative p-2 text-gray-600 hover:text-maroon transition-colors">
              <ShoppingCart size={20} />
              {store.cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-maroon text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{store.cartCount}</span>
              )}
            </button>
            {store.currentUser ? (
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  if (store.currentUser?.role === 'admin') onNavigate('admin');
                  else if (store.currentUser?.role === 'staff') onNavigate('staff');
                  else onNavigate('dashboard');
                }} className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-maroon transition-colors">
                  <div className="w-7 h-7 rounded-full bg-maroon text-white flex items-center justify-center text-xs font-bold">
                    {store.currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block font-medium">{store.currentUser.name}</span>
                </button>
              </div>
            ) : (
              <button onClick={onShowLogin} className="flex items-center gap-1.5 bg-maroon text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-maroon-dark transition-colors">
                <User size={15} /> Login
              </button>
            )}
            <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-cream-dark shadow-lg animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {mobileLinks.map(link => (
              <button key={link.page} onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${currentPage === link.page ? 'bg-maroon text-white' : 'text-gray-600 hover:bg-cream'}`}>
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
