const fs = require('fs');
const webpack = require('webpack');
const path = require('path')
const { defineConfig } = require('@vue/cli-service')

const MyPlugin = require('./build/my-plugin')
const MyPlugin2 = require('./build/my-plugin2')
module.exports = defineConfig({
  chainWebpack: config => {
    const finalConfig = config.toConfig();
    fs.writeFileSync('vue.config.full.js', JSON.stringify(finalConfig, null, 2), 'utf-8');
  },
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      minimize: false,
    },
    plugins: [
      new MyPlugin(),
      // new MyPlugin2()
      // new MyPlugin3()
    ]
  },
})
