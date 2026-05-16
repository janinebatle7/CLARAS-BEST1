import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrderPage from './pages/OrderPage';
import ReservationsPage from './pages/ReservationsPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import AdminPanel from './pages/AdminPanel';
import StaffPanel from './pages/StaffPanel';
import CustomerDashboard from './pages/CustomerDashboard';
import { useNotification } from './hooks/useStore';
import { appStore } from './data/store';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const { message, show } = useNotification();

  const navigate = (page: string) => { setCurrentPage(page); window.scrollTo(0, 0); };
  const requireLogin = () => setShowLogin(true);

  const hideNavbar = ['admin', 'staff', 'dashboard'].includes(currentPage);

  useEffect(() => {
    const h = () => setCurrentPage(window.location.hash.replace('#', '') || 'home');
    window.addEventListener('popstate', h);
    return () => window.removeEventListener('popstate', h);
  }, []);
  useEffect(() => {
    appStore.loadFromBackend().catch(() => show('Database sync unavailable. Using local demo data.'));
  }, [show]);
  useEffect(() => { window.location.hash = currentPage; }, [currentPage]);

  const p = { onNavigate: navigate, onNotify: show, onRequireLogin: requireLogin };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage {...p} />;
      case 'menu': return <MenuPage {...p} />;
      case 'order': return <OrderPage {...p} />;
      case 'reservations': return <ReservationsPage {...p} />;
      case 'track': return <TrackOrderPage {...p} />;
      case 'about': return <AboutPage {...p} />;
      case 'contact': return <ContactPage {...p} />;
      case 'cart': return <CartPage {...p} />;
      case 'admin': return <AdminPanel {...p} />;
      case 'staff': return <StaffPanel {...p} />;
      case 'dashboard': return <CustomerDashboard {...p} />;
      default: return <HomePage {...p} />;
    }
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {!hideNavbar && <Navbar currentPage={currentPage} onNavigate={navigate} onShowLogin={requireLogin} />}
      {renderPage()}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onNavigate={navigate} onNotify={show} />}
      {message && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
          <div className="bg-maroon text-white px-6 py-3 rounded-full shadow-2xl font-medium text-sm flex items-center gap-2">✅ {message}</div>
        </div>
      )}
    </div>
  );
}
