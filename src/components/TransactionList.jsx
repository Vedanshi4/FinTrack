import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { categoryColor } from '../utils/categories';

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No entries here yet.</p>
        <span>Log an income or expense to see it show up in this list.</span>
      </div>
    );
  }

  const groups = new Map();
  transactions.forEach((t) => {
    const key = t.date;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  });
  const sortedDates = Array.from(groups.keys()).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="tx-list">
      {sortedDates.map((date) => (
        <div key={date} className="tx-group">
          <div className="tx-group-date">{format(new Date(date), 'EEE, d MMM yyyy')}</div>
          {groups.get(date).map((t) => (
            <div key={t.id} className="tx-row">
              <span className="tx-swatch" style={{ background: categoryColor(t.category) }} />
              <div className="tx-info">
                <span className="tx-category">{t.category}</span>
                <span className="tx-meta">
                  {t.paymentMethod}
                  {t.notes ? ` · ${t.notes}` : ''}
                </span>
              </div>
              <span className={`num tx-amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                {t.type === 'income' ? '+' : '−'}
                {formatINR(t.amount)}
              </span>
              <div className="tx-actions">
                <button className="icon-btn" onClick={() => onEdit(t)} aria-label="Edit">
                  <Pencil size={14} />
                </button>
                <button className="icon-btn" onClick={() => onDelete(t.id)} aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
