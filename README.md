# Spaceport

Wikipedia: https://en.wikipedia.org/wiki/spaceport

vue2

适用场景

定制代码：已有完整vue2项目，其他第三方需要做部分代码组件调整，但是完整项目不希望直接暴露给第三方开发者


生态

- API 设计
- 编译时工具：spaceport-loader
- spaceport-doc 用于生成暴露组件
- vscode/idea 插件
- cli 用于快速移除一些spaceport代码
- lint规则增强

实现能力

- 允许指定暴露的组件
- 允许有限制的暴露组件API
- 支持页面编排：替换组件UI、组件排列调整
- 自动生成组件文档（需要符合JSDoc）
- store支持(移除某个组件不影响标品代码执行)
- 组件的slot需要正确处理
- 循环组件的index

其他
- 支持 vue2
- 支持 高版本 vue2 ts的装饰器
- 支持 vue3
- 构建工具支持 webpack rspack vitejs
