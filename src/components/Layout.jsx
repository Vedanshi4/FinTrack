import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import TabBar from './TabBar';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const { currentUser, logout } = useApp();

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header-brand">Finio</span>
        <div className="app-header-user">
          <span
            className="login-avatar login-avatar-sm"
            style={{ background: currentUser?.color || '#4a5a6b' }}
          >
            {currentUser?.name?.charAt(0).toUpperCase()}
          </span>
          <span className="app-header-name">{currentUser?.name}</span>
          <button className="icon-btn" onClick={logout} aria-label="Log out">
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <TabBar />
    </div>
  );
}
