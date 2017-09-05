if (typeof window === 'undefined') {
  return;
}

const base = document.documentElement;
const threshold = 100;
const attrName = 'data-focus-source';
const blackList = [
  'input:not([type])',
  'textarea',
  '[type="text"]',
  '[type="number"]',
  '[type="date"]',
  '[type="time"]',
  '[type="datetime"]',
  '[role=textbox]',
  'select'
].join(',');

let hadKeyboardEvent = false;
let beingThrottled;

base.setAttribute('data-focus-ready', '');

document.body.addEventListener('keydown', () => {
  hadKeyboardEvent = true;

  if (beingThrottled) {
    clearTimeout(beingThrottled);
  }

  beingThrottled = setTimeout(() => {
    hadKeyboardEvent = false;
  }, threshold);
}, true);

document.body.addEventListener('focus', (e) => {
  if (hadKeyboardEvent && !e.target.matches(blackList)) {
    base.setAttribute(attrName, 'key');
  }
}, true);

document.body.addEventListener('blur', () => {
  base.removeAttribute(attrName);
}, true);
