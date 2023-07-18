<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <!-- 下面是根据从setting仓库获取过来的数据LayoutSettingStore.fold给div动态的绑定了一个class属性fold，
         如果LayoutSettingStore.fold值为true，就给div添加一个fold类名，反之则不添加
    -->
    <div
      class="layout_side"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- el-scrollbar组件的作用是根据el-scrollbar里面的标签生成一个滚动条 -->
      <el-scrollbar class="scrollbar">
        <!-- el-menu用于展示菜单 -->
        <!-- active-text-color 用于设置菜单栏被激活后的文本颜色 -->
        <!-- default-active 的作用是页面加载时默认激活对应菜单的index，效果是当前页面展示了某个路由组件，然后侧边栏对应组件所在的下拉菜单就会呈现展开状态 -->
        <!-- collapse 的作用是使当前菜单组件折叠起来，也就是折叠到只显示icon图标，不显示菜单中的标题文字，这里是根据从setting仓库获取过来的数据LayoutSettingStore.fold来决定是否要让菜单折叠起来，
             如果值为true，说明要折叠
        -->
        <el-menu
          :collapse="LayoutSettingStore.fold ? true : false"
          :default-active="$route.path"
          background-color="#001529"
          text-color="white"
          active-text-color="skyblue"
        >
          <!-- 根据路由，动态的生成菜单 -->
          <!-- 将从store仓库中获取到的路由信息传递给Menu组件，这些路由信息是数组的形式 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航栏 -->
    <div
      class="layout_top"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <Top></Top>
    </div>
    <!-- 内容的主要展示区域 -->
    <div
      class="layout_main"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧菜单logo子组件
import Logo from "./logo/index.vue"
// 引入菜单组件
import Menu from "./menu/index.vue"
// 引入用户相关的小仓库
import useUserStore from "@/store/modules/user"
// 引入控制侧边菜单栏是否折叠的小仓库
import useLayoutSettingStore from "@/store/modules/setting"
// 引入点击右侧菜单栏展示对应的内容组件
import Main from "./main/index.vue"
// 引入顶部top组件
import Top from "./top/index.vue"
// 引入路由对象
import { useRoute } from "vue-router"

let userStore = useUserStore()
let LayoutSettingStore = useLayoutSettingStore()
// 获取路由对象
let $route = useRoute()
</script>
<script lang="ts">
export default {
  name: "Layout",
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
}
.layout_side {
  // 这里的 $base-menu-width 和 $base-menu-background 变量都是定义在variable.scss文件中的属性变量，这些变量可以在当前项目下的其他文件调用
  width: $base-menu-width;
  // vh是一种自适应视窗单位，它把当前可视窗口区域的高度分成100份，相当于 % ,当 % 在没有设置body高度的情况下是无法正确获得可视区域的高度的，而vh可以
  height: 100vh;
  background-color: $base-menu-background;
  transition: all 0.3s;
  .scrollbar {
    width: 100%;
    height: calc(100% - $base-menu-logo-height);
    .el-menu {
      border-right: none;
    }
  }
  &.fold {
    width: $base-menu-min-width;
  }
}
.layout_top {
  //固定定位
  position: fixed;
  top: 0;
  left: $base-menu-width;
  // 这里的calc的作用是计算，小括号里面的 100% - $base-menu-width 是一个数学计算(中间的空格不能丢失)，当前屏幕的100%的宽度减去定义的 $base-menu-width 宽度，如果没有 calc() ，那么这种写法就是错误的
  width: calc(100% - $base-menu-width);
  height: $base-top-height;
  transition: all 0.3s;
  &.fold {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;
  }
}
.layout_main {
  position: absolute;
  width: calc(100% - $base-menu-width);
  height: calc(100vh - $base-top-height);
  left: $base-menu-width;
  top: $base-top-height;
  padding: 20px;
  overflow: auto;
  transition: all 0.3s;
  &.fold {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;
  }
}
</style>
