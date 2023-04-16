const mathJaxPlugin = require("../");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/mathjax-full/ts/output/chtml/fonts/tex-woff-v2/": "/fonts/tex-woff-v2/",
  });

  eleventyConfig.addPlugin(mathJaxPlugin, { chtml: { fontURL: "/fonts/tex-woff-v2" } });
  eleventyConfig.setTemplateFormats("njk,liquid,md,css");
};
