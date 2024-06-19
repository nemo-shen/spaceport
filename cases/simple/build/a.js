"use strict";
const pluginName = 'MyPlugin';
const NullFactory = require('webpack/lib/NullFactory');
const ConstDependency = require("webpack/lib/dependencies/ConstDependency");

class MyPlugin {

  apply(compiler) {

    compiler.hooks.compilation.tap(
      "MyPlugin",
      (compilation, {normalModuleFactory}) => {
        compilation.dependencyFactories.set(ConstDependency, new NullFactory());
        compilation.dependencyTemplates.set(
          ConstDependency,
          new ConstDependency.Template()
        );
      });


    compiler.hooks.normalModuleFactory.tap('MyPlugin', (factory) => {
      factory.hooks.parser.for('javascript/auto').tap('MyPlugin', (parser, options) => {
        parser.hooks.program.tap('MyPlugin', (ast, comments) => {

          if (parser.state &&
            parser.state.module &&
            parser.state.module.resource.indexOf('node_modules') === -1) {

            if (parser.state.module.resource.endsWith('tsx')) {
              var g = ast.body.map(n => {
                try {
                  let {
                    expression: {
                      left: {property: {name: my}},
                      right: {body: {body: [{argument: {arguments: [div]}}]}}
                    }
                  } = n
                  return my == 'MyComponent' && div.value == 'div' ? div : false
                } catch (e) {
                  return false;
                }
              }).filter(e => e);
              for (let div of g) {
                let dep = new ConstDependency(JSON.stringify('label'), div.range);
                dep.loc = div.loc;
                parser.state.current.addDependency(dep);
              }
            }
          }
        });
      });
    });
  }
}

module.exports = MyPlugin;