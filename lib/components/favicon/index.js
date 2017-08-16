const html = require('choo/html');

const setFavicon = exports.setFavicon = (goal, color) => {
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

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "white";
    ctx.font = 'normal 26px "Giorgio Sans Bold", "helvetica", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(goal, 16, 17);

    link.href = canvas.toDataURL('image/png');
  }
}

const resetFavicon = exports.resetFavicon = (goal, color) => {
  if (typeof window === 'undefined') {
    return;
  }

  const current = document.querySelector('[rel="icon"]');

  if (current) {
    current.parentNode.removeChild(current);
  }

  const link = document.createElement('link');
  link.type = 'image/icon';
  link.rel = 'icon';
  link.href = '/favicon.ico';
  document.head.appendChild(link);
}
