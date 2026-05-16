import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }
export default function ReservationsPage({ onNavigate, onNotify, onRequireLogin }: P) {
  const store = useStore();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '', guests: '2', notes: '', type: 'Pick-up', items: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store.currentUser) { onRequireLogin(); return; }
    if (!store.currentUser.phone || !store.currentUser.street || !store.currentUser.address) {
      onNotify('Please complete My Information before making a reservation.');
      onNavigate('dashboard');
      return;
    }
    store.addReservation({ name: form.name || store.currentUser.name, email: form.email || store.currentUser.email, date: form.date, time: form.time, guests: parseInt(form.guests), notes: form.notes, type: form.type, items: form.items || `${form.guests} items`, phone: store.currentUser.phone, street: store.currentUser.street, address: store.currentUser.address });
    setDone(true); onNotify('Reservation confirmed!');
  };
  if (done) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
      <h2 className="font-serif text-2xl font-bold mb-2">Reservation Confirmed!</h2>
      <p className="text-gray-500 text-sm mb-6">We'll see you on {form.date} at {form.time}.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => { setDone(false); setForm({ name: '', email: '', date: '', time: '', guests: '2', notes: '', type: 'Pick-up', items: '' }); }} className="bg-maroon text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-maroon-dark">Make Another</button>
        <button onClick={() => onNavigate('home')} className="border border-maroon text-maroon px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-maroon hover:text-white">Back to Home</button>
      </div>
    </div>
  );
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2 text-center">Book a Reservation</h1>
      <p className="text-center text-gray-500 text-sm mb-8">Reserve your kakanin for pick-up or delivery</p>
      <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Full Name</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" placeholder="Janine Batle" /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Time</label><select value={form.time} onChange={e=>setForm({...form,time:e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none"><option value="">Select</option>{['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none"><option>Pick-up</option><option>Deliver</option></select></div>
          </div>
          <div><label className="text-xs font-medium text-gray-700 block mb-1">Notes</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none resize-none" placeholder="Special requests..." /></div>
          <button type="submit" className="w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-maroon-dark transition-colors">Confirm Reservation</button>
        </form>
      </div>
    </div>
  );
}
