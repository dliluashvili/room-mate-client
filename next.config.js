const nextTranslate = require("next-translate");

module.exports = {
  images: {
    domains: ["img.roommategeorgia.ge", "img.test.roommategeorgia.ge"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  ...nextTranslate(),
};
