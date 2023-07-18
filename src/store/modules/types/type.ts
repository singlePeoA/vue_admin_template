import type { RouteRecordRaw } from "vue-router"
// 引入属性管理模块三级分类全局组件要用到的ts数据类型
import type { CategoryObj } from "@/api/product/attr/type"

// 这里用于定义小仓库中state的数据类型
export interface Userstate {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

//定义属性管理模块下三级分类全局组件的仓库中state对象的ts类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c2Id: string | number
  c3Arr: CategoryObj[]
  c3Id: string | number
}
