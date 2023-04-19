<h1 align="center">MathJax plugin for Eleventy (11ty)</h1>

<div align="center">
  <strong>Eleventy plugin for supporting the MathJax library.</strong>
</div>

<div align="center">
  <hr />
  <p>Repository Stats:</p>
  <img src="https://img.shields.io/github/package-json/v/sunt-programator/eleventy-plugin-mathjax" alt="GitHub package.json version">
  <a href="https://github.com/sunt-programator/eleventy-plugin-mathjax/stargazers"><img src="https://img.shields.io/github/stars/sunt-programator/eleventy-plugin-mathjax" alt="Stars Badge"/></a>
  <a href="https://github.com/sunt-programator/eleventy-plugin-mathjax/network/members"><img src="https://img.shields.io/github/forks/sunt-programator/eleventy-plugin-mathjax" alt="Forks Badge"/></a>
  <a href="https://github.com/sunt-programator/eleventy-plugin-mathjax/pulls"><img src="https://img.shields.io/github/issues-pr/sunt-programator/eleventy-plugin-mathjax" alt="Pull Requests Badge"/></a>
  <a href="https://github.com/sunt-programator/eleventy-plugin-mathjax/issues"><img src="https://img.shields.io/github/issues/sunt-programator/eleventy-plugin-mathjax" alt="Issues Badge"/></a>
  <a href="https://github.com/sunt-programator/eleventy-plugin-mathjax/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/sunt-programator/eleventy-plugin-mathjax?color=2b9348"></a>
  <a href="https://github.com/sunt-programator/eleventy-plugin-mathjax/blob/master/LICENSE"><img src="https://img.shields.io/github/license/sunt-programator/eleventy-plugin-mathjax?color=2b9348" alt="License Badge"/></a>
  <hr />
  <p>Code Quality Stats:</p>
  <a href="https://github.com/sunt-programator/eleventy-plugin-mathjax/actions/workflows/node.js.yml"><img src="https://github.com/sunt-programator/eleventy-plugin-mathjax/actions/workflows/node.js.yml/badge.svg" alt="Github Actions Build Status"></a>
  <a href="https://sonarcloud.io/summary/new_code?id=sunt-programator_eleventy-plugin-mathjax"><img src="https://sonarcloud.io/api/project_badges/measure?project=sunt-programator_eleventy-plugin-mathjax&amp;metric=alert_status" alt="Quality Gate Status"></a>
  <a href="https://sonarcloud.io/summary/new_code?id=sunt-programator_eleventy-plugin-mathjax"><img src="https://sonarcloud.io/api/project_badges/measure?project=sunt-programator_eleventy-plugin-mathjax&amp;metric=coverage" alt="Coverage"></a>
  <a href="https://www.codefactor.io/repository/github/sunt-programator/eleventy-plugin-mathjax"><img src="https://www.codefactor.io/repository/github/sunt-programator/eleventy-plugin-mathjax/badge" alt="CodeFactor"></a>
  <a href="https://snyk.io/test/github/sunt-programator/eleventy-plugin-mathjax"><img src="https://snyk.io/test/github/sunt-programator/eleventy-plugin-mathjax/badge.svg" alt="Known Vulnerabilities"></a>
  <a href="https://api.securityscorecards.dev/projects/github.com/sunt-programator/eleventy-plugin-mathjax"><img src="https://api.securityscorecards.dev/projects/github.com/sunt-programator/eleventy-plugin-mathjax/badge" alt="Scorecard score"/></a>
  <a href="https://bestpractices.coreinfrastructure.org/projects/7247"><img src="https://bestpractices.coreinfrastructure.org/projects/7247/badge" alt="OpenSSF Best Practices"></a>
  <hr />
</div>

## <a name="quick-start"></a>⚡️ Quick start

Install the plugin by using the following command:

```shell
npm install --save-dev @sunt-programator/eleventy-plugin-mathjax
```

