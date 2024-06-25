// 代码这边应该是要混入原本的
import { extendComponent } from "@/utils";
export default extendComponent("export-hello-world", {
  name: "CloudHelloWorld",
  methods: {
    doFoo() {
      console.log("foo");
    }
  }
});