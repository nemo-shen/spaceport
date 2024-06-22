const { ConcatSource } = require("webpack-sources");
const pluginName = "MyPlugin";

class MyPlugin {
  apply(compiler) {
    // 我需要在分析代码阶段进行处理

    // 最终优化产物的时候进行实际代码的替换
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.optimizeChunkAssets.tap(pluginName, (chunks) => {
        chunks.forEach((chunk) => {
          chunk.files.forEach((filename) => {
            if (filename.includes("app")) {
              // compilation.assets[filename] = new ConcatSource(
              //   compilation.assets[filename]
              //     .source()
              //     .replace("exposeComponent", "nemoshen")
              // );
            }
          });
        });
      });
    });
  }
}

module.exports = MyPlugin;
