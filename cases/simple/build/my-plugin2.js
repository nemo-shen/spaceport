const escodegen = require('escodegen');
const PLUGIN_NAME = 'MyPlugin2'
class MyPlugin2 {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (normalModuleFactory) => {
      normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, (parser) => {
        // 使用 program 钩子来确认我们已经进入了解析阶段
        parser.hooks.program.tap('MyPlugin', (ast, comments) => {
          const source = escodegen.generate(ast)
          if (source.includes('extendComponent')) {
            // console.log('Parsing program:', ast, parser.state.module);
          }
        });

        // 使用 call 钩子来捕获特定的函数调用
        parser.hooks.call.for('__webpack_require__').tap(PLUGIN_NAME, (expr) => {
          console.log('Found extendComponent call:', expr);
          // 你可以在这里对 expr 进行进一步处理
        });
      });
    });
  }
}

module.exports = MyPlugin2;
