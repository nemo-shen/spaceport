const { ConcatSource } = require("webpack-sources");
const pluginName = "MyPlugin";

class MyPlugin {
  apply(compiler) {
    // compiler.hooks.afterCompile.tap("MyWebpackPlugin", (compilation) => {
    //   // 在此处编写你的自定义处理逻辑
    //   // compilation 对象包含了编译过程中的所有信息
    //   console.log("All modules have been compiled!");

    //   // 你可以在这里对 compilation 对象进行修改
    //   // 例如, 你可以遍历所有的模块, 并进行一些后处理
    //   for (const module of compilation.modules) {
    //     if (module._source && module._source._value) {
    //       console.log(module._source._value, "\n");
    //     }
    //     // if (
    //     //   module.request &&
    //     //   module.request.includes("HelloWorld.vue?vue&type=script&lang=js")
    //     // ) {
    //     //   // 对每个模块进行你需要的处理

    //     //   if (typeof module._source !== "undefined") {
    //     //     // 在模块源码的开头插入一行 `const a = 1;`
    //     //     module._source._value = `const a = 1;\n${module._source._value}`;
    //     //   }
    //     //   console.log(`Processing module: ${module.request}\n`);
    //     // }
    //   }
    // });

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.optimizeChunkAssets.tap(pluginName, (chunks) => {
        chunks.forEach((chunk) => {
          chunk.files.forEach((filename) => {
            if (filename.includes("app")) {
              compilation.assets[filename] = new ConcatSource(
                compilation.assets[filename]
                  .source()
                  .replace("exposeComponent", "nemoshen")
              );
            }
          });
        });
      });
    });

    // compiler.hooks.compilation.tap(pluginName, (compilation) => {
    //   compilation.hooks.optimizeChunkAssets.tap(pluginName, (chunks) => {
    //     chunks.forEach((chunk) => {
    //       chunk.files.forEach((filename) => {
    //         console.log(filename);
    //       });
    //     });
    //   });
    // });

    // compiler.hooks.normalModuleFactory.tap('MyPlugin', (factory) => {
    //   factory.hooks.parser.for('javascript/auto').tap('MyPlugin', (parser, options) => {
    //     parser.hooks.program.tap('MyPlugin', (ast, comments) => {

    //       if (parser.state &&
    //         parser.state.module &&
    //         parser.state.module.resource.indexOf('node_modules') === -1) {
    //         if (parser.state.module.resource.endsWith('.vue?vue&type=script&lang=js')) {
    //           const exposedComponentRegex = /exposeComponent/;

    //           const {source} = parser.state;
    //           const match = source.match(exposedComponentRegex);
    //           if (match) {
    //             const mixinCode = `
    //           const cloudMixin = {
    //             name: 'CloudHelloWorld',
    //             methods: {
    //               doFoo() {
    //                 console.log('foo')
    //               }
    //             }
    //           };
    //         `;
    //             parser.state.source = 'const a = 1'
    //             // const t = parser.getTagOfNode(ast);
    //             // const body = t.get('body');
    //             // body.unshift(parser.parseExpression(mixinCode));
    //             //
    //             // // 将修改后的 AST 赋值回去
    //             debugger
    //             // console.log(ast)
    //           }
    //         }
    //       }
    //     })
    //   })
    // })
  }
}

module.exports = MyPlugin;
