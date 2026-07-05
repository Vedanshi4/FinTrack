export const EXPENSE_CATEGORIES = [
  'Food',
  'Grocery',
  'Rent',
  'Travel',
  'Outing',
  'Shopping',
  'Utilities',
  'Health',
  'Entertainment',
  'Subscriptions',
  'Investment',
  'Miscellaneous',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment Returns',
  'Other Income',
];

export const PAYMENT_METHODS = [
  'UPI',
  'Debit Card',
  'Credit Card',
  'Cash',
  'Net Banking',
  'Other',
];

// A stable palette mapped to categories for charts, so a category
// always renders the same color across screens.
const PALETTE = [
  '#3d5c4e', '#a25a41', '#4a5a6b', '#8a6d3b', '#5b6b3f',
  '#6b4c5e', '#3f6b6b', '#7a5a44', '#4f5b6e', '#6e5a3d',
  '#5a6b52', '#7a4f4f',
];

export function categoryColor(category) {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const idx = all.indexOf(category);
  return PALETTE[idx >= 0 ? idx % PALETTE.length : 0];
}
