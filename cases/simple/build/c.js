const acorn = require('acorn');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

class InsertMixinPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InsertMixinPlugin', (compilation, { normalModuleFactory }) => {

      normalModuleFactory.hooks.parser.for('javascript/auto').tap('InsertMixinPlugin', (parser) => {

        parser.hooks.program.tap('InsertMixinPlugin', (ast, comments) => {
          let modified = false;

          // 解析 mixin 代码
          const mixinSourceCode = `
            const mixinCode = {
              methods: {
                onPluginClick() {
                  console.log('onPluginClick')
                }
              }
            };
          `;
          const mixinAst = acorn.parse(mixinSourceCode, { ecmaVersion: 2020, sourceType: 'module' });
          let mixinObject = null;

          estraverse.traverse(mixinAst, {
            enter(node) {
              if (node.type === 'VariableDeclaration' && node.declarations[0].id.name === 'mixinCode') {
                mixinObject = node.declarations[0].init;
                this.break();
              }
            }
          });

          if (!mixinObject) {
            throw new Error('Failed to parse mixin code.');
          }

          // 遍历 AST，找到 export default 语句
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

                modified = true;
              }
            }
          });

          // 将修改后的 AST 转回代码
          const modifiedSource = escodegen.generate(ast);
          parser.state.current._source._value = modifiedSource;
        });
      });
    });
  }
}

module.exports = InsertMixinPlugin;
