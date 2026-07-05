import { formatINR } from '../utils/currency';
import { categoryColor } from '../utils/categories';

export default function BudgetCard({ category, limit, spent, onSetLimit }) {
  const pct = limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const over = limit ? spent > limit : false;

  return (
    <div className="budget-card">
      <div className="budget-card-top">
        <span className="tx-swatch" style={{ background: categoryColor(category) }} />
        <span className="budget-category">{category}</span>
        <input
          type="number"
          min="0"
          className="budget-limit-input"
          placeholder="Set limit"
          defaultValue={limit || ''}
          onBlur={(e) => onSetLimit(category, Number(e.target.value) || 0)}
        />
      </div>

      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill ${over ? 'over' : ''}`}
          style={{ width: `${limit ? pct : 0}%` }}
        />
      </div>

      <div className="budget-card-footer">
        <span className={`num ${over ? 'negative' : ''}`}>{formatINR(spent)} spent</span>
        <span className="stat-caption">
          {limit ? `of ${formatINR(limit)} · ${pct}%` : 'no limit set'}
        </span>
      </div>
    </div>
  );
}
