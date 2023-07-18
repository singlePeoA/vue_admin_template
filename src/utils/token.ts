// 这个文件用于封装本地存储存储数据与读取数据的方法
export const SET_TOKEN = (token: string) => {
  // 这个是将token存入本地存储
  localStorage.setItem("TOKEN", token)
}

export const GET_TOKEN = () => {
  // 这个是从本地存储中读取token
  return localStorage.getItem("TOKEN")
}

// 删除本地存储数据的方法
export const REMOVE_TOKEN = () => {
  localStorage.removeItem("TOKEN") // 清除本地存储中的token
}
