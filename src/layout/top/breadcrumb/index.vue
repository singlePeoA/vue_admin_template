<template>
  <!-- 顶部栏左侧的静态 -->
  <!-- 这里是element-plus提供的一个icon图表 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <!-- 下面用了三元运算符，如果fold的值为true，那么下面这个component组件展示的就是Fold折叠组件，如果为false，那么展示的就是Expand展开组件 -->
    <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'" />
  </el-icon>
  <!-- 左侧面包屑图案，这里每一个 el-breadcrumb-item 都用separator设置的 ArrowRight 隔开 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 下面是根据$route.matched来遍历生成el-breadcrumb-item组件，$route.matched是当前路由组件的路由路径和它上层的路由路径， -->
    <!-- v-show="item.meta.title" 这段代码的意思是当当前遍历到的路由下的meta中的title的属性值为空的时候，就不展示这个组件路由对应的面包屑和标题
         这是因为 首页是一个二级路由，它的一级路由是layout，layout没必要展示，所以清空layout对应的meta中的title属性值，使得它不会展示在页面上
    -->
    <!-- 下面中的 :to="item.path" 作用是跳转指定路由目标，这是el-breadcrumb-item提供的to属性的作用，跟view-router中的to属性效果一样 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 面包屑展示当前匹配路由的icon图标 -->
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示当前匹配路由的标题 -->
      <span style="margin: 0px 2px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// 从setting仓库中获取数据，这个数据用于决定侧边菜单栏是否要折叠
import useLayoutSettingStore from "@/store/modules/setting"
// 引入路由对象
import { useRoute } from "vue-router"

let LayoutSettingStore = useLayoutSettingStore()
let $route = useRoute()
// 点击图标后的事件回调
const changeIcon = () => {
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
</script>

<style scoped></style>
