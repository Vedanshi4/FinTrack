import { useLiveQuery } from 'dexie-react-hooks';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { db } from '../db/db';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { totalsFor, inMonth, monthlySeries, netWorth } from '../utils/calculations';
import { formatCompactINR, formatINR } from '../utils/currency';

export default function Home() {
  const { currentUser } = useApp();
  const transactions = useLiveQuery(
    () => db.transactions.where('userId').equals(currentUser.id).toArray(),
    [currentUser.id]
  );

  if (!transactions) return null;

  const all = totalsFor(transactions);
  const worth = netWorth(transactions);
  const monthTx = inMonth(transactions);
  const month = totalsFor(monthTx);
  const savings = month.income - month.expense;
  const savingsRate = month.income ? Math.round((savings / month.income) * 100) : 0;
  const series = monthlySeries(transactions, 6);

  return (
    <div className="screen">
      <div className="net-worth-block">
        <span className="stat-label">Net worth</span>
        <span className={`net-worth-number num ${worth >= 0 ? 'positive' : 'negative'}`}>
          {formatINR(worth)}
        </span>
        <span className="stat-caption">all-time income minus expense</span>
      </div>

      <div className="stat-grid">
        <StatCard label="Income (this month)" amount={month.income} tone="positive" />
        <StatCard label="Expense (this month)" amount={month.expense} tone="negative" />
        <StatCard
          label="Savings (this month)"
          amount={savings}
          tone={savings >= 0 ? 'positive' : 'negative'}
          caption={`${savingsRate}% of income`}
        />
        <StatCard label="Lifetime income" amount={all.income} />
      </div>

      <div className="card chart-card">
        <h3>Income vs. expense — last 6 months</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={series} margin={{ left: -20, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3d5c4e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3d5c4e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a25a41" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#a25a41" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Tooltip
              formatter={(v) => formatINR(v)}
              contentStyle={{ borderRadius: 8, border: '1px solid #e6e3db', fontSize: 13 }}
            />
            <Area type="monotone" dataKey="income" stroke="#3d5c4e" fill="url(#incomeFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="expense" stroke="#a25a41" fill="url(#expenseFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="legend-row">
          <span><i className="dot positive-dot" /> Income</span>
          <span><i className="dot negative-dot" /> Expense</span>
        </div>
      </div>
    </div>
  );
}
