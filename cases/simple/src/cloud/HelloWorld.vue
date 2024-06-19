<template>
  <div>custom hello world</div>
</template>

<script>
import { extendComponent } from "@/utils";

export default extendComponent('export-hello-world', {
  name: 'CloudHelloWorld',
  methods: {
    doFoo() {
      console.log('foo')
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
