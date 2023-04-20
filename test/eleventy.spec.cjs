/* eslint-disable require-jsdoc */
/* eslint-disable sonarjs/no-duplicate-string */
const test = require("ava");
const Eleventy = require("@11ty/eleventy");
const { JSDOM } = require("jsdom");
const mathJaxPlugin = require("../");

test("Test if MatJax output type is CHTML", async (t) => {
  const eleventy = new Eleventy("./test/output-format/", "./test/output-format/_site/", {
    config: function (eleventyConfig) {
      eleventyConfig.addPlugin(mathJaxPlugin, { outputFormat: "chtml" });
    },
  });

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const mathJaxContainer = dom.window.document.querySelector(".MathJax");
  const chtmlStyles = dom.window.document.querySelector("#MJX-CHTML-styles");

  t.is(mathJaxContainer.getAttribute("jax"), "CHTML");
  t.truthy(chtmlStyles);
});

test("Test if MatJax output type is SVG", async (t) => {
  const eleventy = new Eleventy("./test/output-format/", "./test/output-format/_site/", {
    config: function (eleventyConfig) {
      eleventyConfig.addPlugin(mathJaxPlugin, { outputFormat: "svg" });
    },
  });

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const mathJaxContainer = dom.window.document.querySelector(".MathJax");
  const svgStyles = dom.window.document.querySelector("#MJX-SVG-styles");

  t.is(mathJaxContainer.getAttribute("jax"), "SVG");
  t.truthy(svgStyles);
});

test("Test if TeX input format returns a valid MathJax object", async (t) => {
  const eleventy = new Eleventy("./test/input-format-tex/", "./test/input-format-tex/_site/", {
    config: function (eleventyConfig) {
      eleventyConfig.addPlugin(mathJaxPlugin, { inputFormat: "tex" });
    },
  });

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const mathJaxContainer = dom.window.document.querySelector("mjx-container");

  t.truthy(mathJaxContainer);
});

test("Test if AsciiMath input format returns a valid MathJax object", async (t) => {
  const eleventy = new Eleventy(
    "./test/input-format-asciimath/",
    "./test/input-format-asciimath/_site/",
    {
      config: function (eleventyConfig) {
        eleventyConfig.addPlugin(mathJaxPlugin, { inputFormat: "asciimath" });
      },
    }
  );

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const mathJaxContainer = dom.window.document.querySelector("mjx-container");

  t.truthy(mathJaxContainer);
});

test("Test if MathML input format returns a valid MathJax object", async (t) => {
  const eleventy = new Eleventy(
    "./test/input-format-mathml/",
    "./test/input-format-mathml/_site/",
    {
      config: function (eleventyConfig) {
        eleventyConfig.addPlugin(mathJaxPlugin, { inputFormat: "mml" });
      },
    }
  );

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const mathJaxContainer = dom.window.document.querySelector("mjx-container");

  t.truthy(mathJaxContainer);
});

test("The MathJax plugin with an invalid input format should throw an exception", async (t) => {
  const eleventyFunc = () =>
    mathJaxPlugin(
      {
        versionCheck: () => true,
        addTransform: (_pluginName, transformFn) => transformFn("empty content", "index.html"),
      },
      { inputFormat: "invalid_format" }
    );

  const error = t.throws(eleventyFunc, { instanceOf: TypeError });
  t.is(error.message, 'Invalid input format. Supported formats: "asciimath", "mml" or "tex".');
});

test("The MathJax plugin with an invalid output format should throw an exception", async (t) => {
  const eleventyFunc = () =>
    mathJaxPlugin(
      {
        versionCheck: () => true,
        addTransform: (_pluginName, transformFn) => transformFn("empty content", "index.html"),
      },
      { outputFormat: "invalid_format" }
    );

  const error = t.throws(eleventyFunc, { instanceOf: TypeError });
  t.is(error.message, 'Invalid output format. Supported formats: "chtml" or "svg".');
});

test("Test the global font cache on SVG output", async (t) => {
  const eleventy = new Eleventy("./test/output-format/", "./test/output-format/_site/", {
    config: function (eleventyConfig) {
      eleventyConfig.addPlugin(mathJaxPlugin, {
        outputFormat: "svg",
        svg: { fontCache: "global" },
      });
    },
  });

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const mathJaxContainer = dom.window.document.querySelector("#MJX-SVG-global-cache");
  const svgStyles = dom.window.document.querySelector("#MJX-SVG-styles");

  t.truthy(mathJaxContainer);
  t.truthy(svgStyles);
});

test("Test if CHTML styles are cleared if there is no math on page", async (t) => {
  const eleventy = new Eleventy("./test/no-math/", "./test/no-math/_site/", {
    config: function (eleventyConfig) {
      eleventyConfig.addPlugin(mathJaxPlugin, { outputFormat: "chtml" });
    },
  });

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const chtmlStyles = dom.window.document.querySelector("#MJX-CHTML-styles");

  t.falsy(chtmlStyles);
});

test("Test if SVG styles are cleared if there is no math on page", async (t) => {
  const eleventy = new Eleventy("./test/no-math/", "./test/no-math/_site/", {
    config: function (eleventyConfig) {
      eleventyConfig.addPlugin(mathJaxPlugin, {
        outputFormat: "svg",
        svg: { fontCache: "global" },
      });
    },
  });

  const json = await eleventy.toJSON();
  const dom = new JSDOM(json[0].content.trim());

  const svgStyles = dom.window.document.querySelector("#MJX-SVG-styles");
  t.falsy(svgStyles);
});

test("Test if a site with multiple pages doesn't lose the styles", async (t) => {
  const eleventy = new Eleventy("./test/multiple-pages/", "./test/multiple-pages/_site/", {
    config: function (eleventyConfig) {
      eleventyConfig.addPlugin(mathJaxPlugin, { outputFormat: "chtml" });
    },
  });

  const jsonPages = await eleventy.toJSON();

  const page1 = jsonPages.find((item) => item.url === "/page-a/");
  const page2 = jsonPages.find((item) => item.url === "/page-b/");

  const dom1 = new JSDOM(page1.content.trim());
  const dom2 = new JSDOM(page2.content.trim());

  const mathJaxContainer1 = dom1.window.document.querySelector(".MathJax");
  const chtmlStyles1 = dom1.window.document.querySelector("#MJX-CHTML-styles");

  const mathJaxContainer2 = dom2.window.document.querySelector(".MathJax");
  const chtmlStyles2 = dom2.window.document.querySelector("#MJX-CHTML-styles");

  t.is(mathJaxContainer1.getAttribute("jax"), "CHTML");
  t.truthy(chtmlStyles1);

  t.is(mathJaxContainer2.getAttribute("jax"), "CHTML");
  t.truthy(chtmlStyles2);
});

test("Test if MathJax transform won't change the non-html files", async (t) => {
  const eleventy = new Eleventy(
    "./test/no-parse-on-non-html-files/",
    "./test/no-parse-on-non-html-files/_site/",
    {
      config: function (eleventyConfig) {
        eleventyConfig.addPlugin(mathJaxPlugin);
      },
    }
  );

  const expectedContent =
    '{\n  "version": "https://jsonfeed.org/version/1.1",\n  "title": "eleventy-plugin-mathjax"\n}\n';

  const json = await eleventy.toJSON();
  t.is(json[0].content, expectedContent);
});
