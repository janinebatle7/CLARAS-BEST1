import { useState } from 'react';
import { LayoutDashboard, Users, Package, Boxes, CalendarDays, FileText, Settings, LogOut, RefreshCw, Plus, Trash2, AlertTriangle, TrendingUp, ShoppingBag, ChevronRight, MessageSquare, Edit, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { Product } from '../data/types';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }

export default function AdminPanel({ onNavigate, onNotify }: P) {
  const store = useStore();
  const [tab, setTab] = useState('dashboard');
  const [settingsForm, setSettingsForm] = useState({ ...store.settings });
  const emptyProductForm = { name: '', price: '', image: '/images/bibingka.jpg', description: '', category: 'Rice Cakes', stock: '', rating: '4.5', reviews: '0' };
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [feedbackReplies, setFeedbackReplies] = useState<Record<number, string>>({});
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const sC = (s: string) => ({ COMPLETED: 'bg-green-100 text-green-700', READY: 'bg-blue-100 text-blue-700', PREPARING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-teal-100 text-teal-700', PENDING: 'bg-orange-100 text-orange-700' }[s] || 'bg-gray-100 text-gray-500');

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setEditingProductId(null);
    setShowProductForm(false);
  };
  const startEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      price: String(product.price),
      image: product.image,
      description: product.description,
      category: product.category,
      stock: String(product.stock),
      rating: String(product.rating),
      reviews: String(product.reviews),
    });
    setEditingProductId(product.id);
    setShowProductForm(true);
  };
  const saveProduct = () => {
    const price = Number(productForm.price);
    const stock = Number(productForm.stock);
    const rating = Math.min(5, Math.max(1, Number(productForm.rating) || 4.5));
    const reviews = Math.max(0, Math.round(Number(productForm.reviews) || 0));
    if (!productForm.name.trim() || !productForm.category.trim() || price <= 0 || stock < 0) {
      onNotify('Please complete product name, category, valid price, and stock.');
      return;
    }
    const productData = {
      name: productForm.name.trim(),
      price,
      image: productForm.image || '/images/bibingka.jpg',
      description: productForm.description.trim() || 'Freshly made Clara\'s Best kakanin delicacy.',
      category: productForm.category.trim(),
      stock: Math.round(stock),
      rating,
      reviews,
    };
    if (editingProductId) {
      const updated = store.updateProduct(editingProductId, productData);
      if (updated) onNotify(`${updated.name} updated and reflected in the system!`);
    } else {
      const added = store.addProduct(productData);
      onNotify(`${added.name} added and reflected in the system!`);
    }
    resetProductForm();
  };
  const sendFeedbackReply = (feedbackId: number) => {
    const reply = feedbackReplies[feedbackId]?.trim();
    if (!reply) {
      onNotify('Please type a reply first.');
      return;
    }
    const replied = store.replyToFeedback(feedbackId, reply, store.currentUser?.name || 'Admin User');
    if (replied) {
      setFeedbackReplies({ ...feedbackReplies, [feedbackId]: '' });
      onNotify(`Reply sent to ${replied.name}!`);
    }
  };

  const sideLinks = [
    { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
    { id: 'users', icon: <Users size={16} />, label: 'Users' },
    { id: 'products', icon: <Boxes size={16} />, label: 'Products (Kakanin)' },
    { id: 'inventory', icon: <Package size={16} />, label: 'Inventory' },
    { id: 'orders', icon: <ShoppingBag size={16} />, label: 'Orders' },
    { id: 'reservations', icon: <CalendarDays size={16} />, label: 'Reservations' },
    { id: 'feedback', icon: <MessageSquare size={16} />, label: 'Feedback' },
    { id: 'reports', icon: <FileText size={16} />, label: 'Reports' },
    { id: 'settings', icon: <Settings size={16} />, label: 'System Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-beige">
      <aside className="w-56 bg-maroon text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-maroon-light cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="flex items-center gap-2"><img src="/images/logo.png" alt="" className="h-9 w-9 object-contain" /><div><p className="font-serif font-bold text-sm">CLARA'S BEST</p><p className="text-[8px] text-white/60 tracking-wider">KAKANIN DELICACIES</p></div></div>
        </div>
        <div className="px-4 py-3 border-b border-maroon-light flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold text-maroon-dark flex items-center justify-center text-xs font-bold">A</div>
          <div><p className="text-sm font-medium">Admin User</p><p className="text-[10px] text-white/60">Administrator · <span className="text-green-400">● Online</span></p></div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {sideLinks.map(l => (
            <button key={l.id} onClick={() => setTab(l.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${tab === l.id ? 'bg-gold text-maroon-dark' : 'text-white/80 hover:bg-maroon-light'}`}>
              {l.icon}{l.label}
              {l.id === 'feedback' && store.feedbacks.filter(f => !f.read).length > 0 && <span className="ml-auto bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{store.feedbacks.filter(f => !f.read).length}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-maroon-light space-y-1 text-[10px] text-white/50">
          <p>© 2025 Clara's Best Kakanin Delicacies.</p>
        </div>
        <div className="p-3 border-t border-maroon-light">
          <button onClick={() => { store.logout(); onNavigate('home'); }} className="flex items-center gap-2 text-red-300 text-xs hover:text-red-200"><LogOut size={14} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-gray-900">Welcome back, Administrator! 👋</h1><p className="text-xs text-gray-500">Here's what's happening in your system today.</p></div>
          <div className="flex items-center gap-2 text-xs"><span className="text-gray-500">📅 {today}</span><button onClick={() => onNotify('Refreshed!')} className="flex items-center gap-1 bg-maroon text-white px-3 py-1.5 rounded-lg font-medium hover:bg-maroon-dark"><RefreshCw size={12} /> Refresh</button></div>
        </div>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="animate-fade-in-up space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { l: 'TOTAL SALES', v: `₱${(store.totalSales + 168250).toLocaleString()}`, icon: <TrendingUp size={16} />, up: '↑ 16.4%' },
                { l: 'TOTAL ORDERS', v: store.orders.length + 240, icon: <Package size={16} />, up: '↑ 12.7%' },
                { l: 'WALK-IN ORDERS', v: store.orders.filter(o => o.type === 'Walk-in').length + 130, icon: <ShoppingBag size={16} />, up: '↑ 15.3%' },
                { l: 'RESERVATIONS', v: store.reservations.length + 66, icon: <CalendarDays size={16} />, up: '↑ 8.6%' },
                { l: 'TOTAL CUSTOMERS', v: store.registeredCustomers + 405, icon: <Users size={16} />, up: '↑ 11.2%' },
                { l: 'LOW STOCK ITEMS', v: store.lowStockProducts.length, icon: <AlertTriangle size={16} />, warn: true },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-cream-dark">
                  <div className="flex items-center justify-between"><p className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">{s.l}</p><div className="text-maroon opacity-40">{s.icon}</div></div>
                  <p className={`text-lg font-bold mt-0.5 ${s.warn && store.lowStockProducts.length > 0 ? 'text-orange-600' : 'text-gray-900'}`}>{s.v}</p>
                  {s.up && <p className="text-[9px] text-green-600 mt-0.5">{s.up} vs last week</p>}
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
                <div className="px-4 py-3 border-b border-cream-dark flex justify-between items-center"><h2 className="font-bold text-sm">Recent Orders</h2><button onClick={() => setTab('orders')} className="text-[11px] text-maroon font-medium hover:underline flex items-center gap-0.5">View All Orders <ChevronRight size={12} /></button></div>
                <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-cream-dark text-gray-500 uppercase text-[10px]"><th className="text-left px-4 py-2">Order ID</th><th className="text-left px-4 py-2">Customer</th><th className="text-left px-4 py-2">Contact</th><th className="text-left px-4 py-2">Street</th><th className="text-left px-4 py-2">Address</th><th className="text-left px-4 py-2">Items</th><th className="text-left px-4 py-2">Type</th><th className="text-right px-4 py-2">Total</th><th className="text-right px-4 py-2">Status</th></tr></thead>
                  <tbody>{store.orders.slice(0, 8).map(o => (
                    <tr key={o.id} className="border-b border-cream-dark last:border-0 hover:bg-beige/30">
                      <td className="px-4 py-2 font-bold text-maroon">#ORD-000{o.id}</td><td className="px-4 py-2">{o.customerName}</td><td className="px-4 py-2 text-gray-500 whitespace-nowrap">{o.customerPhone || store.getUserByEmail(o.customer)?.phone || '-'}</td><td className="px-4 py-2 text-gray-500 min-w-[120px]">{o.customerStreet || store.getUserByEmail(o.customer)?.street || '-'}</td><td className="px-4 py-2 text-gray-500 min-w-[170px]">{o.customerAddress || store.getUserByEmail(o.customer)?.address || '-'}</td><td className="px-4 py-2 text-gray-600 max-w-[180px] truncate">{o.items}</td>
                      <td className="px-4 py-2"><span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${o.type === 'Walk-in' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>{o.type}</span></td>
                      <td className="px-4 py-2 text-right font-medium">₱{o.total.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right"><span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${sC(o.status)}`}>{o.status}</span></td>
                    </tr>
                  ))}</tbody></table></div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
              <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">Top Selling Products</h2></div>
              <table className="w-full text-xs"><thead><tr className="border-b border-cream-dark text-gray-500 uppercase text-[10px]"><th className="text-left px-4 py-2">Product</th><th className="text-left px-4 py-2">Category</th><th className="text-center px-4 py-2">Stock</th><th className="text-right px-4 py-2">Price</th></tr></thead>
                <tbody>{store.allProducts.slice(0, 5).map(p => (
                  <tr key={p.id} className="border-b border-cream-dark last:border-0"><td className="px-4 py-2 font-medium flex items-center gap-2"><img src={p.image} alt="" className="w-6 h-6 rounded object-cover" />{p.name}</td><td className="px-4 py-2 text-gray-500">{p.category}</td><td className={`px-4 py-2 text-center ${p.stock < 10 ? 'text-red-600 font-bold' : ''}`}>{p.stock}</td><td className="px-4 py-2 text-right font-medium">₱{p.price.toFixed(2)}</td></tr>
                ))}</tbody></table>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark flex justify-between items-center"><h2 className="font-bold text-sm">Users ({store.allUsers.length})</h2></div>
            <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-cream-dark text-gray-500 uppercase text-[10px]"><th className="text-left px-4 py-2">ID</th><th className="text-left px-4 py-2">Name</th><th className="text-left px-4 py-2">Email</th><th className="text-left px-4 py-2">Contact</th><th className="text-left px-4 py-2">Street</th><th className="text-left px-4 py-2">Address</th><th className="text-left px-4 py-2">Shift</th><th className="text-center px-4 py-2">Role</th><th className="text-center px-4 py-2">Action</th></tr></thead>
              <tbody>{store.allUsers.map(u => (
                <tr key={u.id} className="border-b border-cream-dark last:border-0 hover:bg-beige/30"><td className="px-4 py-2 text-gray-400">#{u.id}</td><td className="px-4 py-2 font-medium">{u.name}</td><td className="px-4 py-2 text-gray-500">{u.email}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{u.phone || '-'}</td><td className="px-4 py-2 text-gray-500 min-w-[130px]">{u.street || '-'}</td><td className="px-4 py-2 text-gray-500 min-w-[180px]">{u.address || '-'}</td><td className="px-4 py-2 text-gray-500 whitespace-nowrap">{u.shift || '-'}</td>
                  <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${u.role==='admin'?'bg-maroon/10 text-maroon':u.role==='staff'?'bg-gold/20 text-gold-dark':'bg-green-50 text-green-700'}`}>{u.role}</span></td>
                  <td className="px-4 py-2 text-center">{u.id !== store.currentUser?.id ? <button onClick={() => { store.deleteUser(u.id); onNotify(`${u.name} removed`); }} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button> : <span className="text-[10px] text-gray-400">You</span>}</td>
                </tr>
              ))}</tbody></table></div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div className="animate-fade-in-up space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
              <div className="px-4 py-3 border-b border-cream-dark flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-sm">Products (Kakanin)</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">Add, edit, or delete products. Changes reflect in menu, ordering, staff POS, and inventory.</p>
                </div>
                <button
                  onClick={() => { setProductForm(emptyProductForm); setEditingProductId(null); setShowProductForm(true); }}
                  className="bg-maroon text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-maroon-dark transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus size={13} /> Add Product
                </button>
              </div>

              {showProductForm && (
                <div className="p-4 bg-beige border-b border-cream-dark">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-maroon">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={resetProductForm} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-700 block mb-1">Product Name</label>
                      <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none" placeholder="Example: Maja Blanca" />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-700 block mb-1">Category</label>
                      <input list="product-categories" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none" />
                      <datalist id="product-categories">
                        {[...new Set(['Rice Cakes', 'Steamed Delicacies', 'Glutinous Delicacies', 'Layered Delicacies', 'Baked Delicacies', ...store.categories])].map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-700 block mb-1">Price</label>
                      <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none" placeholder="120" />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-700 block mb-1">Stock</label>
                      <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none" placeholder="30" />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-700 block mb-1">Image</label>
                      <select value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none">
                        <option value="/images/bibingka.jpg">Bibingka image</option>
                        <option value="/images/puto.jpg">Puto image</option>
                        <option value="/images/kutsinta.jpg">Kutsinta image</option>
                        <option value="/images/sapin-sapin.jpg">Sapin-Sapin image</option>
                        <option value="/images/suman.jpg">Suman image</option>
                        <option value="/images/cat-rice.jpg">Rice cakes image</option>
                        <option value="/images/cat-steamed.jpg">Steamed image</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-700 block mb-1">Rating</label>
                      <input type="number" step="0.1" min="1" max="5" value={productForm.rating} onChange={e => setProductForm({ ...productForm, rating: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none" />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-700 block mb-1">Reviews</label>
                      <input type="number" value={productForm.reviews} onChange={e => setProductForm({ ...productForm, reviews: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none" />
                    </div>
                    <div className="flex items-end gap-2">
                      <button onClick={saveProduct} className="flex-1 bg-maroon text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-maroon-dark transition-colors">{editingProductId ? 'Save Changes' : 'Add Product'}</button>
                      <button onClick={resetProductForm} className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-white transition-colors">Cancel</button>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="text-[11px] font-medium text-gray-700 block mb-1">Description</label>
                      <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none resize-none" placeholder="Short product description" />
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs"><thead><tr className="border-b border-cream-dark text-gray-500 uppercase text-[10px]"><th className="text-left px-4 py-2">Product</th><th className="text-left px-4 py-2">Category</th><th className="text-center px-4 py-2">Stock</th><th className="text-right px-4 py-2">Price</th><th className="text-center px-4 py-2">Rating</th><th className="text-center px-4 py-2">Actions</th></tr></thead>
                  <tbody>{store.allProducts.map(p => (
                    <tr key={p.id} className="border-b border-cream-dark last:border-0"><td className="px-4 py-2 font-medium"><div className="flex items-center gap-2"><img src={p.image} alt="" className="w-8 h-8 rounded object-cover" /><div><p>{p.name}</p><p className="text-[10px] text-gray-400 max-w-[260px] truncate">{p.description}</p></div></div></td><td className="px-4 py-2 text-gray-500">{p.category}</td><td className={`px-4 py-2 text-center ${p.stock<10?'text-red-600 font-bold':''}`}>{p.stock}</td><td className="px-4 py-2 text-right">₱{p.price.toFixed(2)}</td><td className="px-4 py-2 text-center">⭐ {p.rating} ({p.reviews})</td>
                      <td className="px-4 py-2"><div className="flex items-center justify-center gap-1"><button onClick={() => startEditProduct(p)} className="border border-gray-300 px-2 py-1 rounded text-[10px] hover:bg-cream flex items-center gap-1"><Edit size={11} /> Edit</button><button onClick={() => { store.addStock(p.id, 10); onNotify(`+10 ${p.name}`); }} className="border border-gray-300 px-2 py-1 rounded text-[10px] hover:bg-cream"><Plus size={10} className="inline" /> +10</button><button onClick={() => { if (store.deleteProduct(p.id)) onNotify(`${p.name} deleted and removed from the system!`); }} className="border border-red-200 text-red-500 px-2 py-1 rounded text-[10px] hover:bg-red-50 flex items-center gap-1"><Trash2 size={11} /> Delete</button></div></td>
                    </tr>
                  ))}</tbody></table>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {tab === 'inventory' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">Inventory Management</h2></div>
            <table className="w-full text-xs"><thead><tr className="border-b border-cream-dark text-gray-500 uppercase text-[10px]"><th className="text-left px-4 py-2">Item</th><th className="text-center px-4 py-2">Current Stock</th><th className="text-center px-4 py-2">Status</th><th className="text-center px-4 py-2">Actions</th></tr></thead>
              <tbody>{store.allProducts.map(p => (
                <tr key={p.id} className="border-b border-cream-dark last:border-0"><td className="px-4 py-2 font-medium">{p.name}</td><td className="px-4 py-2 text-center font-bold">{p.stock}</td>
                  <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded text-[9px] font-medium ${p.stock<10?'bg-red-100 text-red-700':p.stock<20?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>{p.stock<10?'Low':p.stock<20?'Medium':'Good'}</span></td>
                  <td className="px-4 py-2 text-center flex justify-center gap-1"><button onClick={() => { store.addStock(p.id, 10); onNotify(`+10`); }} className="border border-gray-300 px-2 py-0.5 rounded text-[10px] hover:bg-cream">+10</button><button onClick={() => { store.addStock(p.id, 50); onNotify(`+50`); }} className="border border-gray-300 px-2 py-0.5 rounded text-[10px] hover:bg-cream">+50</button></td>
                </tr>
              ))}</tbody></table>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">All Orders ({store.orders.length})</h2></div>
            <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="bg-maroon text-white"><th className="text-left px-4 py-2">ID</th><th className="text-left px-4 py-2">Customer</th><th className="text-left px-4 py-2">Contact</th><th className="text-left px-4 py-2">Street</th><th className="text-left px-4 py-2">Address</th><th className="text-left px-4 py-2">Items</th><th className="text-left px-4 py-2">Type</th><th className="text-right px-4 py-2">Total</th><th className="text-center px-4 py-2">Status</th><th className="text-center px-4 py-2">Action</th></tr></thead>
              <tbody>{store.orders.map(o => (
                <tr key={o.id} className="border-b border-cream-dark last:border-0 hover:bg-beige/30"><td className="px-4 py-2 font-bold text-maroon">#ORD-000{o.id}</td><td className="px-4 py-2">{o.customerName}</td><td className="px-4 py-2 text-gray-600 whitespace-nowrap">{o.customerPhone || store.getUserByEmail(o.customer)?.phone || '-'}</td><td className="px-4 py-2 text-gray-500 min-w-[130px]">{o.customerStreet || store.getUserByEmail(o.customer)?.street || '-'}</td><td className="px-4 py-2 text-gray-500 min-w-[180px]">{o.customerAddress || store.getUserByEmail(o.customer)?.address || '-'}</td><td className="px-4 py-2 text-gray-600 max-w-[150px] truncate">{o.items}</td>
                  <td className="px-4 py-2"><span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${o.type==='Walk-in'?'bg-blue-50 text-blue-700':'bg-purple-50 text-purple-700'}`}>{o.type}</span></td>
                  <td className="px-4 py-2 text-right font-bold">₱{o.total.toFixed(2)}</td><td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${sC(o.status)}`}>{o.status}</span></td>
                  <td className="px-4 py-2 text-center flex justify-center gap-1">{o.status!=='COMPLETED'&&<button onClick={()=>{store.updateOrderStatus(o.id);onNotify('Updated!');}} className="bg-maroon text-white px-2 py-0.5 rounded text-[10px] hover:bg-maroon-dark">Advance</button>}<button onClick={()=>{store.deleteOrder(o.id);onNotify('Deleted');}} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button></td>
                </tr>
              ))}</tbody></table></div>
          </div>
        )}

        {tab === 'reservations' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">Reservations ({store.reservations.length})</h2></div>
            {store.reservations.length===0?<div className="p-8 text-center text-gray-400 text-sm">No reservations.</div>:(
              <div className="divide-y divide-cream-dark">{store.reservations.map(r => (
                <div key={r.id} className="px-4 py-3 flex items-center justify-between"><div><p className="font-bold text-sm">#RES-00{r.id} — {r.name}</p><p className="text-[11px] text-gray-500">{r.date} · {r.time} · {r.type} · {r.items}</p></div>
                  <div className="flex items-center gap-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.status==='confirmed'?'bg-green-100 text-green-700':r.status==='preparing'?'bg-yellow-100 text-yellow-700':'bg-orange-100 text-orange-700'}`}>{r.status}</span>
                    {r.status==='pending'&&<button onClick={()=>{store.updateReservationStatus(r.id,'confirmed');onNotify('Confirmed!');}} className="bg-maroon text-white px-2 py-1 rounded text-[10px] font-medium">Confirm</button>}</div>
                </div>
              ))}</div>
            )}
          </div>
        )}

        {tab === 'feedback' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-dark"><h2 className="font-bold text-sm">Customer Feedback ({store.feedbacks.length})</h2></div>
            {store.feedbacks.length===0?<div className="p-8 text-center text-gray-400 text-sm">No feedback yet.</div>:(
              <div className="divide-y divide-cream-dark">{store.feedbacks.map(f => (
                <div key={f.id} className={`px-4 py-4 ${f.read?'':'bg-yellow-50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2"><p className="font-bold text-sm">{f.subject}</p>{!f.read&&<span className="text-[9px] bg-red-500 text-white px-1 py-0.5 rounded">NEW</span>}{f.reply&&<span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">REPLIED</span>}</div>
                      <p className="text-[11px] text-gray-500">{f.name} ({f.email}) — {f.date}</p>
                      <p className="text-xs text-gray-600 mt-1">{f.message}</p>
                      {f.reply && (
                        <div className="mt-3 bg-cream rounded-lg p-3">
                          <p className="text-[10px] text-maroon font-bold uppercase tracking-wider">Your Reply</p>
                          <p className="text-xs text-gray-700 mt-1">{f.reply}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{f.repliedBy} · {f.repliedAt} · {f.readByCustomer ? 'Seen by customer' : 'Unread by customer'}</p>
                        </div>
                      )}
                    </div>
                    {!f.read&&<button onClick={()=>{store.markFeedbackRead(f.id);onNotify('Read');}} className="text-[11px] text-maroon font-medium hover:underline shrink-0">Mark Read</button>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={feedbackReplies[f.id] || ''}
                      onChange={e => setFeedbackReplies({ ...feedbackReplies, [f.id]: e.target.value })}
                      placeholder={f.reply ? 'Write another reply...' : 'Write admin reply...'}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-maroon outline-none"
                    />
                    <button onClick={() => sendFeedbackReply(f.id)} className="bg-maroon text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-maroon-dark transition-colors">Reply</button>
                  </div>
                </div>
              ))}</div>
            )}
          </div>
        )}

        {tab === 'reports' && (
          <div className="animate-fade-in-up space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{ l: 'Total Sales', v: `₱${(store.totalSales + 168250).toLocaleString()}` },{ l: 'Total Orders', v: store.orders.length + 240 },{ l: 'Completed', v: store.completedCount + 200 },{ l: 'Pending', v: store.pendingCount }].map((s,i) => (
                <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border border-cream-dark"><p className="text-[10px] text-gray-500 uppercase font-semibold">{s.l}</p><p className="text-xl font-bold text-gray-900 mt-1">{s.v}</p></div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-cream-dark p-6">
            <h2 className="font-bold text-sm mb-5">System Settings</h2>
            <div className="space-y-4 max-w-lg">
              {[{ l:'Store Name',k:'storeName' as const},{ l:'Contact Email',k:'contactEmail' as const},{ l:'Phone',k:'phone' as const},{ l:'Address',k:'address' as const},{ l:'Hours',k:'hours' as const},{ l:'Facebook',k:'facebook' as const}].map(f => (
                <div key={f.k}><label className="text-xs font-medium text-gray-700 block mb-1">{f.l}</label><input type="text" value={settingsForm[f.k]} onChange={e=>setSettingsForm({...settingsForm,[f.k]:e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" /></div>
              ))}
              <button onClick={() => { store.updateSettings(settingsForm); onNotify('Settings saved!'); }} className="bg-maroon text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-maroon-dark">Save Changes</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
