import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Delete } from 'lucide-react';
import { db, verifyPin } from '../db/db';
import { useApp } from '../context/AppContext';

const PIN_LENGTH = 4;

export default function Login() {
  const users = useLiveQuery(() => db.users.toArray(), []);
  const { login } = useApp();
  const [selected, setSelected] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function pickUser(user) {
    setSelected(user);
    setPin('');
    setError(false);
  }

  async function pressDigit(d) {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setPin(next);
    setError(false);
    if (next.length === PIN_LENGTH) {
      const ok = await verifyPin(selected.id, next);
      if (ok) {
        login(selected);
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setPin('');
          setShake(false);
        }, 420);
      }
    }
  }

  function backspace() {
    setPin((p) => p.slice(0, -1));
    setError(false);
  }

  if (!users) return null;

  return (
    <div className="login-screen">
      <div className="login-wordmark">
        <span className="login-wordmark-serif">Finio</span>
        <span className="login-wordmark-rule" />
        <span className="login-wordmark-sub">a personal ledger</span>
      </div>

      {!selected ? (
        <div className="login-users">
          {users.map((u) => (
            <button key={u.id} className="login-user-chip" onClick={() => pickUser(u)}>
              <span className="login-avatar" style={{ background: u.color || '#4a5a6b' }}>
                {u.name.charAt(0).toUpperCase()}
              </span>
              <span>{u.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="login-pin-panel">
          <button className="login-back" onClick={() => setSelected(null)}>
            ← switch user
          </button>
          <div className="login-avatar login-avatar-lg" style={{ background: selected.color || '#4a5a6b' }}>
            {selected.name.charAt(0).toUpperCase()}
          </div>
          <p className="login-prompt">Enter PIN for {selected.name}</p>

          <div className={`pin-dots ${shake ? 'shake' : ''}`}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <span
                key={i}
                className={`pin-dot ${i < pin.length ? 'filled' : ''} ${error ? 'error' : ''}`}
              />
            ))}
          </div>
          {error && <p className="pin-error">Incorrect PIN, try again</p>}

          <div className="keypad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button key={d} className="keypad-key" onClick={() => pressDigit(d)}>
                {d}
              </button>
            ))}
            <span />
            <button className="keypad-key" onClick={() => pressDigit('0')}>
              0
            </button>
            <button className="keypad-key keypad-del" onClick={backspace} aria-label="Delete">
              <Delete size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
