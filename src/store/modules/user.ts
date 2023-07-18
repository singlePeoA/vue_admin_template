// 创建用户相关的小仓库
import { defineStore } from "pinia"
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user"
// 引入有了真实数据库后写的对应的数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from "@/api/user/type"

// 这下面一行是用mock模拟数据库的引入数据类型，使用了真数据库的时候就用不上下面这一行了
// import type { loginForm, loginResponseData } from "@/api/user/type"

// 引入给小仓库中数据定义的数据类型
import type { Userstate } from "./types/type"
// 引入操作本地存储的方法的文件
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token"
// 引入路由(常量路由)
import { constantRoute } from "@/router/routes"

// 创建用户小仓库
const useUserStore = defineStore("User", {
  // 小仓库中存储数据的地方
  state: (): Userstate => {
    // 上面给当前箭头函数的返回值定义了数据类型为Userstate
    return {
      // 下面是运用了引入的操作本地存储文件中定义的方法，这个方法用于获取本地存储中的token值
      token: GET_TOKEN(), // token是用户的唯一标识，身份令牌，这里是从本地存储中获取token值
      menuRoutes: constantRoute, // 仓库存储生成layout主页侧边栏菜单所需要的数组(根据路由生成菜单)
      username: "",
      avatar: "",
    }
  },
  // 处理异步逻辑的地方s
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      // loginForm是一种数据类型，上面是限制参数data的数据类型
      const result: loginResponseData = await reqLogin(data) // reqLogin接口需要传递相应的参数进去，这个是该接口自身的设置
      //   console.log(result)
      // 登录请求：成功的话就会返回code，值为200，并且返回token(token是身份令牌)
      // 登录请求：失败后就会返回code，值为201，并且返回失败的错误信息
      if (result.code == 200) {
        // 登录成功，将返回的token值存储下来，由于pinia|vuex存储数据其实利用的是js对象，它们存储的数据并非持久化的，所以这里还要利用本地存储来存储数据
        this.token = result.data as string //这里运用了断言，作用是明确告诉ts这个result.data.token的数据类型为是string，避免这里报错
        SET_TOKEN(result.data as string) // 调用操作本地存储的文件中定义的方法，将token存入本地存储
        // console.log(this.token)
        // 返回一个 ok 是为了保证当前async函数返回一个成功的Promise
        return "ok"
      } else {
        // 登录失败 失败后返回失败提示信息
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户的信息并且存储在仓库当中
      const result: userInfoReponseData = await reqUserInfo()
      // 如果获取用户信息成功，那么就把用户信息存储起来
      if (result.code == 200) {
        this.username = result.data.name //用户姓名
        this.avatar = result.data.avatar //用户头像
        return "ok"
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录的方法
    async userLogout() {
      const result: any = await reqLogout() // 退出登录的接口
      // 登录登录请求
      if (result.code == 200) {
        // 退出登录成功
        // 清空与用户信息相关的数据
        this.token = ""
        this.username = ""
        this.avatar = ""
        REMOVE_TOKEN() // 这个方法是用于删除本地存储中的TOKEN数据的
        return "ok"
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
export default useUserStore
