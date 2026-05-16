import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }
export default function ContactPage({ onNavigate, onNotify }: P) {
  const store = useStore();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); store.addFeedback(form); setSent(true); onNotify('Message sent!'); };
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2 text-center">Contact Us</h1>
      <p className="text-center text-gray-500 text-sm mb-8">We'd love to hear from you!</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[{ i: <MapPin size={18} />, t: 'Location', d: store.settings.address },{ i: <Phone size={18} />, t: 'Phone', d: store.settings.phone },{ i: <Mail size={18} />, t: 'Email', d: store.settings.contactEmail },{ i: <Clock size={18} />, t: 'Hours', d: store.settings.hours }].map((c,i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-cream-dark flex items-start gap-3"><div className="text-maroon shrink-0 mt-0.5">{c.i}</div><div><p className="font-bold text-xs text-gray-900">{c.t}</p><p className="text-xs text-gray-600 mt-0.5">{c.d}</p></div></div>
          ))}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-cream-dark"><p className="font-bold text-xs text-gray-900 mb-1">Facebook</p><p className="text-xs text-gray-600">{store.settings.facebook}</p></div>
        </div>
        <div className="md:col-span-2">
          {sent ? (
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-10 text-center">
              <CheckCircle className="mx-auto text-green-500 mb-3" size={48} /><h2 className="font-bold text-lg mb-1">Message Sent!</h2><p className="text-gray-500 text-sm mb-4">We'll get back to you soon.</p>
              <div className="flex justify-center gap-3"><button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="bg-maroon text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-maroon-dark">Send Another</button><button onClick={() => onNavigate('home')} className="border border-maroon text-maroon px-5 py-2 rounded-lg text-sm font-medium hover:bg-maroon hover:text-white">Back to Home</button></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-medium text-gray-700 block mb-1">Name</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" /></div>
                <div><label className="text-xs font-medium text-gray-700 block mb-1">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" /></div></div>
                <div><label className="text-xs font-medium text-gray-700 block mb-1">Subject</label><input type="text" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none" /></div>
                <div><label className="text-xs font-medium text-gray-700 block mb-1">Message</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required rows={4} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-maroon outline-none resize-none" /></div>
                <button type="submit" className="w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-maroon-dark flex items-center justify-center gap-2 text-sm"><Send size={16} /> Send Message</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
