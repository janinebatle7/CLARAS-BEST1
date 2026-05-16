import { useState } from 'react';
import { Star, ShoppingCart, Search } from 'lucide-react';
import { useStore } from '../hooks/useStore';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }

export default function MenuPage({ onNavigate, onNotify, onRequireLogin }: P) {
  const store = useStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const cats = ['All', ...store.categories];
  const filtered = store.allProducts.filter(p => (filter === 'All' || p.category === filter) && (search === '' || p.name.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Kakanin Menu</h1>
        <p className="text-gray-500 mt-1 text-sm">Browse our complete selection of delicacies</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search kakanin..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-maroon outline-none" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === c ? 'bg-maroon text-white' : 'bg-cream text-gray-700 hover:bg-cream-dark'}`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-cream-dark group">
            <div className="aspect-square overflow-hidden relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {p.stock <= 0 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">OUT OF STOCK</span></div>}
              {p.stock > 0 && p.stock < 10 && <span className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">LOW</span>}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-900">{p.name}</h3>
              <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{p.description}</p>
              <p className="text-maroon font-bold mt-1">₱{p.price.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-0.5"><Star size={11} className="text-yellow-500 fill-yellow-500" /><span className="text-[11px] text-gray-500">{p.rating} ({p.reviews})</span></div>
              <button onClick={() => { if (!store.currentUser) { onRequireLogin(); return; } const ok = store.addToCart(p); ok ? onNotify(`${p.name} added!`) : onNotify('Out of stock!'); }}
                disabled={p.stock <= 0} className={`w-full mt-2 text-xs py-2 rounded-lg font-medium transition-colors ${p.stock <= 0 ? 'bg-gray-200 text-gray-400' : 'bg-maroon text-white hover:bg-maroon-dark'}`}>
                {p.stock <= 0 ? 'UNAVAILABLE' : 'ADD TO CART'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No products found.</p>}
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
