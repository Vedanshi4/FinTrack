import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { useApp } from '../context/AppContext';
import { EXPENSE_CATEGORIES } from '../utils/categories';
import { inMonth, categoryBreakdown } from '../utils/calculations';
import BudgetCard from '../components/BudgetCard';
import { formatINR } from '../utils/currency';

export default function Budgets() {
  const { currentUser } = useApp();

  const transactions = useLiveQuery(
    () => db.transactions.where('userId').equals(currentUser.id).toArray(),
    [currentUser.id]
  );
  const budgets = useLiveQuery(
    () => db.budgets.where('userId').equals(currentUser.id).toArray(),
    [currentUser.id]
  );

  const spentByCategory = useMemo(() => {
    if (!transactions) return {};
    const monthTx = inMonth(transactions);
    const breakdown = categoryBreakdown(monthTx, 'expense');
    return Object.fromEntries(breakdown.map((b) => [b.category, b.amount]));
  }, [transactions]);

  const limitByCategory = useMemo(() => {
    if (!budgets) return {};
    return Object.fromEntries(budgets.map((b) => [b.category, b]));
  }, [budgets]);

  async function setLimit(category, limit) {
    const existing = limitByCategory[category];
    if (existing) {
      await db.budgets.update(existing.id, { limit });
    } else {
      await db.budgets.add({ userId: currentUser.id, category, limit });
    }
  }

  const totalLimit = Object.values(limitByCategory).reduce((s, b) => s + (b.limit || 0), 0);
  const totalSpent = Object.values(spentByCategory).reduce((s, v) => s + v, 0);

  if (!transactions || !budgets) return null;

  return (
    <div className="screen">
      <div className="screen-header-row">
        <h2>Budgets</h2>
        <span className="stat-caption">this month</span>
      </div>

      <div className="card budget-summary">
        <div>
          <span className="stat-label">Total spent</span>
          <span className="num negative">{formatINR(totalSpent)}</span>
        </div>
        <div>
          <span className="stat-label">Total budgeted</span>
          <span className="num">{formatINR(totalLimit)}</span>
        </div>
      </div>

      <div className="budget-grid">
        {EXPENSE_CATEGORIES.map((cat) => (
          <BudgetCard
            key={cat}
            category={cat}
            limit={limitByCategory[cat]?.limit || 0}
            spent={spentByCategory[cat] || 0}
            onSetLimit={setLimit}
          />
        ))}
      </div>
    </div>
  );
}
