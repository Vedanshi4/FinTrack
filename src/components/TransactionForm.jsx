import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { db } from '../db/db';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../utils/categories';
import { useApp } from '../context/AppContext';

const today = () => new Date().toISOString().slice(0, 10);

const blankForm = {
  type: 'expense',
  amount: '',
  category: EXPENSE_CATEGORIES[0],
  date: today(),
  paymentMethod: PAYMENT_METHODS[0],
  notes: '',
};

export default function TransactionForm({ editing, onClose }) {
  const { currentUser } = useApp();
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    if (editing) {
      setForm({
        type: editing.type,
        amount: String(editing.amount),
        category: editing.category,
        date: editing.date,
        paymentMethod: editing.paymentMethod,
        notes: editing.notes || '',
      });
    } else {
      setForm(blankForm);
    }
  }, [editing]);

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'type') {
        next.category = value === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0];
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const amountNum = Number(form.amount);
    if (!amountNum || amountNum <= 0) return;

    const payload = {
      userId: currentUser.id,
      type: form.type,
      amount: amountNum,
      category: form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
      notes: form.notes.trim(),
    };

    if (editing) {
      await db.transactions.update(editing.id, payload);
    } else {
      await db.transactions.add(payload);
    }
    onClose();
  }

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <h2>{editing ? 'Edit entry' : 'New entry'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="type-toggle">
          <button
            type="button"
            className={form.type === 'expense' ? 'active negative' : ''}
            onClick={() => update('type', 'expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={form.type === 'income' ? 'active positive' : ''}
            onClick={() => update('type', 'income')}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tx-form">
          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => update('amount', e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="field">
            <span>Category</span>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div className="field-row">
            <label className="field">
              <span>Date</span>
              <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
            </label>
            <label className="field">
              <span>Payment method</span>
              <select value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Notes</span>
            <textarea
              rows={2}
              placeholder="Optional note…"
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </label>

          <button type="submit" className="primary-btn">
            {editing ? 'Save changes' : 'Add entry'}
          </button>
        </form>
      </div>
    </div>
  );
}
