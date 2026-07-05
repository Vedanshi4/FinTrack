import { useState } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { formatINR } from '../utils/currency';

export default function GoalCard({ goal, onContribute, onEdit, onDelete }) {
  const [amount, setAmount] = useState('');
  const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100) || 0);
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const done = goal.savedAmount >= goal.targetAmount;

  function submitContribution(e) {
    e.preventDefault();
    const n = Number(amount);
    if (!n || n <= 0) return;
    onContribute(goal, n);
    setAmount('');
  }

  return (
    <div className="goal-card">
      <div className="goal-card-top">
        <div>
          <h3>{goal.title}</h3>
          {goal.deadline && <span className="goal-deadline">by {goal.deadline}</span>}
        </div>
        <div className="tx-actions">
          <button className="icon-btn" onClick={() => onEdit(goal)} aria-label="Edit goal">
            <Pencil size={14} />
          </button>
          <button className="icon-btn" onClick={() => onDelete(goal.id)} aria-label="Delete goal">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="goal-ring-row">
        <svg viewBox="0 0 80 80" className="goal-ring">
          <circle cx="40" cy="40" r="34" className="goal-ring-track" />
          <circle
            cx="40"
            cy="40"
            r="34"
            className="goal-ring-fill"
            style={{
              strokeDasharray: `${2 * Math.PI * 34}`,
              strokeDashoffset: `${2 * Math.PI * 34 * (1 - pct / 100)}`,
            }}
          />
          <text x="40" y="45" textAnchor="middle" className="goal-ring-label">
            {pct}%
          </text>
        </svg>
        <div className="goal-numbers">
          <div>
            <span className="stat-label">Saved</span>
            <span className="num positive">{formatINR(goal.savedAmount)}</span>
          </div>
          <div>
            <span className="stat-label">Target</span>
            <span className="num">{formatINR(goal.targetAmount)}</span>
          </div>
          <div>
            <span className="stat-label">{done ? 'Status' : 'Remaining'}</span>
            <span className="num">{done ? 'Reached 🎉' : formatINR(remaining)}</span>
          </div>
        </div>
      </div>

      <form className="goal-contribute" onSubmit={submitContribution}>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Add contribution…"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit" className="icon-btn" aria-label="Add contribution">
          <PlusCircle size={20} />
        </button>
      </form>
    </div>
  );
}
