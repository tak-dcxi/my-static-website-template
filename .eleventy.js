module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/');
  return {
    pathPrefix: '/',
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true,
    dir: {
      input: 'src/template', //入力ディレクトリ
      output: 'dist', //出力ディレクトリ
      includes: '_includes', //インクルードディレクトリ
      data: '_data', //データディレクトリ
    },
  };
};
