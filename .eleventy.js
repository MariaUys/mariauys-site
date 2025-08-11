module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("instagram-logo.svg");
  eleventyConfig.addPassthroughCopy("portfolio");
  eleventyConfig.addPassthroughCopy({"admin": "admin"});
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      output: "dist"
    }
  };
};
