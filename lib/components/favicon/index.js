const html = require('choo/html');
const { color } = require('../../components/goal');

const DEFAULT_FAVICON = '/favicon.ico'

const setFavicon = exports.setFavicon = (goal) => {
  if (typeof window === 'undefined') {
    return;
  }

  resetFavicon();

  const canvas = document.createElement('canvas');
  const size = 32;
  const radian = size / 2;
  const link = document.querySelector('[rel="icon"]');
  link.type = 'image/png';
  link.rel = 'icon';

  if (canvas.getContext) {
    canvas.height = canvas.width = size;
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = color(goal);
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "white";
    ctx.font = 'normal 30px "Giorgio Sans Bold", "helvetica", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(goal, 16, 18);

    link.href = canvas.toDataURL('image/png');
  }
}

const resetFavicon = exports.resetFavicon = (goal, color) => {
  if (typeof window === 'undefined') {
    return;
  }

  const favicon = document.querySelector('[rel="icon"]');

  if (favicon) {
    if (favicon.href === DEFAULT_FAVICON) {
      favicon.parentNode.removeChild(favicon);
    } else {
      favicon.href = DEFAULT_FAVICON;
      favicon.type = 'image/icon';
    }
  } else {
    let link = document.createElement('link');
    link.type = 'image/icon';
    link.rel = 'icon';
    link.href = DEFAULT_FAVICON;
    document.head.appendChild(link);
  }
}
