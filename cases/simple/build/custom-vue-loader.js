const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
// const { getOptions } = require('loader-utils');
// const { parse } = require('@vue/component-compiler-utils');

module.exports = function (source) {
  if (source.includes('exposeComponent(')) {
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
    console.log(source)
    // const sourceAST = babel.parse(source, {
    //   sourceType: 'module'
    // });
    // const mixinAST = babel.parse(mixinCode, {
    //   sourceType: 'module'
    // });
    // traverse(sourceAST, {
    //   Program: {
    //     enter(path) {
    //       // 遍历 sourceAST 的 body,找到所有的 ImportDeclaration 节点
    //       let importIndex = 0;
    //       for (let i = 0; i < path.node.body.length; i++) {
    //         if (path.node.body[i].type === 'ImportDeclaration') {
    //           importIndex = i + 1;
    //         }
    //       }
    //       // 将 mixinAST 中的内容插入到最后一个 import 语句之后
    //       path.node.body.splice(importIndex, 0, ...mixinAST.program.body);
    //     }
    //   },
    //   ExportDefaultDeclaration(path) {
    //     // 在 exportDefaultDeclaration 节点中添加 mixins 属性
    //     const properties = path.node.declaration.properties;
    //     properties.push({
    //       type: 'ObjectProperty',
    //       key: {
    //         type: 'Identifier',
    //         name: 'mixins'
    //       },
    //       value: {
    //         type: 'ArrayExpression',
    //         elements: [
    //           {
    //             type: 'Identifier',
    //             name: 'cloudMixin'
    //           }
    //         ]
    //       }
    //     });
    //   }
    // });
    // const { code } = generator(sourceAST);
    // console.log(code);
  }
  return source
  // const options = getOptions(this);
  //
  // // 解析 .vue 文件的内容
  // const descriptor = parse({
  //   source,
  //   needMap: false,
  //   compiler: options.compiler
  // });
  //
  // // 在 script 部分添加额外的代码
  // const script = descriptor.script;
  // script.content = `
  //   ${script.content}
  //   const extraCode = {
  //     name: 'ExtraComponent',
  //     methods: {
  //       doSomething() {
  //         console.log('Extra functionality');
  //       }
  //     }
  //   };
  //   export default { ...options.default, mixins: [extraCode] };
  // `;

  // 返回修改后的 script 部分
  return source;

  // return script.content;
};
