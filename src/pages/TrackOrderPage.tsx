import { useState } from 'react';
import { Search, Package, ChefHat, PackageCheck, Truck, CheckCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { Order } from '../data/types';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }

export default function TrackOrderPage({ onNavigate, onNotify }: P) {
  const store = useStore();
  const [searchId, setSearchId] = useState('');
  const [found, setFound] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchId.replace(/\D/g, ''));
    const o = store.orders.find(x => x.id === id);
    setFound(o || null); setSearched(true);
    o ? onNotify(`Order #ORD-000${o.id} found`) : onNotify('Order not found');
  };
  const stepIdx = (s: string) => ({ PENDING: 0, CONFIRMED: 1, PREPARING: 2, READY: 3, COMPLETED: 4 }[s] ?? 0);
  const steps = [
    { label: 'Placed', icon: <Package size={18} /> },
    { label: 'Confirmed', icon: <CheckCircle size={18} /> },
    { label: 'Preparing', icon: <ChefHat size={18} /> },
    { label: 'Ready', icon: <PackageCheck size={18} /> },
    { label: 'Completed', icon: <Truck size={18} /> },
  ];
  const customerOrders = store.currentUser ? store.getCustomerOrders() : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2 text-center">Track Your Order</h1>
      <p className="text-center text-gray-500 text-sm mb-8">Enter your order number to see its status</p>
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="e.g. 128" className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" />
        </div>
        <button type="submit" className="bg-maroon text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-maroon-dark">Track</button>
      </form>
      {searched && found && (
        <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6 mb-6 animate-fade-in-up">
          <div className="flex justify-between mb-5"><div><h3 className="font-bold text-maroon">Order #ORD-000{found.id}</h3><p className="text-xs text-gray-500">{found.date} {found.time}</p></div><div className="text-right"><p className="text-xs text-gray-500">{found.items}</p><p className="font-bold text-maroon">₱{found.total.toFixed(2)}</p></div></div>
          <div className="relative"><div className="flex justify-between">
            {steps.map((s, i) => { const active = i <= stepIdx(found.status); return (
              <div key={i} className="flex flex-col items-center flex-1 z-10">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-400'}`}>{i < stepIdx(found.status) ? <CheckCircle size={16} /> : s.icon}</div>
                <p className={`text-[10px] mt-1 font-medium ${active ? 'text-maroon' : 'text-gray-400'}`}>{s.label}</p>
              </div>
            ); })}
          </div><div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-0"><div className="h-full bg-maroon transition-all duration-500" style={{ width: `${(stepIdx(found.status) / 4) * 100}%` }} /></div></div>
          {found.status === 'COMPLETED' && <p className="text-center text-green-600 text-sm mt-4">✅ Order completed! <button onClick={() => onNavigate('order')} className="text-maroon font-medium hover:underline ml-1">Order again</button></p>}
        </div>
      )}
      {searched && !found && <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-8 text-center mb-6"><p className="text-gray-500 text-sm">No order found. <button onClick={() => onNavigate('order')} className="text-maroon font-medium hover:underline">Place an order</button></p></div>}
      {customerOrders.length > 0 && (
        <div><h3 className="font-bold text-gray-900 mb-3">Your Orders</h3>
          <div className="space-y-2">{customerOrders.map(o => (
            <button key={o.id} onClick={() => { setSearchId(String(o.id)); setFound(o); setSearched(true); }} className="w-full bg-white rounded-lg shadow-sm border border-cream-dark p-3 text-left hover:shadow-md transition-shadow flex items-center justify-between">
              <div><span className="font-bold text-maroon text-sm">#ORD-000{o.id}</span><span className="text-xs text-gray-500 ml-2">{o.items}</span></div>
              <div className="flex items-center gap-2"><span className="font-bold text-sm">₱{o.total.toFixed(2)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${o.status==='COMPLETED'?'bg-green-100 text-green-700':o.status==='READY'?'bg-blue-100 text-blue-700':o.status==='PREPARING'?'bg-yellow-100 text-yellow-700':o.status==='CONFIRMED'?'bg-teal-100 text-teal-700':'bg-orange-100 text-orange-700'}`}>{o.status}</span>
              </div>
            </button>
          ))}</div>
        </div>
      )}
    </div>
  );
}
