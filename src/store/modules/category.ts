// 这个仓库用于存储属性管理模块下三级分类下拉列表全局组件的数据

import { defineStore } from "pinia"
// 引入分类接口方法
import { reqC1, reqC2, reqC3 } from "@/api/product/attr"
// 引入数据类型
import type { CategoryResponseData } from "@/api/product/attr/type"
import type { CategoryState } from "./types/type"

const useCategoryStore = defineStore("Category", {
  state: (): CategoryState => {
    return {
      // 这个变量用于存储一级分类的数据
      c1Arr: [],
      // 这个变量用于收集一级分类下拉选项中不同选项的id值
      c1Id: "",
      //存储对应一级分类下二级分类的数据
      c2Arr: [],
      //收集二级分类的ID
      c2Id: "",
      //存储三级分类的数据
      c3Arr: [],
      //存储三级分类的ID
      c3Id: "",
    }
  },
  actions: {
    // 获取一级分类数据的方法
    async getC1() {
      const result: CategoryResponseData = await reqC1() // result 是调用接口后接口的返回值
      if (result.code == 200) {
        // 当code值为200的时候证明接口调用成功，接口调用成功后将返回的值的data数据赋值给c1Arr
        this.c1Arr = result.data
      }
    },
    //获取二级分类的数据
    async getC2() {
      //获取对应一级分类下的二级分类的数据
      const result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    //获取三级分类的数据
    async getC3() {
      //获取对应二级分类下的三级分类的数据
      const result: CategoryResponseData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
