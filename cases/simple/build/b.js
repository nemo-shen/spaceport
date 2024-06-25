const acorn = require('acorn');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

class MyDependencyTemplate {
  apply(dep, source) {
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
    const sourceCode = source.source();
    const ast = acorn.parse(sourceCode, { ecmaVersion: 2020, sourceType: 'module' });

    // 遍历 AST，找到 export default 语句
    let modified = false;
    estraverse.replace(ast, {
      enter(node) {
        if (!modified && node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'CallExpression') {
          const exportObject = node.declaration.arguments[1];
          if (exportObject && exportObject.type === 'ObjectExpression') {
            const properties = exportObject.properties;
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
      }
    });

    // 生成修改后的代码
    const modifiedCode = escodegen.generate(ast);

    // 将新的 mixinCode 插入到现有的 _replacements 中
    const newReplacements = [
      ...source._replacements,
      {
        start: 0,
        end: source.size(),
        content: modifiedCode
      }
    ];

    // 更新 source 对象的 _replacements
    source._replacements = newReplacements;
  }
}

// 示例使用
const source = {
  _source: {
    _valueAsString: `
      import { HelloWorldvue_type_script_lang_js_extendComponent } from "@/utils";
      export default HelloWorldvue_type_script_lang_js_extendComponent("export-hello-world", {
        // 其他代码...
      });
    `
  },
  source() {
    return this._source._valueAsString;
  },
  size() {
    return this._source._valueAsString.length;
  },
  _replacements: [
    {
      start: 75,
      end: 89,
      content: '__WEBPACK_MODULE_REFERENCE__5_5b22657874656e64436f6d706f6e656e74225d_call_directImport_asiSafe1__._'
    }
  ]
};

const myDependencyTemplate = new MyDependencyTemplate();
myDependencyTemplate.apply(null, source);

// 输出最终的 _replacements
console.log(source._replacements);
