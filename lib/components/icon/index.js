const html = require('choo/html')
const { className } = require('../base/utils')

const ICONS = [
  require('./icons/1'),
  require('./icons/2'),
  require('./icons/3'),
  require('./icons/4'),
  require('./icons/5'),
  require('./icons/6'),
  require('./icons/7'),
  require('./icons/8'),
  require('./icons/9'),
  require('./icons/10'),
  require('./icons/11'),
  require('./icons/12'),
  require('./icons/13'),
  require('./icons/14'),
  require('./icons/15'),
  require('./icons/16'),
  require('./icons/17')
]

const LANG_MULTIPLIERS = {
  'ja-jp': 0.75
}

exports.icon = icon
exports.label = label
exports.glyph = glyph

function label (doc, parent) {
  return html`
    <div class="Icon Icon--${doc.data.number}">
      ${draw(doc.data.number, parseText(doc), doc.lang, parent)}
    </div>
  `
}

function glyph (goal) {
  return html`
    <div class="Icon Icon--${goal}">
      <div class="Icon-glyph">${ICONS[goal - 1]()}</div>
    </div>
  `
}

function icon (doc, parent) {
  return html`
    <div class="Icon Icon--${doc.data.number}">
      ${draw(doc.data.number, parseText(doc), doc.lang, parent)}
      <div class="Icon-glyph">${ICONS[doc.data.number - 1]()}</div>
    </div>
  `
}

function draw (number, lines, lang, parent) {
  if (!lines || !lines.length) return null

  let multiplier = LANG_MULTIPLIERS[lang] || 1
  const doubleDigit = (number > 9)
  const height = lines.length === 1 ? 48 : (lines.length * 24)
  const longLine = lines.find(line => line.length > (multiplier * 14))
  const longerLine = lines.find(line => line.length > (multiplier * 17))

  // Deduct 5% on long lines for extra measure
  if (longerLine) multiplier -= 0.05

  let textPos = 57
  textPos -= longLine ? 4 : 0
  textPos -= longerLine ? 6 : 0
  textPos += doubleDigit ? 5 : 0

  let digitPos = 30
  digitPos -= longerLine ? 4 : 0

  return html`
    <svg role="presentational" aria-hidden="true" class="${className('Icon-label', {[`${parent}-iconLabel`]: parent})}" height="${height * 0.92}" viewBox="0 0 200 ${height}">
      <g transform="scale(0.94)">
        <text class="${className('Icon-number', {[`${parent}-iconNumber`]: parent})}" font-size="59.4" fill="currentColor" text-anchor="middle" alignment-baseline="hanging">
          <tspan x="${digitPos}" y="41" letter-spacing="-0.1" text-anchor="middle">${number}</tspan>
        </text>
        <text class="${className('Icon-text', {[`${parent}-iconText`]: parent})}" font-size="${multiplier * 24}" y="-7" fill="currentColor" text-anchor="start" alignment-baseline="hanging">
          ${lines.map(line => {
            const styles = lineStyles(line, lang)
            return html`
              <tspan x="${textPos}" dy="24" word-spacing="${styles.wordSpacing}" letter-spacing="${styles.letterSpacing}" text-anchor="start">${line}</tspan>
            `
          })}
        </text>
      </g>
    </svg>
  `
}

function lineStyles (line, lang) {
  const multiplier = LANG_MULTIPLIERS[lang] || 1
  const longLine = line.length > (multiplier * 14)
  const longerLine = line.length > (multiplier * 19)

  let wordSpacing = '1.5'
  let letterSpacing = '0.5'

  wordSpacing = longLine ? '1.2' : wordSpacing
  wordSpacing = longerLine ? '0.5' : wordSpacing
  letterSpacing = longLine ? '0.3' : letterSpacing
  letterSpacing = longerLine ? '-0.05' : letterSpacing

  return {wordSpacing, letterSpacing}
}

function parseText (doc) {
  return doc.data.icon_text.map(block => block.text)
}
