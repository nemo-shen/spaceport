const acorn = require('acorn');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

class InsertMixinPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InsertMixinPlugin', (compilation) => {
      compilation.hooks.optimizeModules.tap('InsertMixinPlugin', (modules) => {
        for (const module of modules) {
          if (module.resource && module.resource.endsWith('.vue')) {
            let source = module.originalSource().source();
            const mixinSourceCode = `
              const mixinCode = {
                methods: {
                  onPluginClick() {
                    console.log('onPluginClick')
                  }
                }
              };
            `;

            // 解析 mixinSourceCode 为 AST
            const mixinAst = acorn.parse(mixinSourceCode, { ecmaVersion: 2020, sourceType: 'module' });
            let mixinObject = null;

            // 提取 mixin 对象
            estraverse.traverse(mixinAst, {
              enter(node) {
                if (node.type === 'VariableDeclaration' && node.declarations[0].id.name === 'mixinCode') {
                  mixinObject = node.declarations[0].init;
                  this.break(); // 找到后停止遍历
                }
              }
            });

            if (!mixinObject) {
              throw new Error('Failed to parse mixin code.');
            }

            // 解析源代码为 AST
            const ast = acorn.parse(source, { ecmaVersion: 2020, sourceType: 'module' });

            // 遍历 AST，找到 export default 语句
            let modified = false;
            estraverse.replace(ast, {
              enter(node) {
                if (!modified && node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ObjectExpression') {
                  const properties = node.declaration.properties;
                  const mixinsIndex = properties.findIndex(prop => prop.key && prop.key.name === 'mixins');

                  if (mixinsIndex !== -1) {
                    // 如果存在 mixins 属性
                    const mixinsArray = properties[mixinsIndex].value.elements;
                    mixinsArray.push({
                      type: 'Identifier',
                      name: 'mixinCode'
                    });
                  } else {
                    // 如果不存在 mixins 属性
                    properties.push({
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'mixins'
                      },
                      value: {
                        type: 'ArrayExpression',
                        elements: [{
                          type: 'Identifier',
                          name: 'mixinCode'
                        }]
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
            if (modified) {
              const modifiedCode = escodegen.generate(ast);
              source = modifiedCode;
              module._source._value = source;
            }
          }
        }
      });
    });
  }
}

module.exports = InsertMixinPlugin;
