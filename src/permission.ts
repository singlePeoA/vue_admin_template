// 这个文件用来做路由鉴权的，项目当中的路由能否被访问的设置(也就是某个路由在什么前提条件下才能被访问)
import router from "./router"
// 引入nprogress插件，这个插件用于显示进度条
import nprogress from "nprogress"
// 引入进度体样式(这个样式文件在node_modules文件夹下面，可以通过修改该文件中的样式从而修改进度条的样式)，这个该插件自带的，是必须要引入的，不然不会有进度条效果
import "nprogress/nprogress.css"
nprogress.configure({ showSpinner: false }) // 添加了这个后，路由切换时左上角的加载时的转圈的小球就会消失
// 引入用户相关的小仓库，获取其中的token数据，用来判断用户是否登录
import useUserStore from "./store/modules/user"
// 在组件外部访问小仓库必须也得引入大仓库
import pinia from "./store"
// 引入setting文件 这个文件用于 项目|logo|标题 的配置
import setting from "./setting"
const userStore = useUserStore(pinia)
// console.log(userStore)

// 全局守卫：项目当中任意路由间切换时都会触发的钩子

// 全局前置守卫：访问某一个路由之前会触发的钩子
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}` // 修改标题
  // to：将要访问的路由
  // from：从那个路由而来
  // next：路由的放行函数，这个函数一执行，这个钩子里面的代码就会执行
  nprogress.start() // 这里代表进度条开始，写在前置路由守卫中，效果是访问某一个路由之前，进度条显示
  const token = userStore.token
  const username = userStore.username
  //   凭借这个token，来判断用户是否登录
  if (token) {
    // 用户登录成功
    if (to.path == "/login") {
      // 登录成功还想访问login路由地址，那么就重定向到 / 对应的路由地址
      next({ path: "/" })
    } else {
      // 如果访问其他地址
      if (username) {
        // 如果有用户信息就直接放行
        next()
      } else {
        // 如果没有用户信息，那么就在路由守卫处发请求来获取用户信息再放行
        try {
          // 获取用户信息并且获取成功
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期，获取不到用户信息
          // 或者用户手动修改了本地存储中的token
          // 退出登录 -> 清空与用户相关的数据
          await userStore.userLogout()
          next({ path: "/login", query: { redirect: to.path } }) // 退出到登录页面再登录后就会回到之前所在的页面
        }
      }
    }
  } else {
    // 用户未登录
    if (to.path == "/login") {
      // 如果用户访问的是login路由地址，那么就放行
      next()
    } else {
      // 如果用户访问的是其他路由地址，那么就将路由地址重新指向到login，不允许访问其他路由地址
      next({ path: "/login", query: { redirect: to.path } }) // 把用户访问却访问不了的路由地址赋值给query参数，等到下一次登陆成功后直接跳转到这次访问不了的路由地址
    }
  }
})
// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done() // 这里代表进度条消失，写在后置路由守卫中，效果是访问某一个路由之后，进度条消失
})

// 第一个问题：任意路由间切换，要显示进度条--------nprogress
// 第二个问题：路由鉴权(路由组件访问权限的设置)
// 用户未登录时可以访问login，其他路由都不能访问
// 用户登录成功后就不能访问login路由，其余的路由可以访问
