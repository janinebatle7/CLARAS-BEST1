import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, CalendarDays, Package, Boxes, LogOut, RefreshCw, Plus, Minus, Search, Trash2, User, Clock, CheckCircle, PackageCheck, AlertTriangle, Save, MapPin, Phone, Mail } from 'lucide-react';
import { useStore } from '../hooks/useStore';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }

export default function StaffPanel({ onNavigate, onNotify }: P) {
  const store = useStore();
  const [tab, setTab] = useState('dashboard');
  const [queueFilter, setQueueFilter] = useState('All');
  const [walkInSearch, setWalkInSearch] = useState('');
  const [walkInCategory, setWalkInCategory] = useState('All');
  const [walkInCustomer, setWalkInCustomer] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [staffInfoForm, setStaffInfoForm] = useState({
    name: store.currentUser?.name || 'Maria Santos',
    email: store.currentUser?.email || 'maria.santos@clarasbest.com',
    phone: store.currentUser?.phone || '',
    address: store.currentUser?.address || '',
    shift: store.currentUser?.shift || '8:00 AM - 5:00 PM',
  });
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const sC = (s: string) => ({ COMPLETED: 'bg-green-100 text-green-700', READY: 'bg-blue-100 text-blue-700', PREPARING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-teal-100 text-teal-700', PENDING: 'bg-orange-100 text-orange-700' }[s] || 'bg-gray-100 text-gray-500');
  const nextAction = (s: string) => ({ PENDING: 'Confirm', CONFIRMED: 'Prepare', PREPARING: 'Ready', READY: 'Complete' }[s] || null);
  const filteredQ = queueFilter === 'All' ? store.orders : store.orders.filter(o => o.status === queueFilter.toUpperCase());
  const walkInProducts = store.allProducts.filter(p =>
    (walkInCategory === 'All' || p.category === walkInCategory) &&
    p.name.toLowerCase().includes(walkInSearch.toLowerCase()),
  );
  const createWalkInOrder = () => {
    if (store.cart.length === 0) {
      onNotify('Add at least one item to the walk-in cart first.');
      return;
    }
    const order = store.placeOrder('Walk-in', {
      customerName: walkInCustomer.trim() || 'Walk-in Customer',
      customer: 'walk-in',
      status: 'CONFIRMED',
    });
    if (order) {
      onNotify(`Walk-in Order #ORD-000${order.id} created via ${paymentMethod}!`);
      setWalkInCustomer('Walk-in Customer');
      setPaymentMethod('Cash');
      setTab('orders');
    }
  };
  const saveStaffInfo = () => {
    if (!staffInfoForm.name.trim() || !staffInfoForm.email.trim()) {
      onNotify('Please enter staff name and email.');
      return;
    }
    const updated = store.updateCurrentUserInfo({
      name: staffInfoForm.name.trim(),
      email: staffInfoForm.email.trim(),
      phone: staffInfoForm.phone.trim(),
      address: staffInfoForm.address.trim(),
      shift: staffInfoForm.shift.trim(),
    });
    if (!updated) {
      onNotify('Unable to save. Email may already be used.');
      return;
    }
    onNotify('Staff information saved and reflected in the system!');
  };

  const sideLinks = [
    { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { id: 'walkin', icon: <ShoppingBag size={16} />, label: 'Walk-in Orders' },
    { id: 'orders', icon: <Package size={16} />, label: 'Orders' },
    { id: 'reservations', icon: <CalendarDays size={16} />, label: 'Reservations' },
    { id: 'inventory', icon: <Boxes size={16} />, label: 'Inventory' },
    { id: 'staffInfo', icon: <User size={16} />, label: 'Staff Info' },
  ];

  return (
    <div className="flex min-h-screen bg-beige">
      <aside className="w-52 bg-maroon text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-maroon-light cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="flex items-center gap-2"><img src="/images/logo.png" alt="" className="h-9 w-9 object-contain" /><div><p className="font-serif font-bold text-sm">CLARA'S BEST</p><p className="text-[8px] text-white/60 tracking-wider">KAKANIN DELICACIES</p></div></div>
        </div>
        <div className="px-4 py-3 border-b border-maroon-light">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gold text-maroon-dark flex items-center justify-center text-xs font-bold">{store.currentUser?.name?.charAt(0) || 'S'}</div>
            <div><p className="text-sm font-medium">{store.currentUser?.name || 'Staff User'}</p><p className="text-[10px] text-white/60">Staff · <span className="text-green-400">● Online</span></p><p className="text-[10px] text-white/50">{store.currentUser?.phone || 'No contact yet'}</p></div></div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {sideLinks.map(l => (
            <button key={l.id} onClick={() => setTab(l.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${tab === l.id ? 'bg-gold text-maroon-dark' : 'text-white/80 hover:bg-maroon-light'}`}>{l.icon}{l.label}</button>
          ))}
        </nav>
        <div className="p-3 border-t border-maroon-light text-[10px] text-white/50 space-y-0.5">
          <p className="font-bold text-white/70 text-[11px]">TODAY'S STORE INFO</p>
          <p>Store: Poblacion Branch</p><p>Shift: {store.currentUser?.shift || '8:00 AM - 5:00 PM'}</p>
        </div>
        <div className="p-3 border-t border-maroon-light">
          <button onClick={() => { store.logout(); onNavigate('home'); }} className="flex items-center gap-2 text-red-300 text-xs hover:text-red-200"><LogOut size={14} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-900">Good morning, {store.currentUser?.name?.split(' ')[0] || 'Staff'}! 👋</h1><p className="text-xs text-gray-500">Here's what's happening in the store today.</p></div>
          <div className="flex items-center gap-2 text-xs text-gray-500"><span>📅 {today}</span><button onClick={() => onNotify('Refreshed!')} className="flex items-center gap-1 bg-maroon text-white px-3 py-1.5 rounded-lg font-medium hover:bg-maroon-dark"><RefreshCw size={12} /> Refresh</button></div>
        </div>

        {tab === 'dashboard' && (
          <div className="animate-fade-in-up space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { l: 'WALK-IN SALES TODAY', v: `₱${store.totalSales.toLocaleString()}.00`, icon: <ShoppingBag size={18} /> },
                { l: 'TOTAL ORDERS TODAY', v: store.orders.length, icon: <Package size={18} /> },
                { l: 'PENDING ORDERS', v: store.pendingCount + store.confirmedCount, icon: <Clock size={18} />, warn: true },
                { l: 'READY FOR PICKUP', v: store.readyCount, icon: <CheckCircle size={18} /> },
                { l: 'COMPLETED ORDERS', v: store.completedCount, icon: <PackageCheck size={18} /> },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-cream-dark">
                  <div className="flex items-center justify-between"><p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">{s.l}</p><div className="text-maroon opacity-50">{s.icon}</div></div>
                  <p className={`text-xl font-bold mt-1 ${s.warn && (store.pendingCount + store.confirmedCount) > 0 ? 'text-orange-600' : 'text-gray-900'}`}>{s.v}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* POS Quick Add */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-cream-dark p-4">
                <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-sm flex items-center gap-1">🛒 CREATE WALK-IN ORDER (POS)</h2>
                  <button onClick={() => { if (store.cart.length > 0) { const o = store.placeOrder('Walk-in', { customer: 'walk-in', customerName: 'Walk-in Customer', status: 'CONFIRMED' }); if (o) onNotify(`Walk-in Order #ORD-000${o.id} created!`); } else onNotify('Add items first'); }}
                    className="bg-maroon text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-maroon-dark flex items-center gap-1"><Plus size={12} /> New Walk-in Order</button></div>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {store.allProducts.slice(0, 5).map(p => (
                    <button key={p.id} onClick={() => { store.addToCart(p); onNotify(`${p.name} added`); }} className="text-center group">
                      <div className="aspect-square rounded-lg overflow-hidden mb-1 border border-cream-dark"><img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                      <p className="text-[10px] font-medium truncate">{p.name}</p><p className="text-[10px] text-maroon font-bold">₱{p.price.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
                {store.cart.length > 0 && (
                  <div className="border-t border-cream-dark pt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">Current Cart ({store.cartCount} items)</p>
                    {store.cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between py-1 text-xs">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-2"><span className="text-gray-500">x{item.quantity}</span><span className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => store.removeFromCart(item.id)} className="text-gray-300 hover:text-red-500">×</button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between mt-2 pt-2 border-t border-cream-dark font-bold text-sm"><span>TOTAL</span><span className="text-maroon">₱{store.cartTotal.toFixed(2)}</span></div>
                  </div>
                )}
              </div>

              {/* Order Queue */}
              <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-4">
                <h2 className="font-bold text-sm mb-2">📋 ORDER QUEUE</h2>
                <div className="flex gap-1 mb-3">
                  {['All', 'Preparing', 'Ready'].map(f => (
                    <button key={f} onClick={() => setQueueFilter(f)} className={`px-2 py-1 rounded-full text-[10px] font-medium ${queueFilter === f ? 'bg-maroon text-white' : 'bg-cream text-gray-600'}`}>{f} ({f === 'All' ? store.orders.length : store.orders.filter(o => o.status === f.toUpperCase()).length})</button>
                  ))}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredQ.slice(0, 6).map(o => (
                    <div key={o.id} className="border border-cream-dark rounded-lg p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-maroon">#ORD-000{o.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${sC(o.status)}`}>{o.status}</span>
                      </div>
                      <p className="text-[11px] text-gray-900 font-medium">{o.customerName}</p>
                      <p className="text-[10px] text-gray-500">₱{o.total.toFixed(2)}</p>
                      {nextAction(o.status) && (
                        <button onClick={() => { store.updateOrderStatus(o.id); onNotify(`Order #ORD-000${o.id} updated!`); }}
                          className="mt-1 w-full bg-maroon text-white text-[10px] py-1 rounded font-medium hover:bg-maroon-dark">{nextAction(o.status)}</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low Stock */}
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-4">
              <h2 className="font-bold text-sm mb-3 flex items-center gap-1"><AlertTriangle size={14} className="text-orange-500" /> LOW STOCK ITEMS</h2>
              <div className="space-y-2">
                {store.lowStockProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><img src={p.image} alt="" className="w-8 h-8 rounded object-cover" /><div><p className="text-xs font-medium">{p.name}</p><p className="text-[10px] text-gray-500">{p.stock} pcs left</p></div></div>
                    <span className="text-[10px] text-red-600 font-bold">Low</span>
                  </div>
                ))}
                {store.lowStockProducts.length === 0 && <p className="text-xs text-gray-400">All items well stocked!</p>}
              </div>
            </div>

          </div>
        )}

        {tab === 'orders' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">All Orders ({store.orders.length})</h2></div>
            <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="bg-maroon text-white"><th className="text-left px-4 py-2.5">ID</th><th className="text-left px-4 py-2.5">Customer</th><th className="text-left px-4 py-2.5">Contact</th><th className="text-left px-4 py-2.5">Street</th><th className="text-left px-4 py-2.5">Address</th><th className="text-left px-4 py-2.5">Items</th><th className="text-left px-4 py-2.5">Type</th><th className="text-right px-4 py-2.5">Total</th><th className="text-center px-4 py-2.5">Status</th><th className="text-center px-4 py-2.5">Action</th></tr></thead>
              <tbody>{store.orders.map(o => (
                <tr key={o.id} className="border-b border-cream-dark last:border-0 hover:bg-beige/30">
                  <td className="px-4 py-2.5 font-bold text-maroon">#ORD-000{o.id}</td><td className="px-4 py-2.5">{o.customerName}</td><td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{o.customerPhone || store.getUserByEmail(o.customer)?.phone || '-'}</td><td className="px-4 py-2.5 text-gray-500 min-w-[130px]">{o.customerStreet || store.getUserByEmail(o.customer)?.street || '-'}</td><td className="px-4 py-2.5 text-gray-500 min-w-[170px]">{o.customerAddress || store.getUserByEmail(o.customer)?.address || '-'}</td><td className="px-4 py-2.5 text-gray-600">{o.items}</td>
                  <td className="px-4 py-2.5"><span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${o.type === 'Walk-in' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>{o.type}</span></td>
                  <td className="px-4 py-2.5 text-right font-bold">₱{o.total.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${sC(o.status)}`}>{o.status}</span></td>
                  <td className="px-4 py-2.5 text-center">{nextAction(o.status) ? <button onClick={() => { store.updateOrderStatus(o.id); onNotify(`Updated!`); }} className="bg-maroon text-white px-2 py-1 rounded text-[10px] font-medium hover:bg-maroon-dark">{nextAction(o.status)}</button> : <span className="text-[10px] text-gray-400">Done</span>}</td>
                </tr>
              ))}</tbody></table></div>
          </div>
        )}

        {tab === 'walkin' && (
          <div className="animate-fade-in-up grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-cream-dark p-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-bold text-sm flex items-center gap-1 text-maroon"><ShoppingBag size={16} /> CREATE WALK-IN ORDER</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Add kakanin items, enter customer name, then create the order.</p>
                </div>
                <button onClick={createWalkInOrder} className="bg-maroon text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-maroon-dark transition-colors">
                  Create Order
                </button>
              </div>

              <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    value={walkInSearch}
                    onChange={e => setWalkInSearch(e.target.value)}
                    placeholder="Search kakanin..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none"
                  />
                </div>
                <select
                  value={walkInCategory}
                  onChange={e => setWalkInCategory(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none"
                >
                  <option>All</option>
                  {store.categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {walkInProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      const ok = store.addToCart(p);
                      onNotify(ok ? `${p.name} added to walk-in cart` : `${p.name} is out of stock`);
                    }}
                    disabled={p.stock <= 0}
                    className={`text-left rounded-lg border border-cream-dark overflow-hidden transition-all hover:shadow-md ${p.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'bg-white'}`}
                  >
                    <div className="aspect-square overflow-hidden"><img src={p.image} alt="" className="w-full h-full object-cover" /></div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[11px] font-bold text-maroon">₱{p.price.toFixed(2)}</span>
                        <span className={`text-[10px] ${p.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-400'}`}>{p.stock} left</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {walkInProducts.length === 0 && <p className="text-center text-xs text-gray-400 py-8">No products found.</p>}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-4 h-fit">
              <h2 className="font-bold text-sm text-maroon mb-3">CURRENT WALK-IN CART</h2>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] font-medium text-gray-600 mb-1 flex items-center gap-1"><User size={12} /> Customer Name</label>
                  <input
                    value={walkInCustomer}
                    onChange={e => setWalkInCustomer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none"
                    placeholder="Walk-in Customer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none"
                  >
                    <option>Cash</option>
                    <option>GCash</option>
                    <option>Card</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {store.cart.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-cream-dark rounded-lg">
                  <ShoppingBag className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-xs text-gray-400">No items yet. Select items from the product list.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {store.cart.map(item => {
                    const product = store.allProducts.find(p => p.id === item.id);
                    const maxStock = product?.stock ?? item.quantity;
                    return (
                      <div key={item.id} className="border border-cream-dark rounded-lg p-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{item.name}</p>
                            <p className="text-[10px] text-gray-500">₱{item.price.toFixed(2)} each</p>
                          </div>
                          <button onClick={() => { store.removeFromCart(item.id); onNotify(`${item.name} removed`); }} className="text-gray-300 hover:text-red-500"><Trash2 size={13} /></button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button onClick={() => store.updateCartQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:text-maroon hover:border-maroon"><Minus size={11} /></button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => {
                                if (item.quantity >= maxStock) onNotify(`Only ${maxStock} ${item.name} left in stock`);
                                else store.updateCartQuantity(item.id, item.quantity + 1);
                              }}
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:text-maroon hover:border-maroon"
                            ><Plus size={11} /></button>
                          </div>
                          <p className="text-xs font-bold text-maroon">₱{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t border-cream-dark pt-3 mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Items</span><span>{store.cartCount}</span></div>
                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-maroon">₱{store.cartTotal.toFixed(2)}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={() => { store.clearCart(); onNotify('Walk-in cart cleared'); }} className="border border-gray-300 text-gray-600 py-2 rounded-lg text-xs font-medium hover:bg-gray-50">Clear</button>
                    <button onClick={createWalkInOrder} className="bg-maroon text-white py-2 rounded-lg text-xs font-semibold hover:bg-maroon-dark">Create Order</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {tab === 'reservations' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">Reservations ({store.reservations.length})</h2></div>
            {store.reservations.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No reservations yet.</div> : (
              <div className="divide-y divide-cream-dark">{store.reservations.map(r => (
                <div key={r.id} className="px-4 py-3 flex items-center justify-between">
                  <div><p className="font-bold text-sm">{r.name}</p><p className="text-[11px] text-gray-500">{r.date} · {r.time} · {r.type}</p></div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' : r.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{r.status}</span>
                    {r.status === 'pending' && <button onClick={() => { store.updateReservationStatus(r.id, 'confirmed'); onNotify('Confirmed!'); }} className="bg-maroon text-white px-2 py-1 rounded text-[10px] font-medium">Confirm</button>}
                  </div>
                </div>
              ))}</div>
            )}
          </div>
        )}
        {tab === 'inventory' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">Inventory</h2></div>
            <table className="w-full text-xs"><thead><tr className="border-b border-cream-dark text-gray-500 uppercase"><th className="text-left px-4 py-2">Item</th><th className="text-center px-4 py-2">Stock</th><th className="text-right px-4 py-2">Price</th><th className="text-center px-4 py-2">Actions</th></tr></thead>
              <tbody>{store.allProducts.map(p => (
                <tr key={p.id} className="border-b border-cream-dark last:border-0">
                  <td className="px-4 py-2.5 font-medium flex items-center gap-2"><img src={p.image} alt="" className="w-7 h-7 rounded object-cover" />{p.name}</td>
                  <td className={`px-4 py-2.5 text-center font-medium ${p.stock < 10 ? 'text-red-600' : ''}`}>{p.stock}</td>
                  <td className="px-4 py-2.5 text-right">₱{p.price.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-center"><button onClick={() => { store.addStock(p.id, 10); onNotify(`+10 to ${p.name}`); }} className="border border-gray-300 px-2 py-0.5 rounded text-[10px] hover:bg-cream"><Plus size={10} className="inline" /> +10</button></td>
                </tr>
              ))}</tbody></table>
          </div>
        )}
        {tab === 'staffInfo' && (
          <div className="animate-fade-in-up grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-cream-dark p-6">
              <div className="mb-5">
                <h2 className="font-bold text-lg text-maroon flex items-center gap-2"><User size={20} /> Staff Information</h2>
                <p className="text-xs text-gray-500 mt-1">Update your staff profile. Changes will immediately appear in the admin Users table and this staff dashboard.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Full Name</label>
                  <input value={staffInfoForm.name} onChange={e => setStaffInfoForm({ ...staffInfoForm, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><Mail size={13} /> Email</label>
                  <input type="email" value={staffInfoForm.email} onChange={e => setStaffInfoForm({ ...staffInfoForm, email: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><Phone size={13} /> Contact Number</label>
                  <input value={staffInfoForm.phone} onChange={e => setStaffInfoForm({ ...staffInfoForm, phone: e.target.value })} placeholder="Staff contact number" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Shift</label>
                  <input value={staffInfoForm.shift} onChange={e => setStaffInfoForm({ ...staffInfoForm, shift: e.target.value })} placeholder="8:00 AM - 5:00 PM" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin size={13} /> Address / Assigned Branch</label>
                  <textarea value={staffInfoForm.address} onChange={e => setStaffInfoForm({ ...staffInfoForm, address: e.target.value })} rows={3} placeholder="Assigned branch or staff address" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none resize-none" />
                </div>
              </div>
              <button onClick={saveStaffInfo} className="mt-5 bg-maroon text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-dark transition-colors flex items-center gap-2">
                <Save size={15} /> Save Staff Info
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6 h-fit">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Current System Record</h3>
              <div className="space-y-3 text-sm">
                <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Name</p><p className="font-medium text-gray-900">{store.currentUser?.name || '-'}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Email</p><p className="font-medium text-gray-900">{store.currentUser?.email || '-'}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Contact</p><p className="font-medium text-gray-900">{store.currentUser?.phone || '-'}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Shift</p><p className="font-medium text-gray-900">{store.currentUser?.shift || '-'}</p></div>
                <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Address / Branch</p><p className="font-medium text-gray-900 leading-relaxed">{store.currentUser?.address || '-'}</p></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
