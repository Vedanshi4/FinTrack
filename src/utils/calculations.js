import { startOfMonth, endOfMonth, subMonths, format, isWithinInterval } from 'date-fns';

export function totalsFor(transactions) {
  return transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += Number(t.amount);
      else acc.expense += Number(t.amount);
      return acc;
    },
    { income: 0, expense: 0 }
  );
}

export function inMonth(transactions, date = new Date()) {
  const range = { start: startOfMonth(date), end: endOfMonth(date) };
  return transactions.filter((t) => isWithinInterval(new Date(t.date), range));
}

// Returns last `months` entries of { label, month, income, expense } oldest -> newest
export function monthlySeries(transactions, months = 6) {
  const now = new Date();
  const series = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(now, i);
    const monthTx = inMonth(transactions, d);
    const { income, expense } = totalsFor(monthTx);
    series.push({
      label: format(d, 'MMM'),
      month: format(d, 'yyyy-MM'),
      income,
      expense,
      net: income - expense,
    });
  }
  return series;
}

export function categoryBreakdown(transactions, type = 'expense') {
  const filtered = transactions.filter((t) => t.type === type);
  const map = new Map();
  filtered.forEach((t) => {
    map.set(t.category, (map.get(t.category) || 0) + Number(t.amount));
  });
  const total = filtered.reduce((s, t) => s + Number(t.amount), 0);
  return Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      pct: total ? Math.round((amount / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function netWorth(transactions) {
  const { income, expense } = totalsFor(transactions);
  return income - expense;
}
