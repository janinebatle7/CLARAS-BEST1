import { Heart, Award, Leaf, Users, ShoppingBag } from 'lucide-react';
interface P { onNavigate: (p: string) => void; onNotify: (m: string) => void; onRequireLogin: () => void; }
export default function AboutPage({ onNavigate }: P) {
  return (
    <div>
      <section className="relative overflow-hidden"><div className="absolute inset-0"><img src="/images/about-bg.jpg" alt="" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-maroon/70" /></div>
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="font-serif text-4xl font-bold">A Tradition Worth Sharing <Heart className="inline" size={32} /></h1>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">Clara's Best Kakanin Delicacies brings you authentic Filipino flavors, carefully prepared using traditional recipes passed down through generations.</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 py-14"><div className="grid md:grid-cols-2 gap-10 items-center">
        <div><h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">From Home Kitchen to Community Favorite</h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>What started as Lola Clara's weekend tradition of making kakanin has blossomed into a beloved local delicacy business serving the community of Hinunangan, Southern Leyte.</p>
            <p>Every piece of kakanin we serve carries warmth and love. We use only the finest ingredients to ensure every bite tastes like home.</p>
          </div>
        </div>
        <img src="/images/hero-bg.jpg" alt="" className="rounded-xl shadow-xl" />
      </div></section>
      <section className="bg-beige py-14"><div className="max-w-5xl mx-auto px-4">
        <h2 className="font-serif text-2xl font-bold text-center text-gray-900 mb-8">Our Values</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[{ i: <Heart size={24} />, t: 'Made with Love' },{ i: <Award size={24} />, t: 'Premium Quality' },{ i: <Leaf size={24} />, t: 'Traditional Recipes' },{ i: <Users size={24} />, t: 'Community First' }].map((v,i)=>(
            <div key={i} className="bg-white rounded-xl p-5 text-center shadow-sm"><div className="text-maroon flex justify-center mb-2">{v.i}</div><h3 className="font-bold text-sm">{v.t}</h3></div>
          ))}
        </div>
      </div></section>
      <section className="max-w-3xl mx-auto px-4 py-14 text-center">
        <h2 className="font-serif text-2xl font-bold mb-4">Ready to Try Our Kakanin?</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => onNavigate('menu')} className="bg-maroon text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon-dark flex items-center gap-1"><ShoppingBag size={16} /> Browse Menu</button>
          <button onClick={() => onNavigate('contact')} className="border border-maroon text-maroon px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon hover:text-white">Contact Us</button>
        </div>
      </section>
    </div>
  );
}
