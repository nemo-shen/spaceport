export const exposeComponent = (config, component) => {
  component.name = config.name;
  return component;
};

export const extendComponent = (symbol, component) => {
  component.mixins = [
    ...(component.mixins ?? []),
    {
      // 还要注意，原本组件的方法应该要变成super中的能力，这样能允许三方代码选择是否要调用原本的代码
      // onSourceClick() {
      //   this.super.onSourceClick()
      // }
      methods: {
        onSourceClick() {
          console.log("onSourceClick");
        },
      },
    },
  ];
  return component;
};
