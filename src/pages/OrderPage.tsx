import { useStore } from '../hooks/useStore';
import { ShoppingCart } from 'lucide-react';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }
export default function OrderPage({ onNavigate, onNotify, onRequireLogin }: P) {
  const store = useStore();
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2 text-center">Place Your Order</h1>
      <p className="text-center text-gray-500 text-sm mb-8">Select items and add to cart</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {store.allProducts.map(p => (
          <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-cream-dark hover:shadow-lg transition-all">
            <div className="aspect-square overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div>
            <div className="p-3">
              <h3 className="font-semibold text-sm">{p.name}</h3>
              <p className="text-maroon font-bold">₱{p.price.toFixed(2)}</p>
              <button onClick={() => { if(!store.currentUser){onRequireLogin();return;} store.addToCart(p)?onNotify(`${p.name} added!`):onNotify('Out of stock!'); }}
                disabled={p.stock<=0} className={`w-full mt-2 text-xs py-2 rounded-lg font-medium transition-colors ${p.stock<=0?'bg-gray-200 text-gray-400':'bg-maroon text-white hover:bg-maroon-dark'}`}>
                {p.stock<=0?'OUT OF STOCK':'ADD TO CART'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {store.cartCount>0&&<div className="fixed bottom-6 right-6 z-40"><button onClick={()=>onNavigate('cart')} className="bg-maroon text-white px-5 py-3 rounded-full shadow-2xl font-semibold flex items-center gap-2 text-sm hover:bg-maroon-dark"><ShoppingCart size={16}/>Cart ({store.cartCount}) — ₱{store.cartTotal.toFixed(2)}</button></div>}
    </div>
  );
}
