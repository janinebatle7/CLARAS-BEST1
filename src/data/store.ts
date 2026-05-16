import { Product, Order, User, CartItem, Reservation, Feedback, StoreSettings } from './types';

export const products: Product[] = [
  { id: 1, name: 'Bibingka Special', price: 120, image: '/images/bibingka.jpg', description: 'Traditional rice cake baked in clay pot, topped with salted egg and cheese.', category: 'Rice Cakes', stock: 45, rating: 4.8, reviews: 124 },
  { id: 2, name: 'Puto Bumbong', price: 100, image: '/images/puto.jpg', description: 'Purple steamed rice cake with butter, muscovado sugar, and grated coconut.', category: 'Steamed Delicacies', stock: 32, rating: 4.7, reviews: 98 },
  { id: 3, name: 'Kutsinta', price: 100, image: '/images/kutsinta.jpg', description: 'Brown sticky rice cake topped with freshly grated coconut.', category: 'Glutinous Delicacies', stock: 51, rating: 4.6, reviews: 86 },
  { id: 4, name: 'Sapin-Sapin', price: 120, image: '/images/sapin-sapin.jpg', description: 'Colorful layered sticky rice dessert with ube, coconut, and jackfruit.', category: 'Layered Delicacies', stock: 28, rating: 4.9, reviews: 110 },
  { id: 5, name: 'Suman', price: 90, image: '/images/suman.jpg', description: 'Glutinous rice wrapped in banana leaves with coconut caramel.', category: 'Glutinous Delicacies', stock: 40, rating: 4.6, reviews: 75 },
  { id: 6, name: 'Cassava Cake', price: 130, image: '/images/bibingka.jpg', description: 'Rich and creamy baked cassava cake with coconut custard topping.', category: 'Baked Delicacies', stock: 35, rating: 4.7, reviews: 92 },
  { id: 7, name: 'Palitaw', price: 100, image: '/images/puto.jpg', description: 'Flat rice cake coated in sesame seeds, sugar, and grated coconut.', category: 'Glutinous Delicacies', stock: 48, rating: 4.5, reviews: 68 },
  { id: 8, name: 'Biko', price: 100, image: '/images/kutsinta.jpg', description: 'Sweet sticky rice cake topped with caramelized coconut cream (latik).', category: 'Glutinous Delicacies', stock: 42, rating: 4.8, reviews: 105 },
  { id: 9, name: 'Puto', price: 80, image: '/images/puto.jpg', description: 'Soft white steamed rice cakes topped with cheese.', category: 'Steamed Delicacies', stock: 55, rating: 4.4, reviews: 88 },
  { id: 10, name: 'Turon (Mini)', price: 40, image: '/images/suman.jpg', description: 'Crispy banana spring rolls with jackfruit and brown sugar.', category: 'Baked Delicacies', stock: 60, rating: 4.5, reviews: 72 },
];

export const initialOrders: Order[] = [
  { id: 128, customer: 'janinebatle@gmail.com', customerName: 'Janine Batle', customerPhone: '09061721844', customerStreet: 'Purok 3', customerAddress: 'Calayugan, Hinunangan, Southern Leyte', items: 'Bibingka Special x1, Puto x2', itemCount: 3, total: 450, status: 'CONFIRMED', type: 'Walk-in', date: 'May 12, 2026', time: '10:30 AM' },
  { id: 127, customer: 'maria.santos@email.com', customerName: 'Maria Santos', items: 'Sapin-Sapin x2, Kutsinta x2', itemCount: 4, total: 780, status: 'PREPARING', type: 'Reservation', date: 'May 10, 2026', time: '10:15 AM' },
  { id: 126, customer: 'pedro@email.com', customerName: 'Pedro Reyes', items: 'Puto Bumbong x2', itemCount: 2, total: 320, status: 'PREPARING', type: 'Walk-in', date: 'May 9, 2026', time: '09:45 AM' },
  { id: 125, customer: 'ana@email.com', customerName: 'Ana Garcia', items: 'Suman x5, Biko x2', itemCount: 5, total: 650, status: 'READY', type: 'Reservation', date: 'May 8, 2026', time: '09:20 AM' },
  { id: 124, customer: 'liza@email.com', customerName: 'Liza Gomez', items: 'Kutsinta x3', itemCount: 2, total: 230, status: 'COMPLETED', type: 'Walk-in', date: 'May 7, 2026', time: '08:50 AM' },
];

