// 通过vue-router插件实现模板路由的配置
import { createRouter, createWebHashHistory } from "vue-router"
// 引入配置常量路由的文件，这个文件中装的是是具体的路由组件路线
import { constantRoute } from "./routes"
// 创建路由器
const router = createRouter({
  // 路由模式为hash
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
export default router
