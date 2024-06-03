<template>
  <div>这是标品组件: {{ foo }}</div>
</template>

<script lang="ts">
import { exposeComponent } from "../core";

export default exposeComponent({
  name: 'item-image-swiper',
}, {
  name: 'item-image',
  props: {},
  data () {
    return {
      foo: 'foo'
    };
  },
  computed: {},
  methods: {},
})
</script>