export const initialUsers: User[] = [
  { id: 1, email: 'admin@clarasbest.com', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'maria.santos@clarasbest.com', name: 'Maria Santos', role: 'staff', phone: '09686911072', street: 'Poblacion Branch', address: 'Poblacion, Hinunangan, Southern Leyte', shift: '8:00 AM - 5:00 PM' },
  { id: 3, email: 'janinebatle@gmail.com', name: 'Janine Batle', role: 'customer', phone: '09061721844', street: 'Purok 3', address: 'Calayugan, Hinunangan, Southern Leyte' },
  { id: 4, email: 'maria.santos@email.com', name: 'Maria Santos', role: 'customer', phone: '09281234567', street: 'Canipaan Road', address: 'Brgy. Canipaan, Hinunangan, Southern Leyte' },
  { id: 5, email: 'pedro@email.com', name: 'Pedro Reyes', role: 'customer', phone: '09391234567', street: 'Badiangon Main Road', address: 'Brgy. Badiangon, Hinunangan, Southern Leyte' },
  { id: 6, email: 'ana@email.com', name: 'Ana Garcia', role: 'customer', phone: '09451234567', street: 'Tahusan Coastal Road', address: 'Brgy. Tahusan, Hinunangan, Southern Leyte' },
  { id: 7, email: 'liza@email.com', name: 'Liza Gomez', role: 'customer', phone: '09561234567', street: 'Talisay Street', address: 'Brgy. Talisay, Hinunangan, Southern Leyte' },
  { id: 8, email: 'jose@email.com', name: 'Jose Rizal', role: 'customer', phone: '09671234567', street: 'Nueva Esperanza Road', address: 'Brgy. Nueva Esperanza, Hinunangan, Southern Leyte' },
  { id: 9, email: 'clara@email.com', name: 'Clara Reyes', role: 'customer', phone: '09781234567', street: 'Lungsodaan Road', address: 'Brgy. Lungsodaan, Hinunangan, Southern Leyte' },
];

class AppStore {
  private _orders: Order[] = [...initialOrders];
  private _cart: CartItem[] = [];
  private _currentUser: User | null = null;
  private _products: Product[] = [...products];
  private _users: User[] = [...initialUsers];
  private _reservations: Reservation[] = [
    { id: 8, name: 'Christian Bautista', email: 'christian@email.com', date: '2026-05-14', time: '09:00 AM', guests: 4, notes: '', status: 'confirmed', type: 'Pick-up', items: '3 items' },
    { id: 7, name: 'Rizza Mae', email: 'rizza@email.com', date: '2026-05-14', time: '11:00 AM', guests: 2, notes: '', status: 'confirmed', type: 'Pick-up', items: '2 items' },
  ];
  private _feedbacks: Feedback[] = [];
  private _settings: StoreSettings = {
    storeName: "Clara's Best Kakanin Delicacies",
    contactEmail: 'clarasbest.kakanin@gmail.com',
    phone: '09686911072',
    address: 'Poblacion, Hinunangan, Southern Leyte',
    hours: 'Mon – Sun, 8:00 AM – 5:00 PM',
    facebook: 'Mary Claire Co-Baximen',
  };
  private _listeners: Set<() => void> = new Set();
  private _syncTimer: number | null = null;
  private _hydrating = false;

  subscribe(listener: () => void): () => void {
    this._listeners.add(listener);
    return () => { this._listeners.delete(listener); };
  }
  private notify() {
    this._listeners.forEach(l => l());
    if (!this._hydrating) this.schedulePersist();
  }

