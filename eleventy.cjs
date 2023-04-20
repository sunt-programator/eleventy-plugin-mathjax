const pkg = require("./package.json");
const lodashMerge = require("lodash.merge");
const { mathjax } = require("mathjax-full/js/mathjax.js");
const { AsciiMath } = require("mathjax-full/js/input/asciimath");
const { MathML } = require("mathjax-full/js/input/mathml");
const { TeX } = require("mathjax-full/js/input/tex.js");
const { SVG } = require("mathjax-full/js/output/svg.js");
const { CHTML } = require("mathjax-full/js/output/chtml.js");
const { AllPackages } = require("mathjax-full/js/input/tex/AllPackages.js");
const { liteAdaptor, LiteAdaptor } = require("mathjax-full/js/adaptors/liteAdaptor.js");
const { RegisterHTMLHandler: registerHTMLHandler } = require("mathjax-full/js/handlers/html.js");
const { AbstractMathDocument } = require("mathjax-full/js/core/MathDocument.js");
const {
  AssistiveMmlHandler: assistiveMmlHandler,
} = require("mathjax-full/js/a11y/assistive-mml.js");

/**
 * Global options
 * @type {Options} Options
 */
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

/**
 * Initialize the plugin
 * @param {Object} eleventyConfig The eleventy config
 * @param {Options} configGlobalOptions The MathJax options
 */
function init(eleventyConfig, configGlobalOptions = {}) {
  try {
    eleventyConfig.versionCheck(pkg["11ty"].compatibility);
  } catch (e) {
    console.log(`WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}`);
  }

  const options = lodashMerge({}, globalOptions, configGlobalOptions);

  // Create DOM adaptor and register it for HTML documents
  const adaptor = liteAdaptor(options.liteAdaptor);
  const handler = registerHTMLHandler(adaptor);

  if (options.useAssistiveMml) {
    assistiveMmlHandler(handler);
  }

  eleventyConfig.addTransform("mathjax", (content, outputPath) =>
    mathJaxTransform(content, outputPath, adaptor, options)
  );
}

/**
 * The mathjax transformer for eleventy
 * @param {string} content The Eleventy content
 * @param {string} outputPath The output path of the generated file
 * @param {LiteAdaptor} adaptor The Lite Adaptor
 * @param {Options} options The MathJax options
 * @return {string} The transformed MathJax document to HTML
 */
function mathJaxTransform(content, outputPath, adaptor, options) {
  const isHtmlFile = outputPath && outputPath.endsWith(".html");

  if (!isHtmlFile) {
    return content;
  }

  // Create input and output jax
  const InputJax = createInput(options);
  const OutputJax = createOutput(options);

  // Create and typeset the document
  const mathDocument = mathjax.document(content, { InputJax, OutputJax });
  mathDocument.render();

  // If no math was found on the page, remove the stylesheet
  cleanOutput(mathDocument, adaptor, options);

  // Output the resulting HTML
  const docType = adaptor.doctype(mathDocument.document);
  const outerHTML = adaptor.outerHTML(adaptor.root(mathDocument.document));

  return `${docType}\n${outerHTML}\n`;
}

/**
 * Creates a MathJax Input instance based on a selected input format
 * @param {Options} options The MathJax options
 * @return {AsciiMath | MathML | TeX} A MathJax input object based on selected type
 * @throws {TypeError} When the input format is invalid
 */
function createInput(options) {
  switch (options.inputFormat) {
    case "asciimath":
      return new AsciiMath(options.asciimath);
    case "mml":
      return new MathML(options.mml);
    case "tex":
      return new TeX(options.tex);
    default:
      throw new TypeError('Invalid input format. Supported formats: "asciimath", "mml" or "tex".');
  }
}

/**
 * Creates a MathJax Output instance based on a selected output format
 * @param {Options} options The MathJax options
 * @return {CHTML | SVG} A MathJax output object based on selected type
 * @throws {TypeError} When the output format is invalid
 */
function createOutput(options) {
  switch (options.outputFormat) {
    case "chtml":
      return new CHTML(options.chtml);
    case "svg":
      return new SVG(options.svg);
    default:
      throw new TypeError('Invalid output format. Supported formats: "chtml" or "svg".');
  }
}

/**
 * @description If no math was found on the page, remove the stylesheet
 * @param {AbstractMathDocument} mathDocument The MathJax document
 * @param {LiteAdaptor} adaptor The Lite Adaptor
 * @param {Options} options The MathJax options
 */
function cleanOutput(mathDocument, adaptor, options) {
  if (Array.from(mathDocument.math).length > 0) {
    return;
  }

  if (options.outputFormat === "chtml") {
    adaptor.remove(mathDocument.outputJax.chtmlStyles);
    return;
  }

  if (options.outputFormat === "svg") {
    adaptor.remove(mathDocument.outputJax.svgStyles);
    const cache = adaptor.elementById(adaptor.body(mathDocument.document), "MJX-SVG-global-cache");

    if (cache) {
      adaptor.remove(cache);
    }
  }
}

module.exports = init;

/**
 * Options definition
 * @typedef {Object} Options
 * @property {("asciimath" | "mml" | "tex")} inputFormat The input format
 * @property {("chtml" | "svg")} outputFormat The output format
 * @property {Object.<string, any>} asciimath The AsciiMath input options
 * @property {Object.<string, any>} mml The MathML input options
 * @property {Object.<string, any>} tex The TeX input options
 * @property {Object.<string, any>} svg The SVG output options
 * @property {Object.<string, any>} chtml The CommonHTML output options
 * @property {Object.<string, any>} liteAdaptor The LiteAdaptor options
 * @property {Boolean} useAssistiveMml Whether to use assistive MathML
 */
