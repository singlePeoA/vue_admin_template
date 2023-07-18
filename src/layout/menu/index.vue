<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- !item.children 意思如果当前的路由没有子路由，那么就正常展示 -->
    <template v-if="!item.children">
      <!-- 这里面再次根据当前遍历的路由的属性 item.meta.hidden 来判断当前这个路由是否要遍历显示到这个菜单中 -->
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRoute"
      >
        <el-icon>
          <!-- 根据当前遍历到的路由下的icon属性生成一个组件，这个icon属性是element-plus提供的icon图标组件的简写，这里的效果就是生成一个对应的图标 -->
          <component :is="item.meta.icon"></component>
        </el-icon>
        <!-- 给template标签加上了 #title 这是el-menu-item组件中插槽的一种写法 -->
        <template #title>
          <!-- 展示对应的路由源信息 -->
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 下面是当当前遍历的路由有子路由并且只有一个子路由的时候，就正常展示这个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 下面是当当前遍历的路由拥有多个子路由，就用折叠菜单的方式展示当前路由的子路由 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <!-- 当前是折叠下来菜单el-sub-menu组件，而折叠下拉菜单会显示有 #title 的template标签中的内容 -->
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
        <!-- 在当前Menu组件中再次调用Menu组件，并且将当前遍历到的路由的的子路由作为参数传递进去 -->
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
// 引入路由对象
import { useRouter } from "vue-router"

// 获取父组件传递进来的路由信息数组
defineProps(["menuList"])
// 引入并且获取路由器对象
let $router = useRouter()
// 点击菜单的事件回调
const goRoute = (vc: any) => {
  // console.log(vc.index) // 这里的vc是当前点击的组件的实例对象，vc.index是当前组件的唯一标识，也是将要用来进行跳转的路由路径
  // 路由跳转
  $router.push(vc.index)
}
</script>
<script lang="ts">
// 当前这个组件用到了递归组件(在当前组件中调用了自己这个组件)，那么这里就必须定义一个name名字
export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Menu",
}
</script>

<style scoped lang="scss"></style>
