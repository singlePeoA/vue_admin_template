// 这个文件是对axios进行二次封装
// 进行axios的二次封装，目的是使用请求与相应拦截器
import axios from "axios"
// 第一步：利用axios对象的create方法，去创建axios实例
// 这里有过报错(但不会影响运行)，只要把tsconfig.json和tsconfig.node.json中的moduleResolution属性值改成Node就可以了
import { ElMessage } from "element-plus"
// 引入用户相关的仓库
import useUserStore from "@/store/modules/user"
//创建axios实例
const request = axios.create({
  // 基础路径，这里是引入并且使用了开发环境文件中配置的变量
  baseURL: import.meta.env.VITE_APP_BASE_API, // 这里相当于以后所有的基础路径上都会携带/api，因为这里引入了 .env.development 文件中配置的变量 VITE_APP_BASE_API
  timeout: 5000, // 这个是发请求后超时的时间，意思就是发了一个请求，时间超过了5秒还没有请求结果，那么就视为请求失败
})
// 第二步：request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // 获取用户相关的小仓库，获取仓库内部的token，用于登录成功后携带给服务器
  const userStore = useUserStore()
  if (userStore.token) {
    // 如果能够获取到token，那么就将token传递给请求头headers
    config.headers.token = userStore.token
  }
  // 返回配置对象
  // config配置对象中有headers属性请求头，经常给服务器端携带公共参数
  return config
})
// 第三步：配置响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调
    //简化数据
    return response.data
  },
  (error) => {
    //失败回调:处理http网络错误的
    //定义一个变量:存储网络错误信息
    //处理网络错误
    let msg = ""
    //http状态码
    const status = error.response.status
    switch (status) {
      case 401:
        msg = "token过期"
        break
      case 403:
        msg = "无权访问"
        break
      case 404:
        msg = "请求地址错误"
        break
      case 500:
        msg = "服务器出现问题"
        break
      default:
        msg = "无网络"
    }
    //提示错误信息
    ElMessage({
      type: "error",
      message: msg,
    })
    return Promise.reject(error)
  },
)

// 对外暴露
export default request
