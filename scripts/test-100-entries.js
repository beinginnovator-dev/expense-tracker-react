const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');

function extractFunction(name) {
  const start = html.indexOf('function ' + name + '(');
  assert(start >= 0, 'Missing app function: ' + name);
  const open = html.indexOf('{', start);
  assert(open >= 0, 'Missing body for ' + name);

  let depth = 0, quote = null, escaped = false, lineComment = false, blockComment = false;
  for (let i = open; i < html.length; i++) {
    const c = html[i], n = html[i + 1];
    if (lineComment) { if (c === '\n') lineComment = false; continue; }
    if (blockComment) { if (c === '*' && n === '/') { blockComment = false; i++; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (c === '\\') { escaped = true; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '/' && n === '/') { lineComment = true; i++; continue; }
    if (c === '/' && n === '*') { blockComment = true; i++; continue; }
    if (c === "'" || c === '"' || c === '\`') { quote = c; continue; }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) return html.slice(start, i + 1);
  }
  throw new Error('Unclosed function body: ' + name);
}

const store = new Map();
const elements = Object.create(null);
const context = {
  localStorage: {
    getItem: key => store.has(key) ? store.get(key) : null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: key => store.delete(key)
  },
  safeEl: id => elements[id] || (elements[id] = { value: '', innerHTML: '', textContent: '' }),
  expenses: [],
  cats: ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Other'],
  catColors: {}, catDescs: {}, budget: 0, targets: {}, rems: [],
  savingsCards: [], savingsEntries: [], name: 'Test User', brandText: 'Test',
  theme: 'matt', targetSavingsValue: 0, lastReadUpdate: '',
  showDashboard: true, showAmounts: false, privateCards: {}, hiddenDetails: {},
  hideAllData: false, dashCardSkin: 'silver', currentMonth: '', currentDate: '',
  render: () => {}, renderLog: () => {}, updateBadges: () => {},
  alert: message => { throw new Error('Unexpected app alert: ' + message); },
  Date, Number, JSON, Object, Array, String, Math, console
};
vm.createContext(context);

for (const name of ['saveAll', 'addExp', 'maskedMoney', 'getOverallReportHTML',
                    'getMonthWiseReportHTML', 'getDateWiseReportHTML', 'getCardWiseReportHTML']) {
  vm.runInContext(extractFunction(name), context, { timeout: 1000 });
}

// Insert 100 realistic but synthetic transactions through the app's own addExp() function.
const categories = context.cats;
let expectedTotal = 0;
const start = new Date(Date.UTC(2026, 0, 1));
for (let i = 0; i < 100; i++) {
  const d = new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10);
  const cat = categories[i % categories.length];
  const amount = i + 1;
  expectedTotal += amount;
  context.safeEl('t-' + cat).value = 'Test transaction ' + (i + 1);
  context.safeEl('a-' + cat).value = String(amount);
  context.safeEl('d-' + cat).value = d;
  context.safeEl('desc-' + cat).value = 'Synthetic QA record ' + (i + 1);
  context.addExp(cat);
}

assert.strictEqual(context.expenses.length, 100, '100 entries should be present in memory');
assert.strictEqual(context.expenses.reduce((sum, e) => sum + e.amount, 0), 5050, 'sum should be 5050');
assert.strictEqual(JSON.parse(store.get('exp')).length, 100, '100 entries should be saved to localStorage');
assert.strictEqual(JSON.parse(store.get('exp')).reduce((sum, e) => sum + e.amount, 0), 5050, 'saved sum should be 5050');

// Simulate a fresh app start by restoring the saved JSON.
context.expenses = JSON.parse(store.get('exp'));
assert.strictEqual(context.expenses.length, 100, 'all 100 entries should survive reload');
assert.strictEqual(context.expenses[0].title, 'Test transaction 100', 'newest entry should remain first');
assert.strictEqual(context.expenses[99].title, 'Test transaction 1', 'oldest entry should remain last');

// Exercise the actual report functions against the restored 100-entry dataset.
const overall = context.getOverallReportHTML();
assert(overall.includes('₹5050'), 'overall report should show ₹5050');
assert(overall.includes('100'), 'overall report should show 100 transactions');

context.safeEl('reportMonthFilter').value = 'all';
const monthly = context.getMonthWiseReportHTML();
assert(monthly.includes('2026-01') && monthly.includes('2026-04'), 'month report should include all four months');

const daily = context.getDateWiseReportHTML();
assert(daily.includes('2026-01-01') && daily.includes('2026-04-10'), 'date report should include first and last dates');

context.safeEl('reportCardFilter').value = 'all';
const byCard = context.getCardWiseReportHTML();
for (const cat of categories) assert(byCard.includes(cat), 'card report missing category ' + cat);

// Check that sensitive amount masking still applies in report generation.
context.hideAllData = true;
assert(context.getOverallReportHTML().includes('***'), 'masked overall report should hide amounts');

console.log('PASS: 100 synthetic transactions added through app addExp()');
console.log('PASS: localStorage save and reload preserved all 100 entries');
console.log('PASS: transaction order preserved (newest first)');
console.log('PASS: overall report total ₹5050 and 100 transactions');
console.log('PASS: monthly report spans 2026-01 through 2026-04');
console.log('PASS: date report includes first and last transaction dates');
console.log('PASS: category report includes all 6 categories');
console.log('PASS: amount masking remains active');
console.log('RESULT: 8 checks passed; 0 failed');
