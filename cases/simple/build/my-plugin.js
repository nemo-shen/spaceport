const acorn = require('acorn');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const {ConcatSource} = require("webpack-sources");
const {sources, Dependency} = require('webpack');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const pluginName = "MyPlugin";

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

class MyDependencyTemplate {
  apply(dep, source) {
    const mixinObject = {
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            name: 'methods'
          },
          value: {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: {
                  type: 'Identifier',
                  name: 'onPluginClick'
                },
                value: {
                  type: 'FunctionExpression',
                  id: null,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'CallExpression',
                          callee: {
                            type: 'MemberExpression',
                            computed: false,
                            object: {
                              type: 'Identifier',
                              name: 'console'
                            },
                            property: {
                              type: 'Identifier',
                              name: 'log'
                            }
                          },
                          arguments: [
                            {
                              type: 'Literal',
                              value: 'onPluginClick',
                              raw: "'onPluginClick'"
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                kind: 'init',
                method: true,
                shorthand: false,
                computed: false
              }
            ]
          },
          kind: 'init',
          method: false,
          shorthand: false,
          computed: false
        }
      ]
    };

    // 解析源代码为 AST
    const ast = acorn.parse(source.source(), { ecmaVersion: 2020, sourceType: 'module' });

    // 遍历和修改 AST
    let modified = false;
    estraverse.replace(ast, {
      enter(node) {
        if (!modified && node.type === 'ObjectExpression') {
          const properties = node.properties;
          const mixinsIndex = properties.findIndex(prop => prop.key && prop.key.name === 'mixins');

          if (mixinsIndex !== -1) {
            // 如果存在 mixins 属性
            const mixinsArray = properties[mixinsIndex].value.elements;
            mixinsArray.unshift(mixinObject);
          } else {
            // 如果不存在 mixins 属性
            properties.unshift({
              type: 'Property',
              key: {
                type: 'Identifier',
                name: 'mixins'
              },
              value: {
                type: 'ArrayExpression',
                elements: [mixinObject]
              },
              kind: 'init',
              method: false,
              shorthand: false,
              computed: false
            });
          }

          modified = true; // 标记已修改，防止无限循环
        }
      }
    });

    // 生成修改后的代码
    const newSource = escodegen.generate(ast);
    source.replace(0, source.size(), newSource);
  }
}
class MyPlugin {
  apply(compiler) {
    // 我需要在分析代码阶段进行处理

    // 最终优化产物的时候进行实际代码的替换
    // 现在要做的是识别到 extendComponent 然后把第一个参数改写掉
    // compiler.normalModuleFactory.hooks.parser
    //   .for("javascript/auto")
    //   .tap(pluginName, (parser) => {
    //     parser.hooks.call
    //       .for("extendComponent")
    //       .tap(pluginName, (expression) => {
    //         // 在这里添加您自己的逻辑，例如修改表达式或记录信息
    //       });
    //   });

    // compiler.hooks.normalModuleFactory.tap(pluginName, (factory) => {
    //   factory.hooks.parser.for("javascript/auto").tap(pluginName, (parser) => {
    //     if (parser.hooks && parser.hooks.program) {
    //       parser.hooks.program
    //         .tap(pluginName, (ast, comments) => {
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
    //   //   pluginName,
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

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // compilation.hooks.optimizeModules.tap(pluginName, modules => {
      //   for (const module of modules) {
      //     if (module.context && module.context.includes('cloud') && module.type === 'javascript/auto' && module.resource && module.resource.includes('HelloWorld.vue?vue&type=script')) {
      //         // 获取模块的原始源代码
      //         const originalSource = module.originalSource();
      //         const originalSourceCode = originalSource.source();
      //
      //         // 创建 ReplaceSource 实例
      //         const replaceSource = new sources.ReplaceSource(originalSource);
      //
      //         // 查找并替换 console.log
      //         const regex = /console\.log/g;
      //         let match;
      //         while ((match = regex.exec(originalSourceCode)) !== null) {
      //           replaceSource.replace(match.index, match.index + match[0].length - 1, 'console.warn');
      //         }
      //
      //         console.log(module._source)
      //         // 使用 webpack 提供的 API 设置新的源代码
      //         // module._source = replaceSource;
      //       }
      //       // module._source = new sources.RawSource(modifiedSource);
      //   }
      // })
      // compilation.hooks.buildModule.tap('MyPluginName', module => {
      //   module.addDependency(new MyDependency(module));
      // });

      compilation.dependencyTemplates.set(
        MyDependency,
        new MyDependencyTemplate(),
      );

      compilation.hooks.succeedModule.tap(pluginName, (module) => {
        if (module.context && module.context.includes('cloud')
          && module.type === 'javascript/auto'
          && module.resource
          && module.resource.includes('HelloWorld.vue?vue&type=script')
        ) {
          // console.log(parser.state.module.buildInfo)
          // module.addDependency(new Dependency());
          module.addDependency(new MyDependency(module.resource));
        }
        // if (module.context && module.context.includes('cloud') && module.type === 'javascript/auto' && module.resource && module.resource.includes('HelloWorld.vue?vue&type=script')) {
        //   const originalSource = module.originalSource();
        //   console.log(originalSource)
        // }
      });
      // compilation.hooks.normalModuleFactory.tap(pluginName, (normalModuleFactory) => {
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
      //   name: pluginName,
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
      // compilation.hooks.optimizeChunkAssets.tap(pluginName, (chunks) => {
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
