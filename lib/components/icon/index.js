const { __ } = require('../../locale');
const html = require('choo/html');
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
];

const label = (goal, componentName) => {
  return html`
    <div class="Icon Icon--${ goal }">
      ${ createLabel(goal, componentName) }
    </div>
  `;
};

const glyph = (goal, componentName) => {
  return html`
    <div class="Icon Icon--${ goal }">
      <div class="Icon-glyph ${ componentName }-iconGlyph">${ ICONS[goal - 1] }</div>
    </div>
  `;
};

const icon = ({ goal = 1, componentName = 'Icon' } = {}) => {
  return html`
    <div class="Icon Icon--${ goal }">
      ${ createLabel(goal, componentName) }
      <div class="Icon-glyph ${ componentName }-iconGlyph">${ ICONS[goal - 1] }</div>
    </div>
  `;
};

module.exports = icon;

icon.label = label;
icon.glyph = glyph;

function createLabel(number, componentName = 'Icon') {
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
    letterSpacing = longerLine ? '-0.05' : letterSpacing;

    return {
      wordSpacing: wordSpacing,
      letterSpacing: letterSpacing
    };
  };

  return html`
    <svg role="presentational" aria-hidden="true" class="Icon-label ${ componentName }-iconLabel" viewBox="0 0 200 ${ viewBoxHeight }">
      <g transform="scale(0.94)">
        <text class="Icon-number ${ componentName }-iconNumber" font-size="59.4" fill="currentColor" text-anchor="middle" alignment-baseline="hanging">
          <tspan x="${ digitPos }" y="41" letter-spacing="-0.1" text-anchor="middle">${ number }</tspan>
        </text>
        <text class="Icon-text  ${ componentName }-iconText" font-size="24" y="-7" fill="currentColor" text-anchor="start" alignment-baseline="hanging">
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
