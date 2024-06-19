const path = require('path')
const { defineConfig } = require('@vue/cli-service')

const MyPlugin = require('./build/my-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      minimize: false,
    },
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        // 修改 vue-loader 的默认配置
        return options;
      })
      .end()
      .use('custom-vue-loader')
      .loader(path.resolve(__dirname, 'build/custom-vue-loader.js'));
  }
})
