const a =`// 代码这边应该是要混入原本的
import { extendComponent } from "@/utils";
/* harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (__WEBPACK_MODULE_REFERENCE__5_5b22657874656e64436f6d706f6e656e74225d_call_directImport_asiSafe1__._("export-hello-world", {
  name: "CloudHelloWorld",
  methods: {
    doFoo() {
      console.log("foo");
    }
  }
}));`

console.log(a.length)