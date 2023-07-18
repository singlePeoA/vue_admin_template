// 这个文件用于定于属性管理模块会用到的数据类型

//分类相关的数据ts类型
export interface ResponseData {
  code: number // 状态码
  message: string //提示信息
  ok: boolean
}

//分类ts类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number // 这里是如果属性对象中有 category1Id或category2Id这个属性，那它们的属性值的类型就得是number
  category2Id?: number
}

//相应的分类接口返回数据的类型(一级分类下的选项的数据数据就是二级分类的选项，二级分类下的选项的数据就是三级分类的选项，这里定义的是选项的数据的数据类型)
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

//属性与属性值的ts类型

//属性对象的ts类型
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}
//属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
//存储每一个属性的属性值的数组类型
export type AttrValueList = AttrValue[]

//存储每一个属性对象的数组ts类型
export type AttrList = Attr[]
//属性接口返回的ts数据类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
