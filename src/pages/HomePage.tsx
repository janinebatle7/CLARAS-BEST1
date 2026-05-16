import { Heart, Star, ChevronRight, ShieldCheck, Truck, Clock, Leaf, ShoppingCart } from 'lucide-react';
import { useStore } from '../hooks/useStore';

interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }

export default function HomePage({ onNavigate, onNotify, onRequireLogin }: P) {
  const store = useStore();
  const bestSellers = store.allProducts.slice(0, 5);
  const categories = [
    { name: 'Rice Cakes', desc: 'Soft and fluffy favorites', img: '/images/cat-rice.jpg' },
    { name: 'Steamed Delicacies', desc: 'Classic steamed treats', img: '/images/cat-steamed.jpg' },
    { name: 'Glutinous Delicacies', desc: 'Chewy and delightful', img: '/images/kutsinta.jpg' },
    { name: 'Layered Delicacies', desc: 'Colorful and delicious', img: '/images/sapin-sapin.jpg' },
    { name: 'Baked Delicacies', desc: 'Rich and flavorful bakes', img: '/images/bibingka.jpg' },
  ];

  const handleAction = (page: string) => {
    if (!store.currentUser && (page === 'order' || page === 'reservations')) { onRequireLogin(); return; }
    onNavigate(page);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-white/95 via-warm-white/75 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          <div className="max-w-lg">
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900 font-bold leading-tight">Authentic Pinoy<br />Kakanin Delicacies,</h1>
            <p className="font-serif text-3xl md:text-4xl text-maroon italic mt-1">Made with Love <Heart className="inline text-maroon" size={30} /></p>
            <p className="text-gray-600 mt-5 text-base">Enjoy your favorite Filipino rice delicacies.<br />Freshly made. Traditionally loved.</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <button onClick={() => onNavigate('menu')} className="bg-maroon text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-dark transition-colors shadow-lg">BROWSE MENU</button>
              <button onClick={() => handleAction('reservations')} className="flex items-center gap-1.5 border-2 border-maroon text-maroon px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon hover:text-white transition-colors">📅 MAKE A RESERVATION</button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-maroon" /><span className="w-2.5 h-2.5 rounded-full bg-gray-300" /><span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
          <button onClick={() => onNavigate('menu')} className="text-sm text-maroon font-medium hover:underline flex items-center gap-1">View All Menu <ChevronRight size={14} /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <button key={i} onClick={() => onNavigate('menu')} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-cream-dark">
              <div className="aspect-[4/3] overflow-hidden"><img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
              <div className="p-3 text-center">
                <p className="font-semibold text-sm text-gray-900">{cat.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{cat.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Best Sellers</h2>
          <button onClick={() => onNavigate('menu')} className="text-sm text-maroon font-medium hover:underline flex items-center gap-1">View All <ChevronRight size={14} /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {bestSellers.map(p => (
            <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-cream-dark group">
              <div className="aspect-square overflow-hidden relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {p.stock < 10 && p.stock > 0 && <span className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">LOW</span>}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900">{p.name}</h3>
                <p className="text-maroon font-bold text-base mt-0.5">₱{p.price.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs text-gray-600">{p.rating} ({p.reviews})</span>
                </div>
                <button onClick={() => {
                  if (!store.currentUser) { onRequireLogin(); return; }
                  const ok = store.addToCart(p);
                  if (ok) onNotify(`${p.name} added to cart!`); else onNotify('Out of stock!');
                }} className="w-full mt-2 border border-maroon text-maroon text-xs py-2 rounded-lg font-medium hover:bg-maroon hover:text-white transition-colors">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Leaf size={28} />, t: 'Authentic Recipes', d: 'Traditional flavors passed down through generations.' },
              { icon: <ShieldCheck size={28} />, t: 'Fresh & Quality', d: 'Made with premium ingredients for the best taste.' },
              { icon: <Clock size={28} />, t: 'Safe & Secure', d: 'Your payments and information are always protected.' },
              { icon: <Truck size={28} />, t: 'Fast & Reliable', d: 'Quick preparation and on-time pickup or delivery.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="text-maroon shrink-0 mt-0.5">{f.icon}</div>
                <div><p className="font-bold text-sm text-gray-900">{f.t}</p><p className="text-xs text-gray-500 mt-0.5">{f.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-maroon text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/images/logo.png" alt="" className="h-10 w-10 object-contain" />
                <div><p className="font-serif font-bold">CLARA'S BEST</p><p className="text-[9px] text-white/60 tracking-wider">KAKANIN DELICACIES</p></div>
              </div>
              <p className="text-xs text-white/70">Authentic Filipino kakanin made with love and tradition since generations.</p>
            </div>
            <div>
              <p className="font-bold text-sm mb-2">Quick Links</p>
              {['Home','Kakanin Menu','About Us','Contact Us'].map(l => (
                <button key={l} onClick={() => onNavigate(l.toLowerCase().replace(/ /g,'-').replace('kakanin-menu','menu').replace('about-us','about').replace('contact-us','contact'))} className="block text-xs text-white/70 hover:text-white py-0.5 transition-colors">{l}</button>
              ))}
            </div>
            <div>
              <p className="font-bold text-sm mb-2">Contact</p>
              <p className="text-xs text-white/70">{store.settings.address}</p>
              <p className="text-xs text-white/70 mt-1">{store.settings.phone}</p>
              <p className="text-xs text-white/70 mt-1">{store.settings.contactEmail}</p>
            </div>
            <div>
              <p className="font-bold text-sm mb-2">Follow Us</p>
              <p className="text-xs text-white/70">Facebook: {store.settings.facebook}</p>
              <p className="text-xs text-white/70 mt-2">{store.settings.hours}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-4 text-xs text-white/50">© 2025 Clara's Best Kakanin Delicacies. All Rights Reserved.</div>
      </footer>

      {store.cartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button onClick={() => onNavigate('cart')} className="bg-maroon text-white px-5 py-3 rounded-full shadow-2xl font-semibold flex items-center gap-2 hover:bg-maroon-dark transition-colors text-sm">
            <ShoppingCart size={16} /> Cart ({store.cartCount}) — ₱{store.cartTotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
