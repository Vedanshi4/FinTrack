import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, X } from 'lucide-react';
import { db } from '../db/db';
import { useApp } from '../context/AppContext';
import GoalCard from '../components/GoalCard';

const blankGoal = { title: '', targetAmount: '', deadline: '' };

export default function Goals() {
  const { currentUser } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankGoal);

  const goals = useLiveQuery(
    () => db.goals.where('userId').equals(currentUser.id).toArray(),
    [currentUser.id]
  );

  function openNew() {
    setEditing(null);
    setForm(blankGoal);
    setFormOpen(true);
  }

  function openEdit(goal) {
    setEditing(goal);
    setForm({ title: goal.title, targetAmount: goal.targetAmount, deadline: goal.deadline || '' });
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const target = Number(form.targetAmount);
    if (!form.title.trim() || !target || target <= 0) return;

    if (editing) {
      await db.goals.update(editing.id, {
        title: form.title.trim(),
        targetAmount: target,
        deadline: form.deadline,
      });
    } else {
      await db.goals.add({
        userId: currentUser.id,
        title: form.title.trim(),
        targetAmount: target,
        savedAmount: 0,
        deadline: form.deadline,
      });
    }
    setFormOpen(false);
  }

  async function handleContribute(goal, amount) {
    await db.goals.update(goal.id, { savedAmount: goal.savedAmount + amount });
  }

  async function handleDelete(id) {
    await db.goals.delete(id);
  }

  return (
    <div className="screen">
      <div className="screen-header-row">
        <h2>Goals</h2>
        <button className="primary-btn small" onClick={openNew}>
          <Plus size={16} /> New goal
        </button>
      </div>

      {goals && goals.length === 0 && (
        <div className="empty-state">
          <p>No goals yet.</p>
          <span>Create one — like an emergency fund or a trip — and track how close you are.</span>
        </div>
      )}

      <div className="goal-grid">
        {goals?.map((g) => (
          <GoalCard
            key={g.id}
            goal={g}
            onContribute={handleContribute}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {formOpen && (
        <div className="sheet-overlay" onClick={() => setFormOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <h2>{editing ? 'Edit goal' : 'New goal'}</h2>
              <button className="icon-btn" onClick={() => setFormOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="tx-form">
              <label className="field">
                <span>Goal name</span>
                <input
                  type="text"
                  placeholder="e.g. Emergency fund"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  autoFocus
                />
              </label>
              <label className="field">
                <span>Target amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.targetAmount}
                  onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
                  required
                />
              </label>
              <label className="field">
                <span>Target date (optional)</span>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                />
              </label>
              <button type="submit" className="primary-btn">
                {editing ? 'Save changes' : 'Create goal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
