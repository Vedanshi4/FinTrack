import Dexie from 'dexie';

// Local-first database. Everything lives in the browser's IndexedDB,
// scoped per-device, no network calls. This is what the "2/4 users"
// login switches between — each user's data is isolated by userId.
export const db = new Dexie('FinioDB');

db.version(1).stores({
  // id is auto-incremented primary key for all tables
  users: '++id, name',
  transactions: '++id, userId, type, category, date',
  goals: '++id, userId, title',
  budgets: '++id, userId, category, [userId+category]',
});

const DEFAULT_USERS = [
  { name: 'V', pin: '4500', color: '#3d5c4e' },
  { name: 'M', pin: '200321', color: '#4a5a6b' },
];

// Seed a small set of local users on first run so the login screen
// isn't empty. Safe to edit DEFAULT_USERS above before first launch,
// or add more users later from within the app if you wire that up.
export async function ensureSeedData() {
  const count = await db.users.count();
  if (count === 0) {
    await db.users.bulkAdd(DEFAULT_USERS);
  }
}

export async function verifyPin(userId, pin) {
  const user = await db.users.get(userId);
  return !!user && String(user.pin) === String(pin);
}
