const y18n = require('y18n');
const { inBrowser } = require('../components/base/utils');

/**
 * Include locales in browser build
 */

const languages = {
  en: require('./en')
};

const options = { directory: __dirname };

/**
 * Adaption for browser bundle
 */

if (inBrowser) {
  options.updateFiles = false;
  options.locale = process.env.GLOBALGOALS_LANG || 'en';
}

const my18n = module.exports = y18n(options);

/**
 * Extend y18n with custom (static) `_readLocaleFile`
 */

if (inBrowser) {
  my18n._readLocaleFile = () => {
    my18n.cache[my18n.locale] = languages[my18n.locale];
  };
}
