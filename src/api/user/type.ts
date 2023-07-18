// 这下面是用mock模拟数据库的写法
// // 登录接口需要携带的参数的ts类型
// export interface loginForm {
//   // 这里是定义username和password这两个参数的数据类型为string
//   username: string
//   password: string
// }

// interface dataType {
//   // ?: 是指可选参数，可以理解为参数自动加上undefined
//   // 当token和message属性没有属性值的时候，自动定义为undefined
//   token?: string
//   message?: string
// }

// // 登录接口返回的数据的类型
// export interface loginResponseData {
//   code: number
//   data: dataType
// }

// // 定义服务器返回用户信息相关的数据类型
// interface userInfo {
//   userId: number
//   avatar: string
//   username: string
//   password: string
//   desc: string
//   roles: string[]
//   buttons: string[]
//   routes: string[]
//   token: string
// }
// interface user {
//   checkUser: userInfo
// }
// export interface userResponseData {
//   code: number
//   data: user
// }

// 这下面是用真实数据库的写法
//定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string
  password: string
}

//定义全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//定义登录接口返回数据类型
export interface loginResponseData extends ResponseData {
  data: string
}

//定义获取用户信息返回数据类型
export interface userInfoReponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
