import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const isKanbanPage = location.pathname === '/tools/kanban';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-grow text-gray-900 dark:text-white">
        <Outlet />
      </main>
      {!isKanbanPage && <Footer />}
    </div>
  );
}