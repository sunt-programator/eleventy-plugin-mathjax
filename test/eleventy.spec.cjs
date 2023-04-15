const test = require("ava");
const Eleventy = require("@11ty/eleventy");
const { JSDOM } = require("jsdom");
const mathJaxPlugin = require("../");

const macro = test.macro(async (t, input, expected) => {
  const eleventy = new Eleventy("./test/eleventy/", "./test/eleventy/_site/", {
    config: function (eleventyConfig) {
      eleventyConfig.addPlugin(mathJaxPlugin, { outputFormat: input });
    },
  });

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const mathJaxContainer = dom.window.document.querySelector(".MathJax");

  t.is(json.length, 1);
  t.is(mathJaxContainer.getAttribute("jax"), expected);
});

test("Test if MatJax output type is CHTML", macro, "chtml", "CHTML");
test("Test if MatJax output type is SVG", macro, "svg", "SVG");
