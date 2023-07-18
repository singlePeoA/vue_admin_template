<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in attrArr"
          :key="item.id"
          :label="item.attrName"
          label-width="100px"
        >
          <el-select v-model="item.attrIdAndValueId">
            <!-- 这上面与 item.attrIdAndValueId 进行双向数据绑定的是下面下拉框选中的el-option中value的值 -->
            <el-option
              v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          :label="item.saleAttrName"
          v-for="(item, index) in saleArr"
          :key="item.id"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from "@/api/product/attr"
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from "@/api/product/spu"
import type { SkuData } from "@/api/product/spu/type"
import { ElMessage } from "element-plus"
import { ref, reactive } from "vue"

// 接收父组件定义的自定义事件
let $emit = defineEmits(["changeScene"])
//平台属性
let attrArr = ref<any>([])
//销售属性
let saleArr = ref<any>([])
//照片的数据
let imgArr = ref<any>([])
//获取table组件实例
let table = ref<any>()
//收集SKU的参数
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: "", //三级分类的ID
  spuId: "", //已有的SPU的ID
  tmId: "", //SPU品牌的ID
  //v-model收集
  skuName: "", //sku名字
  price: "", //sku价格
  weight: "", //sku重量
  skuDesc: "", //sku的描述

  skuAttrValueList: [
    //平台属性的收集
  ],
  skuSaleAttrValueList: [
    //销售属性
  ],
  skuDefaultImg: "", //sku图片地址
})

// 取消按钮的回调
const cancel = () => {
  $emit("changeScene", { flag: 0, params: "" }) // 调用自定义事件，并且传递一个参数对象，通知父组件切换场景
}

//当前子组件的方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  //获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  //获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  //获取照片墙的数据
  let result2: any = await reqSpuImageList(spu.id)
  //平台属性
  attrArr.value = result.data
  //销售属性
  saleArr.value = result1.data
  //照片数据
  imgArr.value = result2.data
}
//设置默认图片的方法回调
const handler = (row: any) => {
  //点击了当前按钮的时候,全部图片的的复选框不勾选
  imgArr.value.forEach((item: any) => {
    // toggleRowSelection 用于多选表格，切换某一行中多选按钮的选中状态，如果使用了第二个参数，则可以直接设置这一行多选按钮的选中与否
    table.value.toggleRowSelection(item, false)
  })
  //选中的图片才勾选
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}
// 保存按钮的回调
const save = async () => {
  //整理参数
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    // prev 代表的是上一次调用reduce数组方法的返回值，如果是第一次调用，且没有给prev设置初始值，那么它就是空
    // next 代表的是遍历循环中，当前的值
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(":")
      // 由于设置了prev的初始值为 [] ,一个数组，所以这里可以用数组方法
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev // 把最新的prev返回，最为下一次调用这个reduce方法的prev值
  }, []) // 这里的 [] 是给prev设置的初始值，设置prev为一个数组

  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(":")
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  // 调用添加SKU的接口，将指定的参数数据添加的后台数据库
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "添加SKU成功",
    })
    //通知父组件切换场景为零
    $emit("changeScene", { flag: 0, params: "" })
  } else {
    ElMessage({
      type: "error",
      message: "添加SKU失败",
    })
  }
}

// 对外暴露方法
defineExpose({
  initSkuData,
})
</script>

<style scoped lang="scss"></style>
