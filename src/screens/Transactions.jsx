import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { db } from '../db/db';
import { useApp } from '../context/AppContext';
import FilterBar from '../components/FilterBar';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

export default function Transactions() {
  const { currentUser } = useApp();
  const [filters, setFilters] = useState({ type: 'all', category: 'all', range: 'all' });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const transactions = useLiveQuery(
    () => db.transactions.where('userId').equals(currentUser.id).toArray(),
    [currentUser.id]
  );

  const filtered = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.range !== 'all') {
        const now = new Date();
        const ref = filters.range === 'thisMonth' ? now : subMonths(now, 1);
        const range = { start: startOfMonth(ref), end: endOfMonth(ref) };
        if (!isWithinInterval(new Date(t.date), range)) return false;
      }
      return true;
    });
  }, [transactions, filters]);

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(t) {
    setEditing(t);
    setFormOpen(true);
  }

  async function handleDelete(id) {
    await db.transactions.delete(id);
  }

  return (
    <div className="screen">
      <div className="screen-header-row">
        <h2>Transactions</h2>
        <button className="primary-btn small" onClick={openNew}>
          <Plus size={16} /> Add entry
        </button>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      {transactions ? (
        <TransactionList transactions={filtered} onEdit={openEdit} onDelete={handleDelete} />
      ) : null}

      {formOpen && <TransactionForm editing={editing} onClose={() => setFormOpen(false)} />}
    </div>
  );
}
