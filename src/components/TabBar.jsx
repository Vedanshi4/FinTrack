import { NavLink } from 'react-router-dom';
import { LayoutGrid, ArrowLeftRight, PieChart, Target, Wallet } from 'lucide-react';

const TABS = [
  { to: '/', label: 'Home', icon: LayoutGrid, end: true },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/budgets', label: 'Budgets', icon: Wallet },
];

export default function TabBar() {
  return (
    <nav className="tab-bar">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={20} strokeWidth={1.8} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
