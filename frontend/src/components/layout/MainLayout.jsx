import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
