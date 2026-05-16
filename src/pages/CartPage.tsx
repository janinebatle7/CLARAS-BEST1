import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore } from '../hooks/useStore';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }

export default function CartPage({ onNavigate, onNotify, onRequireLogin }: P) {
  const store = useStore();
  const handleOrder = () => {
    if (!store.currentUser) { onRequireLogin(); return; }
    if (!store.currentUser.phone || !store.currentUser.street || !store.currentUser.address) {
      onNotify('Please complete My Information before placing an order.');
      onNavigate('dashboard');
      return;
    }
    const order = store.placeOrder(); if (order) { onNotify(`Order #ORD-000${order.id} placed! ₱${order.total.toFixed(2)}`); onNavigate('track'); }
  };
  if (store.cart.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <ShoppingBag className="mx-auto text-gray-300 mb-4" size={56} />
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
      <p className="text-gray-500 mb-6 text-sm">Browse our menu and add items to your cart.</p>
      <button onClick={() => onNavigate('menu')} className="bg-maroon text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors">Browse Menu</button>
    </div>
  );
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => onNavigate('menu')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-maroon mb-6"><ArrowLeft size={16} /> Continue Shopping</button>
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Current Order <span className="text-sm font-normal text-gray-500">{store.cartCount} items</span></h1>
      <div className="bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-cream-dark text-xs text-gray-500 uppercase">
            <th className="text-left px-4 py-3">#</th><th className="text-left px-4 py-3">Item</th><th className="text-center px-4 py-3">Qty</th><th className="text-right px-4 py-3">Price</th><th className="text-right px-4 py-3">Total</th><th className="px-4 py-3"></th>
          </tr></thead>
          <tbody>
            {store.cart.map((item, idx) => (
              <tr key={item.id} className="border-b border-cream-dark last:border-0">
                <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => store.updateCartQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-400 hover:text-maroon hover:border-maroon"><Minus size={12} /></button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => { const p = store.allProducts.find(x => x.id === item.id); if (p && item.quantity >= p.stock) { onNotify('Max stock reached'); return; } store.updateCartQuantity(item.id, item.quantity + 1); }}
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-400 hover:text-maroon hover:border-maroon"><Plus size={12} /></button>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">₱{item.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">₱{(item.price * item.quantity).toFixed(2)}</td>
                <td className="px-4 py-3"><button onClick={() => { store.removeFromCart(item.id); onNotify(`${item.name} removed`); }} className="text-gray-300 hover:text-red-500">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-beige border-t border-cream-dark">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-900">TOTAL</span>
            <span className="text-2xl font-bold text-maroon">₱{store.cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { store.clearCart(); onNotify('Cart cleared'); }} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
              <Trash2 size={14} /> Clear Cart
            </button>
            <button onClick={handleOrder} className="flex-1 bg-maroon text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors flex items-center justify-center gap-1">
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
