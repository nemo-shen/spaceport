<template>
  <p>prop foo: {{ foo }}</p>
  <button @click="inc">{{ count }}</button>
  <slot/>
</template>

<script>
import { ref } from 'vue'

const extendComponent = (a, b) => b

export default extendComponent({}, {
  props: {
    foo: String
  },
  setup(props) {
    const count = ref(0)
    return {
      count,
      inc: () => { count.value++ },
      add: async () => {
        const res = await fetch('api');
        console.log(res)
        return 1;
      }
    }
  }
})
</script>

<style scoped>
::v-slotted(*) {
  color: green;
}
</style>

<docs>
This component is fire. // <-- this should be logged
</docs>
