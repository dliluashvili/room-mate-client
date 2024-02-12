const nextTranslate = require("next-translate");

module.exports = {
  images: {
    domains: ["img.roommategeorgia.ge"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  ...nextTranslate(),
};
