<template>
  <!-- 模板肯定是用自定义的不会影响原本的组件 -->
  <div>
    <div>custom hello world</div>
    <button @click="onSourceClick">sourceClick</button>
    <button @click="onPluginClick">onPluginClick</button>
    <!-- <super /> -->
  </div>
</template>

<script>
// 代码这边应该是要混入原本的
import { extendComponent } from "@/utils";

export default extendComponent("export-hello-world", {
  name: "CloudHelloWorld",
  methods: {
    doFoo() {
      console.log("foo");
    },
  },
});
</script>

<style scoped>
/* 样式肯定只影响他本身，不会影响原本组件的样式 */
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