Or use this command in case you are using the [Yarn](https://yarnpkg.com/) package manager:

```shell
yarn add --dev @sunt-programator/eleventy-plugin-mathjax
```

Next, add this plugin into your Eleventy configuration file (e.g. `eleventy.config.js`):

```js
const mathjaxPlugin = require("@sunt-programator/eleventy-plugin-mathjax");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(mathjaxPlugin);
};
```

## <a name="usage"></a>🕘 Usage

For a block math, use the `$$...$$` notation:

```latex
$$
x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}
$$
```

This will render to:

> $$
> x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}
> $$

<hr />

For an inline math, use the `\\(...\\)` notation:

```latex
This is an inline math: \\(x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}\\).
```

This will render to:

> This is an inline math: $x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$.

## <a name="options"></a>🗿 Options

This plugins supports overriding the global options by passing to the `addPlugin` function an object as a second argument:

```js
// Copy the fonts from node_modules to the output site directory
eleventyConfig.addPassthroughCopy({
  "node_modules/mathjax-full/ts/output/chtml/fonts/tex-woff-v2/": "/fonts/tex-woff-v2/",
});

// Use the fonts to render the glyphs in CommonHTML mode
eleventyConfig.addPlugin(mathjaxPlugin, {
  chtml: {
    fontURL: "/fonts/tex-woff-v2",
  },
});
```

The global options used by this plugin look like this:

```js
const globalOptions = {
  inputFormat: "tex",
  outputFormat: "chtml",
  asciimath: { delimiters: [["\\(", "\\)"]] },
  mml: {},
  tex: {
    packages: AllPackages,
  },
  svg: {},
  chtml: {},
  liteAdaptor: {},
  useAssistiveMml: true,
};
```

<!-- prettier-ignore-start -->
| Option | Description
| --- | --- |
| inputFormat | The math format of the input. Accepts [tex](https://docs.mathjax.org/en/latest/input/tex/index.html), [asciimath](https://docs.mathjax.org/en/latest/input/asciimath.html) or [mml](https://docs.mathjax.org/en/latest/input/mathml.html). Default: `tex`. |
| outputFormat | The math format of the produced output. Acceps [chtml](https://docs.mathjax.org/en/latest/output/html.html) or [svg](https://docs.mathjax.org/en/latest/output/svg.html). Default: `chtml`. |
| asciimath | The [AsciiMath](https://docs.mathjax.org/en/latest/options/input/asciimath.html) configuration options. Valid if the `inputFormat` is set to `asciimath`. |
| tex | The [TeX](https://docs.mathjax.org/en/latest/options/input/tex.html) configuration options. Valid if the `inputFormat` is set to `tex`. |
| mml | The [MathML](https://docs.mathjax.org/en/latest/options/input/mathml.html) configuration options. Valid if the `inputFormat` is set to `mml`. |
| svg | The [SVG](https://docs.mathjax.org/en/latest/options/output/svg.html) configuration options. Valid if the `outputFormat` is set to `svg`. |
| chtml | The [CommonHTML](https://docs.mathjax.org/en/latest/options/output/chtml.html) configuration options. Valid if the `outputFormat` is set to `chtml`. |
| liteAdaptor | The Lite Adaptor configuration options. |
| useAssistiveMml | The flag indicating whether to use the assistive MathML. |
<!-- prettier-ignore-end -->

## <a name="inspiration"></a>💡 Inspiration

This plugin used two repos as an inspiration:

1. [MathJax Node Demos](https://github.com/mathjax/MathJax-demos-node) - Integration with MathJax
2. [eleventy-plugin-mathjax](https://github.com/tsung-ju/eleventy-plugin-mathjax) by [Tsung-Ju Chiang](https://github.com/tsung-ju) - Plugin implementation
3. [Angular](https://github.com/angular/angular) - Community Standards files

## <a name="license"></a>📰 License

This plugin is [MIT](LICENSE) licensed.
