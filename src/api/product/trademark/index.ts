// 这个文件用于书写品牌管理模块的接口

import request from "@/utils/request"
// 引入数据类型
import type { TradeMarkResponseData, TradeMark } from "./type"
// 品牌管理模块的接口地址
enum API {
  // 获取已有品牌的接口
  TRADEMARK_URL = "/admin/product/baseTrademark/",
  // 添加品牌的接口
  ADDTRADEMARK_URL = "/admin/product/baseTrademark/save",
  // 修改已有品牌的接口
  UPDATETRADEMARK_URL = "/admin/product/baseTrademark/update",
  // 删除已有品牌的接口
  DELETE_URL = "/admin/product/baseTrademark/remove/",
}
// 获取已有品牌的接口方法
// page：获取第几页 ---默认第一页
// limit：获取几个已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`, // 原先定义的接口由于要根据情况而定，所以原先的接口至少开头不会改动的部分，这里添加了会改动的结尾的部分后才是一个完整的接口，这个后台的要求
  )
// 添加与修改已有品牌接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  // 调用接口的时候将数据传递过去，如果这个数据中有证明该品牌存在的id，那么就是要执行修改已有品牌的操作，反之，就是要执行添加该品牌的操作
  if (data.id) {
    // 修改已有品牌的数据
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除某一个已有品牌的数据
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
