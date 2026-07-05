import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subMonths } from 'date-fns';
import { db } from '../db/db';
import { useApp } from '../context/AppContext';
import { inMonth, categoryBreakdown, monthlySeries } from '../utils/calculations';
import { categoryColor } from '../utils/categories';
import { formatINR, formatCompactINR } from '../utils/currency';

export default function Analytics() {
  const { currentUser } = useApp();
  const [monthOffset, setMonthOffset] = useState(0);

  const transactions = useLiveQuery(
    () => db.transactions.where('userId').equals(currentUser.id).toArray(),
    [currentUser.id]
  );

  const refDate = subMonths(new Date(), monthOffset);
  const monthTx = useMemo(() => (transactions ? inMonth(transactions, refDate) : []), [transactions, monthOffset]);
  const breakdown = useMemo(() => categoryBreakdown(monthTx, 'expense'), [monthTx]);
  const series = useMemo(() => (transactions ? monthlySeries(transactions, 6) : []), [transactions]);

  if (!transactions) return null;

  const totalExpense = breakdown.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="screen">
      <div className="screen-header-row">
        <h2>Analytics</h2>
        <div className="month-switcher">
          <button className="icon-btn" onClick={() => setMonthOffset((m) => m + 1)}>‹</button>
          <span>{format(refDate, 'MMMM yyyy')}</span>
          <button className="icon-btn" onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}>›</button>
        </div>
      </div>

      <div className="card chart-card">
        <h3>Spend by category</h3>
        {breakdown.length === 0 ? (
          <div className="empty-state small">
            <p>No expenses logged for this month.</p>
          </div>
        ) : (
          <div className="pie-row">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {breakdown.map((b) => (
                    <Cell key={b.category} fill={categoryColor(b.category)} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="category-legend">
              {breakdown.map((b) => (
                <div key={b.category} className="category-legend-row">
                  <span className="tx-swatch" style={{ background: categoryColor(b.category) }} />
                  <span className="category-legend-name">{b.category}</span>
                  <span className="num">{formatINR(b.amount)}</span>
                  <span className="stat-caption">{b.pct}%</span>
                </div>
              ))}
              <div className="category-legend-row total-row">
                <span className="category-legend-name">Total</span>
                <span className="num">{formatINR(totalExpense)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card chart-card">
        <h3>Monthly trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={series} margin={{ left: -20, right: 10, top: 10 }}>
            <CartesianGrid stroke="#e6e3db" vertical={false} />
            <XAxis dataKey="label" stroke="#a3a19a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#a3a19a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactINR(v)}
              width={54}
            />
            <Tooltip formatter={(v) => formatINR(v)} />
            <Bar dataKey="income" fill="#3d5c4e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#a25a41" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="legend-row">
          <span><i className="dot positive-dot" /> Income</span>
          <span><i className="dot negative-dot" /> Expense</span>
        </div>
      </div>
    </div>
  );
}
