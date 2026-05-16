import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, ShoppingCart, CalendarDays, Package, MapPin, LogOut, Home, Clock, ChevronRight, RefreshCw, Phone, Save, MessageSquare, Send, Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }

export default function CustomerDashboard({ onNavigate, onNotify }: P) {
  const store = useStore();
  const [tab, setTab] = useState('dashboard');
  const orders = store.getCustomerOrders();
  const customerReservations = store.currentUser ? store.reservations.filter(r => r.email === store.currentUser!.email) : [];
  const feedbacks = store.getCurrentUserFeedbacks();
  const unreadReplies = feedbacks.filter(f => f.reply && !f.readByCustomer).length;
  const [contactForm, setContactForm] = useState({
    name: store.currentUser?.name || '',
    email: store.currentUser?.email || '',
    phone: store.currentUser?.phone || '',
    street: store.currentUser?.street || '',
    address: store.currentUser?.address || '',
  });
  const [feedbackForm, setFeedbackForm] = useState({ subject: '', message: '' });
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationForm, setReservationForm] = useState({ date: '', time: '', type: 'Pick-up', items: '', notes: '' });
  const hasCustomerInfo = Boolean(store.currentUser?.phone && store.currentUser?.street && store.currentUser?.address);
  const requireCustomerInfo = () => {
    if (hasCustomerInfo) return true;
    onNotify('Please complete My Information before ordering or reserving.');
    setTab('information');
    return false;
  };
  const saveContactInfo = () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.phone.trim() || !contactForm.street.trim() || !contactForm.address.trim()) {
      onNotify('Please complete name, email, contact number, street, and address.');
      return;
    }
    const updated = store.updateCurrentUserInfo({
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      street: contactForm.street.trim(),
      address: contactForm.address.trim(),
    });
    if (!updated) {
      onNotify('Unable to save. Email may already be used.');
      return;
    }
    onNotify('Customer information saved and reflected in the system!');
  };
  const sendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store.currentUser) return;
    if (!feedbackForm.subject.trim() || !feedbackForm.message.trim()) {
      onNotify('Please enter feedback subject and message.');
      return;
    }
    store.addFeedback({
      name: store.currentUser.name,
      email: store.currentUser.email,
      subject: feedbackForm.subject.trim(),
      message: feedbackForm.message.trim(),
    });
    setFeedbackForm({ subject: '', message: '' });
    onNotify('Feedback sent to admin!');
  };
  const createReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store.currentUser) return;
    if (!requireCustomerInfo()) return;
    if (!reservationForm.date || !reservationForm.time) {
      onNotify('Please select reservation date and time.');
      return;
    }
    store.addReservation({
      name: store.currentUser.name,
      email: store.currentUser.email,
      date: reservationForm.date,
      time: reservationForm.time,
      guests: 1,
      notes: reservationForm.notes,
      type: reservationForm.type,
      items: reservationForm.items || 'Kakanin order to be confirmed',
      phone: store.currentUser.phone,
      street: store.currentUser.street,
      address: store.currentUser.address,
    });
    setReservationForm({ date: '', time: '', type: 'Pick-up', items: '', notes: '' });
    setShowReservationForm(false);
    onNotify('Reservation sent to the system!');
  };
  const placeCustomerOrder = () => {
    if (store.cart.length === 0) {
      onNotify('Add items first.');
      return;
    }
    if (!requireCustomerInfo()) return;
    const order = store.placeOrder('Reservation');
    if (order) {
      onNotify(`Order #ORD-000${order.id} placed!`);
      setTab('track');
    }
  };
  const sC = (s: string) => ({ COMPLETED: 'bg-green-100 text-green-700', READY: 'bg-blue-100 text-blue-700', PREPARING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-teal-100 text-teal-700', PENDING: 'bg-orange-100 text-orange-700' }[s] || 'bg-gray-100 text-gray-500');
  const stepIndex = (status: string) => ({ PENDING: 0, CONFIRMED: 1, PREPARING: 2, READY: 3, COMPLETED: 4 }[status] ?? 0);
  const sideLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={16} /> },
    { id: 'cart', label: 'My Cart', icon: <ShoppingCart size={16} /> },
    { id: 'reservations', label: 'My Reservations', icon: <CalendarDays size={16} /> },
    { id: 'track', label: 'Track Order', icon: <Package size={16} /> },
    { id: 'information', label: 'My Information', icon: <MapPin size={16} /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-beige">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-cream-dark flex flex-col shrink-0">
        <div className="p-4 border-b border-cream-dark flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <img src="/images/logo.png" alt="" className="h-9 w-9 object-contain" />
          <div><p className="font-serif font-bold text-maroon text-sm leading-tight">CLARA'S BEST</p><p className="text-[8px] text-gray-500 tracking-wider">KAKANIN DELICACIES</p></div>
        </div>
        <div className="px-4 py-3 border-b border-cream-dark">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-maroon text-white flex items-center justify-center text-xs font-bold">{store.currentUser?.name.charAt(0)}</div>
            <div><p className="text-sm font-medium text-gray-900">{store.currentUser?.name}</p><p className="text-[10px] text-gray-500">{store.currentUser?.email}</p><p className="text-[10px] text-gray-500">{store.currentUser?.phone || 'No contact yet'}</p></div></div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {sideLinks.map(l => (
            <button key={l.id} onClick={() => setTab(l.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${tab === l.id ? 'bg-maroon text-white' : 'text-gray-600 hover:bg-cream'}`}>
              {l.icon}{l.label}
              {l.id === 'cart' && store.cartCount > 0 && <span className="ml-auto bg-maroon text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{store.cartCount}</span>}
              {l.id === 'feedback' && unreadReplies > 0 && <span className="ml-auto bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{unreadReplies}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-cream-dark space-y-1">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-gray-500 text-xs hover:text-maroon w-full px-2 py-1"><Home size={14} /> Go to Website</button>
          <button onClick={() => { store.logout(); onNavigate('home'); }} className="flex items-center gap-2 text-red-500 text-xs hover:text-red-700 w-full px-2 py-1"><LogOut size={14} /> Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-900">Welcome back, {store.currentUser?.name?.split(' ')[0]}! 👋</h1><p className="text-xs text-gray-500">Here's an overview of your activity.</p></div>
          <button onClick={() => onNotify('Refreshed!')} className="flex items-center gap-1 bg-maroon text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-maroon-dark"><RefreshCw size={12} /> Refresh</button>
        </div>

        {tab === 'dashboard' && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { l: 'Total Orders', v: orders.length, c: 'text-maroon', icon: <ShoppingBag size={16} /> },
                { l: 'Pending Orders', v: orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length, c: 'text-orange-600', icon: <Clock size={16} /> },
                { l: 'Completed Orders', v: orders.filter(o => o.status === 'COMPLETED').length, c: 'text-green-600', icon: <Package size={16} /> },
                { l: 'Reservations', v: customerReservations.length, c: 'text-blue-600', icon: <CalendarDays size={16} /> },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-cream-dark">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">{s.l}</p>
                  <div className="flex items-center justify-between mt-1"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><div className={`${s.c} opacity-50`}>{s.icon}</div></div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-cream-dark flex items-center justify-between"><h2 className="font-bold text-sm text-gray-900">Recent Orders</h2>
                <button onClick={() => setTab('orders')} className="text-[11px] text-maroon font-medium hover:underline flex items-center gap-0.5">View All Orders <ChevronRight size={12} /></button></div>
              {orders.length === 0 ? <div className="p-6 text-center text-gray-400 text-sm">No orders yet. <button onClick={() => setTab('shop')} className="text-maroon font-medium hover:underline">Place one!</button></div> : (
                <table className="w-full text-xs"><thead><tr className="border-b border-cream-dark text-gray-500 uppercase"><th className="text-left px-4 py-2">Order ID</th><th className="text-left px-4 py-2">Date</th><th className="text-left px-4 py-2">Items</th><th className="text-right px-4 py-2">Total</th><th className="text-right px-4 py-2">Status</th></tr></thead>
                  <tbody>{orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="border-b border-cream-dark last:border-0 hover:bg-beige/50 cursor-pointer" onClick={() => setTab('track')}>
                      <td className="px-4 py-2.5 font-medium text-maroon">#ORD-000{o.id}</td><td className="px-4 py-2.5 text-gray-500">{o.date}</td><td className="px-4 py-2.5 text-gray-700">{o.itemCount} items</td><td className="px-4 py-2.5 text-right font-medium">₱{o.total.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sC(o.status)}`}>{o.status}</span></td>
                    </tr>
                  ))}</tbody></table>
              )}
            </div>

            {/* Recommended */}
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-4">
              <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-sm text-gray-900">Recommended for You</h2><button onClick={() => setTab('shop')} className="text-[11px] text-maroon font-medium hover:underline flex items-center gap-0.5">View All <ChevronRight size={12} /></button></div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {store.allProducts.slice(0, 5).map(p => (
                  <button key={p.id} onClick={() => { store.addToCart(p); onNotify(`${p.name} added!`); }} className="text-center group">
                    <div className="aspect-square rounded-lg overflow-hidden mb-1"><img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                    <p className="text-[11px] font-medium text-gray-900 truncate">{p.name}</p><p className="text-[11px] text-maroon font-bold">₱{p.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'shop' && (
          <div className="animate-fade-in-up grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-cream-dark p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg text-maroon flex items-center gap-2"><ShoppingBag size={20} /> Order Kakanin</h2>
                  <p className="text-xs text-gray-500 mt-1">Browse menu items without leaving your customer dashboard.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {store.allProducts.map(p => (
                  <div key={p.id} className="rounded-lg border border-cream-dark overflow-hidden bg-white">
                    <div className="aspect-square overflow-hidden"><img src={p.image} alt="" className="w-full h-full object-cover" /></div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-bold text-maroon">₱{p.price.toFixed(2)}</span>
                        <span className={`text-[10px] ${p.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-400'}`}>{p.stock} left</span>
                      </div>
                      <button
                        onClick={() => {
                          const ok = store.addToCart(p);
                          onNotify(ok ? `${p.name} added to cart` : `${p.name} is out of stock`);
                        }}
                        disabled={p.stock <= 0}
                        className={`w-full mt-2 py-1.5 rounded text-[10px] font-semibold transition-colors ${p.stock <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-maroon text-white hover:bg-maroon-dark'}`}
                      >
                        {p.stock <= 0 ? 'Unavailable' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-4 h-fit">
              <h3 className="font-bold text-sm text-maroon mb-3">My Cart</h3>
              {store.cart.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Your cart is empty.</p>
              ) : (
                <div className="space-y-2">
                  {store.cart.map(item => (
                    <div key={item.id} className="border border-cream-dark rounded-lg p-2">
                      <div className="flex items-start justify-between gap-2">
                        <div><p className="text-xs font-semibold text-gray-900">{item.name}</p><p className="text-[10px] text-gray-500">Qty: {item.quantity}</p></div>
                        <p className="text-xs font-bold text-maroon">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-cream-dark pt-3 mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Items</span><span>{store.cartCount}</span></div>
                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-maroon">₱{store.cartTotal.toFixed(2)}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={() => { store.clearCart(); onNotify('Cart cleared'); }} className="border border-gray-300 text-gray-600 py-2 rounded-lg text-xs font-medium hover:bg-gray-50">Clear</button>
                    <button onClick={placeCustomerOrder} className="bg-maroon text-white py-2 rounded-lg text-xs font-semibold hover:bg-maroon-dark">Place Order</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'cart' && (
          <div className="animate-fade-in-up max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
              <div className="px-4 py-3 border-b border-cream-dark flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-sm text-maroon flex items-center gap-2"><ShoppingCart size={16} /> My Cart</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">This is the same cart used when adding items from the menu and customer ordering tab.</p>
                </div>
                <button onClick={() => setTab('shop')} className="text-[11px] text-maroon font-medium hover:underline">Add More Items</button>
              </div>
              {store.cart.length === 0 ? (
                <div className="p-10 text-center">
                  <ShoppingCart className="mx-auto text-gray-300 mb-3" size={44} />
                  <p className="text-sm text-gray-500 mb-4">Your cart is empty.</p>
                  <button onClick={() => setTab('shop')} className="bg-maroon text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-maroon-dark">Browse Kakanin</button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="border-b border-cream-dark text-gray-500 uppercase"><th className="text-left px-4 py-3">Item</th><th className="text-center px-4 py-3">Qty</th><th className="text-right px-4 py-3">Price</th><th className="text-right px-4 py-3">Total</th><th className="px-4 py-3"></th></tr></thead>
                      <tbody>
                        {store.cart.map(item => {
                          const product = store.allProducts.find(p => p.id === item.id);
                          const maxStock = product?.stock ?? item.quantity;
                          return (
                            <tr key={item.id} className="border-b border-cream-dark last:border-0">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                  <div><p className="font-semibold text-gray-900">{item.name}</p><p className="text-[10px] text-gray-400">{maxStock} in stock</p></div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <button onClick={() => store.updateCartQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:text-maroon hover:border-maroon"><Minus size={12} /></button>
                                  <span className="w-7 text-center font-semibold">{item.quantity}</span>
                                  <button onClick={() => { if (item.quantity >= maxStock) onNotify('Max stock reached'); else store.updateCartQuantity(item.id, item.quantity + 1); }} className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:text-maroon hover:border-maroon"><Plus size={12} /></button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right text-gray-600">₱{item.price.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right font-bold text-gray-900">₱{(item.price * item.quantity).toFixed(2)}</td>
                              <td className="px-4 py-3 text-center"><button onClick={() => { store.removeFromCart(item.id); onNotify(`${item.name} removed`); }} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-beige border-t border-cream-dark">
                    <div className="flex items-center justify-between mb-4">
                      <div><p className="text-xs text-gray-500">Items: {store.cartCount}</p><p className="font-bold text-gray-900">Order Total</p></div>
                      <p className="text-2xl font-bold text-maroon">₱{store.cartTotal.toFixed(2)}</p>
                    </div>
                    {!hasCustomerInfo && <p className="text-xs text-orange-700 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 mb-3">Complete My Information before placing an order.</p>}
                    <div className="flex gap-3">
                      <button onClick={() => { store.clearCart(); onNotify('Cart cleared'); }} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center justify-center gap-1"><Trash2 size={14} /> Clear Cart</button>
                      <button onClick={placeCustomerOrder} className="flex-1 bg-maroon text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-dark transition-colors">Place Order</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
              <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">All Orders</h2></div>
              {orders.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No orders yet.</div> : (
                <div className="divide-y divide-cream-dark">
                  {orders.map(o => (
                    <button key={o.id} onClick={() => setTab('track')} className="w-full px-4 py-3 flex items-center justify-between hover:bg-beige/50 text-left">
                      <div><p className="font-bold text-maroon text-sm">#ORD-000{o.id}</p><p className="text-[11px] text-gray-500">{o.date} · {o.items}</p><p className="text-xs text-maroon font-bold mt-0.5">₱{o.total.toFixed(2)}</p></div>
                      <div className="flex items-center gap-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sC(o.status)}`}>{o.status}</span><ChevronRight size={14} className="text-gray-300" /></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'reservations' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark flex items-center justify-between">
              <h2 className="font-bold text-sm">My Reservations</h2>
              <button onClick={() => setShowReservationForm(!showReservationForm)} className="text-[11px] text-maroon font-medium hover:underline">{showReservationForm ? 'Hide Form' : 'New Reservation'}</button>
            </div>
            {showReservationForm && (
              <form onSubmit={createReservation} className="p-4 bg-beige border-b border-cream-dark">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Date</label>
                    <input type="date" value={reservationForm.date} onChange={e => setReservationForm({ ...reservationForm, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Time</label>
                    <select value={reservationForm.time} onChange={e => setReservationForm({ ...reservationForm, time: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none">
                      <option value="">Select</option>
                      {['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Type</label>
                    <select value={reservationForm.type} onChange={e => setReservationForm({ ...reservationForm, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none">
                      <option>Pick-up</option>
                      <option>Deliver</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Items</label>
                    <input value={reservationForm.items} onChange={e => setReservationForm({ ...reservationForm, items: e.target.value })} placeholder="Example: Bibingka x2" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none" />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="text-[11px] font-medium text-gray-700 block mb-1">Notes</label>
                    <textarea value={reservationForm.notes} onChange={e => setReservationForm({ ...reservationForm, notes: e.target.value })} rows={2} placeholder="Special instructions..." className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none resize-none" />
                  </div>
                </div>
                <button type="submit" className="mt-3 bg-maroon text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-maroon-dark">Submit Reservation</button>
              </form>
            )}
            {customerReservations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No reservations yet. <button onClick={() => setShowReservationForm(true)} className="text-maroon font-medium hover:underline">Book one</button>
              </div>
            ) : (
              <div className="divide-y divide-cream-dark">
                {customerReservations.map(r => (
                  <div key={r.id} className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-beige/50">
                    <div>
                      <p className="font-bold text-maroon text-sm">#RES-00{r.id}</p>
                      <p className="text-[11px] text-gray-500">{r.date} · {r.time} · {r.type}</p>
                      <p className="text-xs text-gray-700 mt-0.5">{r.items} {r.notes ? `· ${r.notes}` : ''}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' : r.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'track' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">Track My Orders</h2></div>
            {orders.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No orders to track yet.</div>
            ) : (
              <div className="divide-y divide-cream-dark">
                {orders.map(o => (
                  <div key={o.id} className="p-4">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-bold text-maroon text-sm">#ORD-000{o.id}</p>
                        <p className="text-[11px] text-gray-500">{o.date} · {o.time}</p>
                        <p className="text-xs text-gray-700 mt-0.5">{o.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-maroon text-sm">₱{o.total.toFixed(2)}</p>
                        <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${sC(o.status)}`}>{o.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'].map((label, i) => {
                        const active = i <= stepIndex(o.status);
                        return (
                          <div key={label} className={`rounded-lg border px-2 py-2 text-center ${active ? 'bg-maroon text-white border-maroon' : 'bg-cream text-gray-400 border-cream-dark'}`}>
                            <p className="text-[10px] font-semibold">{label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'feedback' && (
          <div className="animate-fade-in-up grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-cream-dark p-6">
              <h2 className="font-bold text-lg text-maroon flex items-center gap-2"><MessageSquare size={20} /> Send Feedback</h2>
              <p className="text-xs text-gray-500 mt-1 mb-5">Send your concerns, suggestions, or compliments directly to the admin.</p>
              <form onSubmit={sendFeedback} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Subject</label>
                  <input
                    value={feedbackForm.subject}
                    onChange={e => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                    placeholder="Example: Order experience, product suggestion, concern"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Message</label>
                  <textarea
                    value={feedbackForm.message}
                    onChange={e => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    rows={5}
                    placeholder="Write your feedback here..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none resize-none"
                  />
                </div>
                <button type="submit" className="bg-maroon text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-dark transition-colors flex items-center gap-2">
                  <Send size={15} /> Send Feedback
                </button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6 h-fit">
              <h3 className="font-bold text-sm text-gray-900 mb-4">My Feedback</h3>
              {feedbacks.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No feedback sent yet.</p>
              ) : (
                <div className="space-y-3 max-h-[520px] overflow-y-auto">
                  {feedbacks.map(f => (
                    <div key={f.id} className="border border-cream-dark rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-gray-900">{f.subject}</p>
                          <p className="text-[10px] text-gray-400">Sent {f.date}</p>
                        </div>
                        {f.reply ? <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Replied</span> : <span className="text-[9px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Pending</span>}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{f.message}</p>
                      {f.reply && (
                        <div className="mt-3 bg-cream rounded-lg p-3">
                          <p className="text-[10px] text-maroon font-bold uppercase tracking-wider">Admin Reply</p>
                          <p className="text-xs text-gray-700 mt-1">{f.reply}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{f.repliedBy} · {f.repliedAt}</p>
                          {!f.readByCustomer && <button onClick={() => { store.markCustomerFeedbackReplyRead(f.id); onNotify('Reply marked as read'); }} className="text-[10px] text-maroon font-medium hover:underline mt-2">Mark reply as read</button>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'information' && (
          <div className="animate-fade-in-up grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-cream-dark p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-bold text-lg text-maroon flex items-center gap-2"><MapPin size={20} /> Address & Contact Information</h2>
                  <p className="text-xs text-gray-500 mt-1">This information is saved to your customer profile and visible to staff/admin for orders and reservations.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Full Name</label>
                    <input
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><Phone size={13} /> Contact Number</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="Example: 09171234567"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin size={13} /> Street Number / Street Name</label>
                  <input
                    value={contactForm.street}
                    onChange={e => setContactForm({ ...contactForm, street: e.target.value })}
                    placeholder="Example: #12 Rizal Street"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin size={13} /> Complete Address</label>
                  <textarea
                    value={contactForm.address}
                    onChange={e => setContactForm({ ...contactForm, address: e.target.value })}
                    rows={4}
                    placeholder="Barangay, Municipality, Province"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none resize-none"
                  />
                </div>
                <button onClick={saveContactInfo} className="bg-maroon text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-dark transition-colors flex items-center gap-2">
                  <Save size={15} /> Save Information
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6 h-fit">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Saved Customer Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Name</p>
                  <p className="font-medium text-gray-900">{store.currentUser?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Email</p>
                  <p className="font-medium text-gray-900">{store.currentUser?.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Contact</p>
                  <p className="font-medium text-gray-900">{store.currentUser?.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Street</p>
                  <p className="font-medium text-gray-900 leading-relaxed">{store.currentUser?.street || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Address</p>
                  <p className="font-medium text-gray-900 leading-relaxed">{store.currentUser?.address || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
