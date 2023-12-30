const nextTranslate = require("next-translate");

module.exports = {
  eslint: {
    ignoreDuringBuilds: true
  },
  ...nextTranslate(),
};
