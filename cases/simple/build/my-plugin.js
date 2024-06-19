class MyPlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('MyPlugin', (factory) => {
      factory.hooks.parser.for('javascript/auto').tap('MyPlugin', (parser, options) => {
        parser.hooks.program.tap('MyPlugin', (ast, comments) => {

          if (parser.state &&
            parser.state.module &&
            parser.state.module.resource.indexOf('node_modules') === -1) {
            if (parser.state.module.resource.endsWith('.vue?vue&type=script&lang=js')) {
              const exposedComponentRegex = /exposeComponent/;

              const {source} = parser.state;
              const match = source.match(exposedComponentRegex);
              if (match) {
                const mixinCode = `
              const cloudMixin = {
                name: 'CloudHelloWorld',
                methods: {
                  doFoo() {
                    console.log('foo')
                  }
                }
              };
            `;
                parser.state.source = 'const a = 1'
                // const t = parser.getTagOfNode(ast);
                // const body = t.get('body');
                // body.unshift(parser.parseExpression(mixinCode));
                //
                // // 将修改后的 AST 赋值回去
                debugger
                // console.log(ast)
              }
            }
          }
        })
      })
    })
  }
}

module.exports = MyPlugin;
