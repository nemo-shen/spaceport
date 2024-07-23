const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const t = require('@babel/types')
const qs = require('querystring')
module.exports = function(source) {

  const filePath = this.resourcePath
  const query = qs.parse(this.resourceQuery)

  // 输出文件路径
  if (/Button\.vue$/.test(filePath) && query.type === 'script') {
    const ast = parser.parse(source, { sourceType: 'module' })

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
    `
    const mixinAst = parser.parse(mixinSourceCode, {
      sourceType: 'module',
      plugins: ['jsx']
    })
    traverse(mixinAst, {
      VariableDeclarator(path) {
        if (path.node.id.name === 'mixinCode') {
          mixinObject = path.node.init
        }
      }
    })
    traverse(ast, {
      ObjectExpression(path) {
        const properties = path.node.properties
        const setupIndex = properties.findIndex(prop => prop.key.name === 'setup')

        if (setupIndex !== -1) {
          const mixinsProperty = t.objectProperty(
            t.identifier('mixins'),
            t.arrayExpression([mixinObject])
          )

          properties.splice(setupIndex, 0, mixinsProperty)
        }
      }
    })

    const output = generate(ast, {}, source)
    return output.code;
    console.log(output)
    console.log('-----------------------------')
  }
  return source
}