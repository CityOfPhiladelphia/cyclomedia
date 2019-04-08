const ExtractTextPlugin = require('mini-css-extract-plugin');

module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')

    config.plugin('extract-css')
      .use(ExtractTextPlugin, [{
        filename:  'css/[name].css',
        allChunks: true
      }])
  }
}
