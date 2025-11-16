const pluginRss = require('@11ty/eleventy-plugin-rss');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  // Passthroughs
  eleventyConfig.addPassthroughCopy('assets');

  // Shortcodes / Filters
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return new Date(dateObj).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  // Collection for posts (files in src/posts)
  eleventyConfig.addCollection('post', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md');
  });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  };
};
