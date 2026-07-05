import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';

export default function FilterBar({ filters, setFilters }) {
  const categories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  return (
    <div className="filter-bar">
      <div className="segmented">
        {['all', 'income', 'expense'].map((t) => (
          <button
            key={t}
            className={filters.type === t ? 'active' : ''}
            onClick={() => setFilters((f) => ({ ...f, type: t }))}
          >
            {t === 'all' ? 'All' : t === 'income' ? 'Income' : 'Expense'}
          </button>
        ))}
      </div>

      <select
        className="filter-select"
        value={filters.category}
        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.range}
        onChange={(e) => setFilters((f) => ({ ...f, range: e.target.value }))}
      >
        <option value="all">All time</option>
        <option value="thisMonth">This month</option>
        <option value="lastMonth">Last month</option>
      </select>
    </div>
  );
}
