const nextTranslate = require("next-translate");

module.exports = {
  images: {
    domains: [
      "img.roommategeorgia.ge",
      "img.test.roommategeorgia.ge",
      "flagcdn.com",
      "drive.google.com",
      "drive.usercontent.google.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  ...nextTranslate(),
};
