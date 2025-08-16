module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("main.js");
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
