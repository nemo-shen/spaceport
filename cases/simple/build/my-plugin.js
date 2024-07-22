const acorn = require('acorn');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const {ConcatSource} = require("webpack-sources");
const {sources, Dependency} = require('webpack');
const HarmonyImportDependency = require('webpack/lib/dependencies/HarmonyImportDependency')
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
    this.request = request;
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
    async onPluginClick() {
      const a = async () => {
        return await fetch('api/cloud/code');
      }
      await a();
      console.log('onPluginClick')
    }
  }
};
    `;
        // 接下来要将extendComponent作为一个依赖进行处理，而不是直接在mixins中写入对象
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
            const mixinsIndex = secondArg.properties.findIndex(node => node.key.name === 'mixins')
            if (mixinsIndex === -1) {
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
              const mixinNode = secondArg.properties[mixinsIndex]
              mixinNode.value.elements.unshift(mixinCodeAST.body[0].declarations[0].init)
            }
          }
          source.replace(node.start, node.end, escodegen.generate(node).replace('extendComponent', ''))
        }
      }
    });
  }
}

class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      compilation.dependencyTemplates.set(
        MyDependency,
        new MyDependency.Template(),
      );

      compilation.dependencyTemplates.set(
        HarmonyImportDependency,
        new HarmonyImportDependency.Template()
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
    });
  }
}

module.exports = MyPlugin;
