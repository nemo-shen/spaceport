<template>
  <!-- 模板肯定是用自定义的不会影响原本的组件 -->
  <div>这里应该是自定义的模板代码</div>

  <!-- 如果三方希望复用原本的组件可以使用这种方式进行复用 -->
  <hello-world @on-xxx="">
    <div slot="header">header</div>
  </hello-world>
</template>

<script>
// props: 应该透传给组件，但是当组件点击时触发的方法可能不会触发自定义组件这里
// 如果希望触发的话那就应该要再每个方法中改变成emit了
// event(emit)
// 直接向上抛出即可
// slot
// 继续往内部插入
// 也就是说这里的 <hello-world /> 组件实际上已经变成了一层代理
/**
 * methods: {
 *   innerDoFoo() {
 *     this.emit('doFoo')
 *   }
 * }
 */


export default {
  //
  // 最终生产环境的产物是没有 extendComponent 的，但是在开发环境可以有，因为可能会提供远程拉取能力
  name: "CloudHelloWorld",
  mixins: [HelloWorld], // 基于vue2的mixin实现合并带代码，这样能保证自定义组件的代码优先，并且策略和vue2保持一致
  methods: {
    doFoo() {
      console.log("foo");
    },
  },
};
</script>

<!-- 样式是隔离的，自定义组件无法影响到原有组件的样式 -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
