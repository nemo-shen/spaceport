1. 感知三方的.vue文件
2. 必定有template
3. 必定有script
4. 可选style
5. 因此保持的是和vue2相同的策略
6. 直接用三方的template替换原本组件的template
7. script采用mixin方式合并

要考虑一个组件可能在代码多处使用

Comp1 -> CompParent1
|   -> CompParnet2

三方只考虑他需要进行定制的地方，但是不用考虑组件在多个场景中的情况


# 商详
-> sku -> 那么它应该有特殊的一个标记

Before
Comp1 --use--> ItemDetail
Comp1 --use--> BottomAction

重写的这个组件应该叫做CloudComp1并且应该只会在指定的位置被使用到

After

Comp1 --fork--> CloudComp1 --use--> ItemDetail
Comp1 --use--> BottomAction


Comp1 --fork--> CloudComp1 --use--> ItemDetail
Comp1


template
1. 支持隐藏
2. 支持复用
3. 支持重写
4. 不支持多个实现
5. 如果需要有多个实现，可以用slots（即标品设置slot[name=自定义]，通过slot进行使用）


sku
```html
<template>
<div>
  <slot name="header" />
  <slot name="bodyer" />
  <slot name="footer" />
</div>
</template>
```

third-sku
```html
<template>
<div>
  <div slot="header"></div>
  <slot name="header" />
  <slot name="bodyer" />
  <slot name="footer" />
</div>
</template>
```







script
1. 支持增加

styles
style0+style[1...n]





确定方向

1. 先实现组件的template替换和script mixin