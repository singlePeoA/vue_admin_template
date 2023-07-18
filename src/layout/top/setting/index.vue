<template>
  <!-- 顶部栏右侧的静态 -->
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <!-- 
    placement 是设置这个组件出现的位置
    trigger 是当前这个组件的出现时机，这里是设置为鼠标悬浮于当前按钮上方的时候，组件显示
   -->
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <!-- el-color-picker 是取色器组件 -->
        <el-color-picker
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <!-- 
          active-icon 当当前switch状态切换按钮组件的状态为 on 的时候激活，这里是激活icon图标MoonNight
          inactive-icon 当当前switch状态切换按钮组件的状态为 off 的时候激活，这里是激活icon图标Sunny
         -->
        <el-switch
          @change="changeDark"
          v-model="dark"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <!-- circle是令icon图标变成圆形 -->
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
  />
  <!-- 下拉菜单，退出登录 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue"
// 引入路由器和路由对象
import { useRouter, useRoute } from "vue-router"
import useLayoutSettingStore from "@/store/modules/setting"
// 引入用户相关的小仓库
import useUserStore from "@/store/modules/user"
let userStore = useUserStore()
let LayoutSettingStore = useLayoutSettingStore()
// 获取路由器对象
let $router = useRouter()
// 获取路由对象
let $route = useRoute()
// 收集switch开关按钮组件的数据
let dark = ref<boolean>(false)

// 刷新icon图标的点击回调
const updateRefresh = () => {
  // 点击后将仓库中的数据refresh取反，用于证明已经点击了刷新icon图标
  LayoutSettingStore.refresh = !LayoutSettingStore.refresh
}

// 全屏icon图标的点击回调
const fullScreen = () => {
  // console.log(document.fullscreenElement) // document.fullscreenElement是DOM对象的一个属性，可以判断当前这个元素是否是全屏状态，如果不是就会返回一个null(false)，反之则返回true
  let full = document.fullscreenElement
  // 切换为全屏的模式
  if (!full) {
    // 如果当前不是全屏状态，那么点击了全屏icon图标后，就利用下面的方法，使得它变成全屏状态
    // 进入全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 如果当前是全屏状态，那么点击了全屏icon图标后，就利用下面的方法，使得它变成非全屏状态
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登录的点击回调
const logout = async () => {
  // 第一步：向服务器发送请求(告诉服务器本次登录的token值无效，下次登录后要重新发一个)
  // 第二步：清空仓库中所有与用户相关的数据，例如username、avatar
  await userStore.userLogout()
  // 第三步：跳转到登录页面
  $router.push({ path: "/login", query: { redirect: $route.path } }) // 这里利用query参数携带当前所在的页面的路由，这样当退出到登陆页面再点击登录后就会跳转到之前所在页面
}

//颜色组件组件的数据
const color = ref("rgba(255, 69, 0, 0.68)")
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
])

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement
  //判断HTML标签是否有类名dark
  dark.value ? (html.className = "dark") : (html.className = "")
}

//主题颜色的设置
const setColor = () => {
  //通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty("--el-color-primary", color.value)
}
</script>

<script lang="ts">
export default {
  name: "Setting",
}
</script>

<style scoped></style>
