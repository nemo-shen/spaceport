const acorn = require('acorn');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const {ConcatSource} = require("webpack-sources");
const {sources, Dependency} = require('webpack');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const PLUGIN_NAME = "MyPlugin";

const {
  JAVASCRIPT_MODULE_TYPE_AUTO,
  JAVASCRIPT_MODULE_TYPE_DYNAMIC,
  JAVASCRIPT_MODULE_TYPE_ESM,
  WEBPACK_MODULE_TYPE_RUNTIME
} = require("./ModuleTypeConstants");

class MyDependency extends Dependency {
  // Use the constructor to save any information you need for later
  constructor(request) {
    super();
    this.request = request
    // this.module = module;
  }

  get type() {
    return 'my-dependency';
  }
}

MyDependency.Template = class MyDependencyTemplate {
  apply(dep, source) {
    const originalCode = source.original()._valueAsString
    const ast = acorn.parse(originalCode, { ecmaVersion: 2020, sourceType: 'module' });
    // 遍历 AST 并修改节点
    estraverse.traverse(ast, {
      enter(node) {
        const mixinSourceCode = `
const mixinCode = {
  methods: {
    onPluginClick() {
      console.log('onPluginClick')
    }
  }
};
    `;
        // 查找 extendComponent 调用
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'extendComponent' &&
          node.arguments.length > 1
        ) {
          const mixinCodeAST = acorn.parse(mixinSourceCode)
          const secondArg = node.arguments[1];
          if (secondArg.type === 'ObjectExpression') {
            const isExistMixinProp = secondArg.properties.some(node => node.key.name === 'mixins')
            if (!isExistMixinProp) {
              secondArg.properties.push({
                type: 'Property',
                key: {
                  type: 'Identifier',
                  name: 'mixins'
                },
                value: {
                  type: "ArrayExpression",
                  elements: [mixinCodeAST.body[0].declarations[0].init]
                },
                kind: 'init'
              });
            } else {
              // TODO
            }
          }
          source.replace(node.start, node.end, escodegen.generate(node).replace('extendComponent', ''))
        }
      }
    });
//     if (source._source._valueAsString) {
//       source._replacements.forEach((place) => {
//         console.log(place)
//       })
//       // 先让所有代码都进行一次处理
//       console.log(source._source._valueAsString)
//       // 我要找到那个object的下标和长度，然后替换那部分就可以了
//       console.log('source.size()', source.size(), source)
//       source.replace(89+1+2, 89+1+2+17, 'export-hello-nemod')
//       console.log('nemo 75 - 89 ', source._source._valueAsString.slice(89+1+2, 89+1+2+18))
//       // 需要处理两种场景，有mixins和无mixins
//       // 实际上也可以在runtime时用extendComponnt函数处理，但是runtime处理影响性能
//       // 这两个策略都应该被支持，因为开发者会在安全性和性能上自行权衡
// //       source.replace(0, source.size(), `extendComponent("export-hello-world", {
// //   name: "CloudHelloWorld",
// //   methods: {
// //     doFoo() {
// //       console.log("foo");
// //     },
// //   },
// // });`)
//     }
//     console.log('\n\n')
//     source.replace(0, source.size(), `// 代码这边应该是要混入原本的
// import { extendComponent } from "@/utils";
// export default extendComponent("export-hello-world", {
//   name: "CloudHelloWorld",
//   methods: {
//     doFoo() {
//       console.log("foo");
//     }
//   }
// });
// `)
  }
}

