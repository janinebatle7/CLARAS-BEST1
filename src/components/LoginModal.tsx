import { useState } from 'react';
import { X, ShoppingBag, User, Lock } from 'lucide-react';
import { useStore } from '../hooks/useStore';

interface LoginModalProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
  onNotify: (msg: string) => void;
}

export default function LoginModal({ onClose, onNavigate, onNotify }: LoginModalProps) {
  const store = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = store.login(email, password);
    if (user) {
      onNotify(`Welcome back, ${user.name}!`);
      onClose();
      if (user.role === 'admin') onNavigate('admin');
      else if (user.role === 'staff') onNavigate('staff');
      else onNavigate('dashboard');
    } else setError('Invalid credentials. Try a demo account below.');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const user = store.addUser(email, name, 'customer');
    if (user) {
      store.login(email, '');
      onNotify(`Account created! Welcome, ${name}!`);
      onClose();
      onNavigate('dashboard');
    } else setError('Email already exists.');
  };

  const quickFill = (e: string) => { setEmail(e); setPassword('demo'); setError(''); };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-slide-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="text-maroon" size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Please log in to continue</h2>
          <p className="text-sm text-gray-500 mt-1">Login or create an account to place an order, make a reservation, or track your orders.</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => { setMode('login'); setError(''); }} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-maroon text-white' : 'bg-cream text-gray-700 hover:bg-cream-dark'}`}>LOGIN</button>
          <button onClick={() => { setMode('signup'); setError(''); }} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-maroon text-white' : 'bg-cream text-gray-700 hover:bg-cream-dark'}`}>SIGN UP</button>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none" />
            </div>
          )}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none" />
          </div>
          {error && <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" className="w-full bg-maroon text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-maroon-dark transition-colors">{mode === 'login' ? 'Login' : 'Create Account'}</button>
        </form>

        <div className="mt-5 pt-4 border-t border-cream-dark">
          <p className="text-[11px] text-gray-400 text-center mb-2">Quick demo login:</p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { l: 'Admin', e: 'admin@clarasbest.com', c: 'bg-maroon/5 text-maroon border-maroon/10' },
              { l: 'Staff', e: 'maria.santos@clarasbest.com', c: 'bg-gold/10 text-gold-dark border-gold/10' },
              { l: 'Customer', e: 'janinebatle@gmail.com', c: 'bg-green-50 text-green-700 border-green-100' },
            ].map(d => (
              <button key={d.e} onClick={() => quickFill(d.e)} className={`text-[10px] py-1.5 px-2 rounded-lg border font-medium transition-all hover:shadow-sm ${d.c} ${email === d.e ? 'ring-2 ring-maroon/20' : ''}`}>{d.l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
