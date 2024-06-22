const path = require('path')
const { defineConfig } = require('@vue/cli-service')

const MyPlugin = require('./build/my-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      minimize: false,
    },
    plugins: [
      new MyPlugin()
    ]
  },
})
