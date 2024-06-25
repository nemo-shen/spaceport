const path = require('path')
const { defineConfig } = require('@vue/cli-service')

const MyPlugin = require('./build/my-plugin')
const MyPlugin2 = require('./build/my-plugin2')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      minimize: false,
    },
    plugins: [
      new MyPlugin()
      // new MyPlugin2()
      // new MyPlugin3()
    ]
  },
})
