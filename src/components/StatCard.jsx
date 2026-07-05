import { formatINR } from '../utils/currency';

export default function StatCard({ label, amount, tone = 'neutral', caption }) {
  const toneClass = tone === 'positive' ? 'positive' : tone === 'negative' ? 'negative' : '';
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className={`stat-amount num ${toneClass}`}>{formatINR(amount)}</span>
      {caption && <span className="stat-caption">{caption}</span>}
    </div>
  );
}