  get orders() { return this._orders; }
  get cart() { return this._cart; }
  get currentUser() { return this._currentUser; }
  get allProducts() { return this._products; }
  get allUsers() { return this._users; }
  get reservations() { return this._reservations; }
  get feedbacks() { return this._feedbacks; }
  get settings() { return this._settings; }

  private snapshot() {
    return {
      products: this._products,
      users: this._users,
      orders: this._orders,
      reservations: this._reservations,
      feedbacks: this._feedbacks,
      settings: this._settings,
    };
  }

  async loadFromBackend() {
    try {
      const apiBase = ((import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL) || '';
      const response = await fetch(`${apiBase}/api/bootstrap`);
      if (!response.ok) throw new Error('Unable to load system data');
      const payload = await response.json();
      if (!payload.state) {
        this.persistNow();
        return;
      }
      this._hydrating = true;
      this._products = payload.state.products || this._products;
      this._users = payload.state.users || this._users;
      this._orders = payload.state.orders || this._orders;
      this._reservations = payload.state.reservations || this._reservations;
      this._feedbacks = payload.state.feedbacks || this._feedbacks;
      this._settings = payload.state.settings || this._settings;
      this._hydrating = false;
      this._listeners.forEach(l => l());
    } catch (error) {
      console.warn('Backend database sync unavailable. Using local demo data.', error);
    }
  }

  private schedulePersist() {
    if (typeof window === 'undefined') return;
    if (this._syncTimer) window.clearTimeout(this._syncTimer);
    this._syncTimer = window.setTimeout(() => this.persistNow(), 350);
  }

  private async persistNow() {
    try {
      const apiBase = ((import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL) || '';
      await fetch(`${apiBase}/api/snapshot`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: this.snapshot() }),
      });
    } catch (error) {
      console.warn('Unable to persist system data to backend.', error);
    }
  }

  login(email: string, _password: string): User | null {
    const user = this._users.find(u => u.email === email);
    if (user) { this._currentUser = user; this.notify(); return user; }
    return null;
  }
  logout() { this._currentUser = null; this._cart = []; this.notify(); }

  updateCurrentUserContact(phone: string, street: string, address: string): User | null {
    if (!this._currentUser) return null;
    const user = this._users.find(u => u.id === this._currentUser!.id);
    if (!user) return null;
    user.phone = phone;
    user.street = street;
    user.address = address;
    this._currentUser = { ...user };
    this._users = [...this._users];
    this.syncUserRecords(user);
    this.notify();
    return this._currentUser;
  }

  updateCurrentUserInfo(data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'street' | 'address' | 'shift'>>): User | null {
    if (!this._currentUser) return null;
    const user = this._users.find(u => u.id === this._currentUser!.id);
    if (!user) return null;
    if (data.email && this._users.some(u => u.email === data.email && u.id !== user.id)) return null;
    const oldEmail = user.email;
    Object.assign(user, data);
    this._currentUser = { ...user };
    this._users = [...this._users];
    this.syncUserRecords(user, oldEmail);
    this.notify();
    return this._currentUser;
  }

  private syncUserRecords(user: User, oldEmail = user.email) {
    this._orders = this._orders.map(order => order.customer === oldEmail || order.customer === user.email ? {
      ...order,
      customer: user.email,
      customerName: user.name,
      customerPhone: user.phone,
      customerStreet: user.street,
      customerAddress: user.address,
    } : order);
    this._reservations = this._reservations.map(res => res.email === oldEmail || res.email === user.email ? {
      ...res,
      email: user.email,
      name: user.name,
      phone: user.phone,
      street: user.street,
      address: user.address,
    } : res);
    this._feedbacks = this._feedbacks.map(feedback => feedback.email === oldEmail || feedback.email === user.email ? {
      ...feedback,
      email: user.email,
      name: user.name,
    } : feedback);
  }

  getUserByEmail(email: string): User | undefined {
    return this._users.find(u => u.email === email);
  }

  addToCart(product: Product): boolean {
    if (product.stock <= 0) return false;
    const existing = this._cart.find(item => item.id === product.id);
    if (existing) { if (existing.quantity >= product.stock) return false; existing.quantity += 1; }
    else { this._cart.push({ ...product, quantity: 1 }); }
    this._cart = [...this._cart]; this.notify(); return true;
  }
  removeFromCart(productId: number) { this._cart = this._cart.filter(item => item.id !== productId); this.notify(); }
  updateCartQuantity(productId: number, quantity: number) {
    if (quantity <= 0) { this.removeFromCart(productId); return; }
    const product = this._products.find(p => p.id === productId);
    if (product && quantity > product.stock) return;
    const item = this._cart.find(i => i.id === productId);
    if (item) { item.quantity = quantity; this._cart = [...this._cart]; this.notify(); }
  }
  clearCart() { this._cart = []; this.notify(); }
  get cartTotal() { return this._cart.reduce((s, i) => s + i.price * i.quantity, 0); }
  get cartCount() { return this._cart.reduce((s, i) => s + i.quantity, 0); }

  placeOrder(
    type: 'Walk-in' | 'Reservation' = 'Reservation',
    options: { customerName?: string; customer?: string; status?: Order['status'] } = {},
  ): Order | null {
    if (this._cart.length === 0) return null;
    for (const ci of this._cart) { const p = this._products.find(pp => pp.id === ci.id); if (p) p.stock = Math.max(0, p.stock - ci.quantity); }
    const customerRecord = options.customer ? this._users.find(u => u.email === options.customer) : this._currentUser;
    const newOrder: Order = {
      id: Math.max(0, ...this._orders.map(o => o.id)) + 1,
      customer: options.customer || this._currentUser?.email || (type === 'Walk-in' ? 'walk-in' : 'guest'),
      customerName: options.customerName || this._currentUser?.name || (type === 'Walk-in' ? 'Walk-in Customer' : 'Guest Customer'),
      customerPhone: customerRecord?.phone,
      customerStreet: customerRecord?.street,
      customerAddress: customerRecord?.address,
      items: this._cart.map(i => `${i.name} x${i.quantity}`).join(', '),
      itemCount: this._cart.reduce((s, i) => s + i.quantity, 0),
      total: this.cartTotal, status: options.status || 'PENDING', type,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    this._orders = [newOrder, ...this._orders]; this._products = [...this._products]; this._cart = []; this.notify(); return newOrder;
  }
  updateOrderStatus(orderId: number): Order['status'] | null {
    const order = this._orders.find(o => o.id === orderId); if (!order) return null;
    const flow: Record<string, Order['status']> = { PENDING: 'CONFIRMED', CONFIRMED: 'PREPARING', PREPARING: 'READY', READY: 'COMPLETED' };
    const next = flow[order.status]; if (next) { order.status = next; this._orders = [...this._orders]; this.notify(); return next; } return null;
  }
  deleteOrder(orderId: number) { this._orders = this._orders.filter(o => o.id !== orderId); this.notify(); }
  getCustomerOrders() { if (!this._currentUser) return []; return this._orders.filter(o => o.customer === this._currentUser!.email); }

  addStock(productId: number, amount: number) { const p = this._products.find(pp => pp.id === productId); if (p) { p.stock = Math.max(0, p.stock + amount); this._products = [...this._products]; this.notify(); } }
  updateProductPrice(productId: number, price: number) { const p = this._products.find(pp => pp.id === productId); if (p && price > 0) { p.price = price; this._products = [...this._products]; this.notify(); } }

  addProduct(data: Omit<Product, 'id'>): Product {
    const product: Product = { ...data, id: Math.max(0, ...this._products.map(p => p.id)) + 1 };
    this._products = [product, ...this._products];
    this.notify();
    return product;
  }

  updateProduct(productId: number, updates: Partial<Omit<Product, 'id'>>): Product | null {
    const product = this._products.find(p => p.id === productId);
    if (!product) return null;
    Object.assign(product, updates);
    this._products = [...this._products];
    this.notify();
    return product;
  }

  deleteProduct(productId: number): boolean {
    const exists = this._products.some(p => p.id === productId);
    if (!exists) return false;
    this._products = this._products.filter(p => p.id !== productId);
    this._cart = this._cart.filter(item => item.id !== productId);
    this.notify();
    return true;
  }

  deleteUser(userId: number) { if (userId === this._currentUser?.id) return; this._users = this._users.filter(u => u.id !== userId); this.notify(); }
  addUser(email: string, name: string, role: User['role']): User | null {
    if (this._users.find(u => u.email === email)) return null;
    const u: User = { id: Math.max(0, ...this._users.map(x => x.id)) + 1, email, name, role };
    this._users = [...this._users, u]; this.notify(); return u;
  }

  addReservation(data: Omit<Reservation, 'id' | 'status'>): Reservation {
    const r: Reservation = { ...data, phone: data.phone || this._currentUser?.phone, street: data.street || this._currentUser?.street, address: data.address || this._currentUser?.address, id: Math.max(0, ...this._reservations.map(x => x.id), 100) + 1, status: 'pending' };
    this._reservations = [r, ...this._reservations]; this.notify(); return r;
  }
  updateReservationStatus(id: number, status: Reservation['status']) { const r = this._reservations.find(x => x.id === id); if (r) { r.status = status; this._reservations = [...this._reservations]; this.notify(); } }

  addFeedback(data: Omit<Feedback, 'id' | 'date' | 'read'>): Feedback {
    const f: Feedback = { ...data, id: Math.max(0, ...this._feedbacks.map(x => x.id), 100) + 1, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), read: false, readByCustomer: false };
    this._feedbacks = [f, ...this._feedbacks]; this.notify(); return f;
  }
  markFeedbackRead(id: number) { const f = this._feedbacks.find(x => x.id === id); if (f) { f.read = true; this._feedbacks = [...this._feedbacks]; this.notify(); } }
  replyToFeedback(id: number, reply: string, repliedBy = 'Admin User'): Feedback | null {
    const f = this._feedbacks.find(x => x.id === id);
    if (!f) return null;
    f.reply = reply;
    f.repliedAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    f.repliedBy = repliedBy;
    f.read = true;
    f.readByCustomer = false;
    this._feedbacks = [...this._feedbacks];
    this.notify();
    return f;
  }
  getCurrentUserFeedbacks(): Feedback[] {
    if (!this._currentUser) return [];
    return this._feedbacks.filter(f => f.email === this._currentUser!.email);
  }
  markCustomerFeedbackReplyRead(id: number) {
    const f = this._feedbacks.find(x => x.id === id);
    if (f) { f.readByCustomer = true; this._feedbacks = [...this._feedbacks]; this.notify(); }
  }
  updateSettings(s: Partial<StoreSettings>) { this._settings = { ...this._settings, ...s }; this.notify(); }

  get totalSales() { return this._orders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + o.total, 0); }
  get activeDeliveries() { return this._orders.filter(o => o.status !== 'COMPLETED').length; }
  get registeredCustomers() { return this._users.filter(u => u.role === 'customer').length; }
  get pendingCount() { return this._orders.filter(o => o.status === 'PENDING').length; }
  get confirmedCount() { return this._orders.filter(o => o.status === 'CONFIRMED').length; }
  get preparingCount() { return this._orders.filter(o => o.status === 'PREPARING').length; }
  get readyCount() { return this._orders.filter(o => o.status === 'READY').length; }
  get completedCount() { return this._orders.filter(o => o.status === 'COMPLETED').length; }
  get lowStockProducts() { return this._products.filter(p => p.stock < 15); }
  get categories() { return Array.from(new Set(this._products.map(p => p.category))); }
}

export const appStore = new AppStore();
