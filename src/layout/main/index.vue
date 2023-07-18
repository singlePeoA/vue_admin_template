<template>
  <!-- 当点击了layout主页侧边栏菜单选项，就会跳转到对应的路由组件，这个文件的作用是渲染这个跳转过程 -->
  <!-- 路由组件的出口位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>
<script setup lang="ts">
import { watch, ref, nextTick } from "vue"
import useLayoutSettingStore from "@/store/modules/setting"
let LayoutSettingStore = useLayoutSettingStore()

// 控制当前展示内容的组件是否要被销毁
let flag = ref(true)

// 监听仓库内部的数据是否发生了变化，主要是监听里里面的refresh数据是否发生了变化，如果变化了就说明顶部栏中的刷新icon图标已经被点击了
watch(
  () => LayoutSettingStore.refresh,
  () => {
    // 如果刷新icon图标被点击了，那么就销毁展示内容的组件
    flag.value = false
    // nextTick函数中的代码会等到外一层中其他所有代码都执行完毕后才会执行
    nextTick(() => {
      flag.value = true // 这里先利用flag控制上面的component组件消失，再利用flag使它显示，从而达到刷新的视觉效果
    })
  },
)
</script>

<script lang="ts">
export default {
  // 下面这个注释是用来解决设置name属性为Main的报错的
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Main",
}
</script>

<style scoped lang="scss">
// 下面这三个样式是用来渲染跳转对应的路由组件的
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
