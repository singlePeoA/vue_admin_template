// 这个文件统一管理项目用户相关的接口
import request from "@/utils/request"
// 引入有了真实数据库后写的对应的数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from "./type"

// 这下面是用mock模拟数据库的写法
// // 引入接口需要携带的参数的数据类型和接口返回的参数的数据类型
// import type { loginForm, loginResponseData, userResponseData } from "./type"
// // 统一管理接口
// enum API {
//   LOGIN_URL = "/user/login",
//   USERINFO_URL = "/user/info",
// }
// // 对外暴露请求函数
// // 登录的接口方法  因为这个接口在调用时需要携带参数账号和密码，所以需要定义一个参数data
// export const reqLogin = (data: loginForm) =>
//   request.post<any, loginResponseData>(API.LOGIN_URL, data)
// // 获取用户信息接口的方法
// export const reqUserInfo = () =>
//   request.get<any, userResponseData>(API.USERINFO_URL)

// 这下面是用真实数据库的写法
// 项目用户相关的请求地址
enum API {
  LOGIN_URL = "/admin/acl/index/login",
  USERINFO_URL = "/admin/acl/index/info",
  LOGOUT_URL = "/admin/acl/index/logout",
}
//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息的接口
export const reqUserInfo = () =>
  request.get<any, userInfoReponseData>(API.USERINFO_URL)
//退出登录的接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