class MyPlugin {
  apply(compiler) {
    // 我需要在分析代码阶段进行处理

    // 最终优化产物的时候进行实际代码的替换
    // 现在要做的是识别到 extendComponent 然后把第一个参数改写掉
    // compiler.normalModuleFactory.hooks.parser
    //   .for("javascript/auto")
    //   .tap(PLUGIN_NAME, (parser) => {
    //     parser.hooks.call
    //       .for("extendComponent")
    //       .tap(PLUGIN_NAME, (expression) => {
    //         // 在这里添加您自己的逻辑，例如修改表达式或记录信息
    //       });
    //   });

    // compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (factory) => {
    //   factory.hooks.parser.for("javascript/auto").tap(PLUGIN_NAME, (parser) => {
    //     if (parser.hooks && parser.hooks.program) {
    //       parser.hooks.program
    //         .tap(PLUGIN_NAME, (ast, comments) => {
    //           if (ast) {
    //             try {
    //               let has = false
    //               traverse(ast, {
    //                 CallExpression(path) {
    //                   has = true
    //                   if (path.node.callee.name === "extendComponent") {
    //                     // console.log('Found extendComponent call:', path.node);
    //                     // 在这里添加您的逻辑，例如修改AST节点
    //                     parser.state.module._source._value = `const a = 1; ${parser.state.module._source._value}`
    //                     console.log()
    //                     path.node.arguments[0].value = "Added by ExtendComponentPlugin"
    //                   }
    //                 }
    //               });
    //               // if (has) {
    //               //   try {
    //               //     console.log('weflwefwef')
    //               //     const { code } = generate(ast, {}, parser.input);
    //               //     console.log(code)
    //               //   } catch (e) {
    //               //     console.log(e)
    //               //   }
    //               // }
    //             } catch (e) {
    //             }
    //           }
    //           // console.log(ast, comments)
    //         });
    //     }
    //   });
    // })
    //   // factory.hooks.module.tap(
    //   //   PLUGIN_NAME,
    //   //   (module, createData, resolveData) => {
    //   //     if (
    //   //       module.type === "javascript/auto" &&
    //   //       module.context.includes("src/cloud") &&
    //   //       module.resource.includes("HelloWorld.vue?vue&type=script")
    //   //     ) {
    //   //       console.log(module, createData, resolveData);
    //   //       // if (module._source && module._source._value) {
    //   //       //   console.log('nemo module._source._value', module._source._value);
    //   //       //   // module._source._value = `const a = 1; console.log(a + 'nemo test module'); // This is a modified module\n${module._source._value}`;
    //   //       // }
    //   //     }
    //   //     return module;
    //   //   }
    //   // );
    //   // for (const module of modules) {
    //   //   if (
    //   //     module.request &&
    //   //     module.request.includes("HelloWorld.vue?vue&type=script") &&
    //   //     module.context.includes("src/cloud")
    //   //   ) {
    //   //     console.log("-------------------");
    //   //     console.log("nemo module", module._source._valueAsString);
    //   //     console.log("-------------------");
    //   //   }
    //   //   // if (module.resource && module.resource.includes("app")) {
    //   //   // module._source._value = module._source._value.replace(
    //   //   //   "exposeComponent",
    //   //   //   "nemoshen"
    //   //   // );
    //   //   // }
    //   // }
    // });

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      compilation.dependencyTemplates.set(
        MyDependency,
        new MyDependency.Template(),
      );

      compilation.hooks.succeedModule.tap(PLUGIN_NAME, (module) => {
        if (module.context && module.context.includes('cloud')
          && module.type === 'javascript/auto'
          && module.resource
          && module.resource.includes('HelloWorld.vue?vue&type=script')
        ) {
          module.addDependency(new MyDependency(module.resource));
        }
      });

      // compilation.hooks.normalModuleFactory.tap(PLUGIN_NAME, (normalModuleFactory) => {
      //   // normalModuleFactory.hooks.beforeResolve.tapAsync('MyPlugin', (resolveData, callback) => {
      //   //   // 你可以在这里修改 resolveData
      //   //   console.log('Before Resolve:', resolveData);
      //   //   callback();
      //   // });
      //   //
      //   // normalModuleFactory.hooks.afterResolve.tapAsync('MyPlugin', (resolveData, callback) => {
      //   //   // 你可以在这里修改 resolveData
      //   //   console.log('After Resolve:', resolveData);
      //   //   callback();
      //   // });
      //
      // })
      // compilation.hooks.processAssets.tap({
      //   name: PLUGIN_NAME,
      //   state: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
      // }, (assets) => {
      //   Object.keys(assets).forEach((filename) => {
      //     if (filename.includes('app')) {
      //       compilation.assets[filename] = new ConcatSource(
      //         compilation.assets[filename]
      //           .source()
      //           .replaceAll("exposeComponent", "nemoshen9999")
      //       );
      //     }
      //   })
      //   // chunks.forEach((chunk) => {
      //   //   chunk.files.forEach((filename) => {
      //   //     if (filename.includes("app")) {
      //   //     }
      //   //   });
      //   // });
      // });
      // compilation.hooks.optimizeChunkAssets.tap(PLUGIN_NAME, (chunks) => {
      //   chunks.forEach((chunk) => {
      //     chunk.files.forEach((filename) => {
      //       if (filename.includes("app")) {
      //         // compilation.assets[filename] = new ConcatSource(
      //         //   compilation.assets[filename]
      //         //     .source()
      //         //     .replace("exposeComponent", "nemoshen")
      //         // );
      //       }
      //     });
      //   });
      // });
    });

  }
}

module.exports = MyPlugin;
