const path = require('path');

module.exports = {
  i18n: {
    locales: ['en-US', 'zh-TW', 'zh-CN'],
    defaultLocale: 'en-US',
    localePath: path.resolve('./public/locales')
  },
};
