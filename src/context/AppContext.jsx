import { createContext, useContext, useEffect, useState } from 'react';
import { db, ensureSeedData } from '../db/db';

const AppContext = createContext(null);

const SESSION_KEY = 'finio_session_user_id';

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await ensureSeedData();
      const savedId = localStorage.getItem(SESSION_KEY);
      if (savedId) {
        const user = await db.users.get(Number(savedId));
        if (user) setCurrentUser(user);
      }
      setReady(true);
    })();
  }, []);

  function login(user) {
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, String(user.id));
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return (
    <AppContext.Provider value={{ currentUser, login, logout, ready }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
