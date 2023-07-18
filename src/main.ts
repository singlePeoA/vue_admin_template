import { createApp } from "vue"
import App from "@/App.vue"
// 引入element-plus插件与它提供的样式
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
// 配置element-plus的国际化
// 忽略当前文件ts类型的检测否则有红色提示(打包会失败)
//@ts-expect-error忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from "element-plus/dist/locale/zh-cn.mjs" // zh-cn.mjs意为着采用中文
// svg插件需要的配置代码
import "virtual:svg-icons-register"
// 引入模板的全局样式
import "@/styles/index.scss"
// 引入自定义插件对象，这个是用来注册整个项目中的全局组件
import globalComponent from "@/components"
// 引入路由
import router from "./router"
// 引入仓库
// 一般来说这里会报错，是因为pinia版本适配的问题，只要执行 pnpm i pinia@2.0.34 命令就可以了
import pinia from "./store"
// 引入路由鉴权文件
import "./permission.ts"
//暗黑模式需要的样式
import "element-plus/theme-chalk/dark/css-vars.css"

// 获取应用实例对象
const app = createApp(App)
// 安装element-plus插件
app.use(ElementPlus, {
  // element-plus默认语言是英文，配置了这个后，可以把语言改成中文
  locale: zhCn, // element-plus国际化的配置
})
// console.log(import.meta.env)
// 安装自定义插件
app.use(globalComponent)
// 注册模板路由
app.use(router)
// 安装仓库
app.use(pinia)
// 将应用挂载到挂载点上
app.mount("#app")
