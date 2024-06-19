const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      // 遍历所有模块
      Object.keys(compilation.modules).forEach((moduleId) => {
        const module = compilation.modules[moduleId];

        // 检查模块是否是JavaScript文件
        if (module.type === 'javascript/auto') {
          const sourceCode = module.source();
          const mixinCode = `
            const cloudMixin = {
              name: 'CloudHelloWorld',
              methods: {
                doFoo() {
                  console.log('foo')
                }
              }
            }
          `;

          // 解析 sourceCode 为 AST
          const sourceAST = babel.parse(sourceCode, {
            sourceType: 'module'
          });

          // 解析 mixinCode 为 AST
          const mixinAST = babel.parse(mixinCode, {
            sourceType: 'module'
          });

          // 将 mixinAST 中的 cloudMixin 添加到 sourceAST 中
          traverse(sourceAST, {
            Program: {
              enter(path) {
                // 遍历 sourceAST 的 body,找到所有的 ImportDeclaration 节点
                let importIndex = 0;
                for (let i = 0; i < path.node.body.length; i++) {
                  if (path.node.body[i].type === 'ImportDeclaration') {
                    importIndex = i + 1;
                  }
                }
                // 将 mixinAST 中的内容插入到最后一个 import 语句之后
                path.node.body.splice(importIndex, 0, ...mixinAST.program.body);
              }
            },
            ExportDefaultDeclaration(path) {
              // 在 exportDefaultDeclaration 节点中添加 mixins 属性
              const properties = path.node.declaration.properties;
              properties.push({
                type: 'ObjectProperty',
                key: {
                  type: 'Identifier',
                  name: 'mixins'
                },
                value: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'cloudMixin'
                    }
                  ]
                }
              });
            }
          });

          // 生成最终的代码
          const { code } = generator(sourceAST);
          module.source = () => code;
        }
      });

      callback();
    });
  }
}

module.exports = MyPlugin;
