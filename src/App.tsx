import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { BottomNav, TopBar } from './components/Navigation';
import { Toasts } from './components/Toasts';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { RestaurantPage } from './pages/RestaurantPage';
import { GroupPage } from './pages/GroupPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <ScrollToTop />
        <TopBar />
        <main className="pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/group" element={<GroupPage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <BottomNav />
        <Toasts />
      </AppProvider>
    </HashRouter>
  );
}
