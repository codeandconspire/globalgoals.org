const { __ } = require('../../../locale');
const html = require('choo/html');

const ICONS = [
  require('./1'),
  require('./2'),
  require('./3'),
  require('./4'),
  require('./5'),
  require('./6'),
  require('./7'),
  require('./8'),
  require('./9'),
  require('./10'),
  require('./11'),
  require('./12'),
  require('./13'),
  require('./14'),
  require('./15'),
  require('./16'),
  require('./17')
];

const label = (num) => createLabel(num);
const glyph = (num) => ICONS[num];

const icons = (opts) => html`
  <div class="Goal Goal--15 ${ Object.keys(opts).map(key => opts[key] ? `Goal--${ key }` : '').join(' ') }">
    <div class="Goal-label">${ label(opts.goal) }</div>
    <div class="Goal-glyph">${ glyph(opts.goal - 1) }</div>
  </div>
`;

module.exports = icons;

icons.label = label;
icons.glyph = glyph;

function createLabel(number) {
  const text = __('GOAL_TITLE_' + number);
  const lines = text.split('|');
  const longLine = lines.find((line) => line.length > 14);
  const longerLine = lines.find((line) => line.length > 17);
  const doubleDigit = (number > 9);
  const viewBoxHeight = lines.length * 24;

  let textPos = 57;
  textPos -= longLine ? 4 : 0;
  textPos -= longerLine ? 6 : 0;
  textPos += doubleDigit ? 5 : 0;

  let digitPos = 30;
  digitPos -= longerLine ? 4 : 0;

  const lineStyles = (line) => {
    let longLine = line.length > 14;
    let longerLine = line.length > 19;

    let wordSpacing = '1.5';
    let letterSpacing = '0.5';

    wordSpacing = longLine ? '1.2' : wordSpacing;
    wordSpacing = longerLine ? '0.5' : wordSpacing;
    letterSpacing = longLine ? '0.3' : letterSpacing;
    letterSpacing = longerLine ? '-0.3' : letterSpacing;

    return {
      wordSpacing: wordSpacing,
      letterSpacing: letterSpacing
    };
  };

  return html`
    <svg class="Goal-label" viewBox="0 0 200 ${ viewBoxHeight }">
      <g style="transform: scale(0.94)">
        <text class="Goal-labelNumber" font-size="59.4" x="${ digitPos }" y="24.2" fill="currentColor" text-anchor="middle" alignment-baseline="middle">${ number }</text>
        <text class="Goal-labelText" font-size="24" y="-7" fill="currentColor" text-anchor="start" alignment-baseline="hanging">
          ${ lines.map(line => {
            const styles = lineStyles(line);
            return html`
              <tspan x="${ textPos }" dy="24" word-spacing="${ styles.wordSpacing }" letter-spacing="${ styles.letterSpacing }" text-anchor="start">${ line }</tspan>
            `;
          }) }
        </text>
      </g>
    </svg>
  `;
}
