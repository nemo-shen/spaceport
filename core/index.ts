type Vue2Lifetime =
  | "beforeCreate"
  | "created"
  | "beforeMount"
  | "mounted"
  | "beforeUpdate"
  | "updated"
  | "activated"
  | "deactivated"
  | "beforeDestroy"
  | "destroyed"
  | "errorCaptured";

type ExposeComponentConfig = {
  // 暴露的组件名(可用于重写组件名)
  name: string;
  // 允许三方感知到的data
  data?: string[];
  // 允许三方感知到的computed
  computed?: string[];
  // 允许三方感知到的props
  props?: string[];
  // 允许三方感知到的method，即三方可以调用这些方法处理组件逻辑
  methods?: string[];
  // 生命周期默认全部暴露，三方代码在标品代码执行之后处理，如果标品组件生命则表示只允许暴露指定的生命周期，建议不使用，暂时不提供这个能力
  // lifetime: Vue2Lifetime[];
};

/**
 * 暴露组件
 */
export const exposeComponent = (config?: ExposeComponentConfig, component: any) => {
  return component;
};

/**
 * 复用组件
 */
export const useExposedComponent = (component) => {
  return component;
};
