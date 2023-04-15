const pkg = require("./package.json");

module.exports = function (eleventyConfig, configGlobalOptions = {}) {
  try {
    eleventyConfig.versionCheck(pkg["11ty"].compatibility);
  } catch (e) {
    console.log(`WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}`);
  }
};
