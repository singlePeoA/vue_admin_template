<template>
  <div>
    <!-- 三级分类组件 -->
    <category :scene="scene"></category>
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <!-- 展示已有的SPU数据 -->
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序号"
            align="center"
            width="80px"
            type="index"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <!-- show-overflow-tooltip 的作用是当单元格中的内容过于长的时候，用省略号代替多出的那一部分 -->
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <!-- row 为当前这一行的spu数据，$index为当前这一行数据对象在总数据数组records中所对应的下标 -->
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <!-- confirm 气泡弹出框中的确认按钮被点击后会触发的事件 -->
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <!-- 
        current-change 是一个事件，当当前分页的页码发生变化的时候会触发
        size-change 是一个事件，当当前分页器的每一页能放置的数据条数设置发生改变的时候触发
       -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加|修改SPU的功能组件 -->
      <!-- 两个组件中的 @changeScene事件 是自定义事件 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 修改SKU的功能组件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- dialog对话框:展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue"
import { ElMessage } from "element-plus"
// 引入接口方法
import { reqHasSpu, reqSkuList, reqRemoveSpu } from "@/api/product/spu"
// 引入spu模块需要的ts数据类型
import type {
  HasSpuResponseData,
  Records,
  SkuInfoData,
  SkuData,
  SpuData,
} from "@/api/product/spu/type"
// 引入三级分类组件对应的小仓库
import useCategoryStore from "@/store/modules/category"
// 引入SpuForm组件
import SpuForm from "./spuForm.vue"
// 引入SkuForm组件
import SkuForm from "./skuForm.vue"

let categoryStore = useCategoryStore()
// 定义一个场景数值，这个数值可以控制三级分类下拉菜单，这个是在Category组件中的设置，当scene的值为0的时候不禁用，不为0的时候禁用
let scene = ref<number>(0) // 当这个值为 0 那么显示已有的SPU数据    为1 显示添加或修改已有SPU数据的组件    为2 显示添加SKU数据的组件结构
// 分页器默认页码
let pageNo = ref<number>(1)
// 分页器中每一页展示多少条数据
let pageSize = ref<number>(3)
// 存储已有的SPU的数据
let records = ref<Records>([])
// 存储已有SPU的总个数
let total = ref<number>(0)
// 获取子组件实例SpuForm
let spu = ref<any>()
// 获取子组件实例SkuForm
let sku = ref<any>()
// 存储全部的SKU数据
let skuArr = ref<SkuData[]>([])
// 定义一个数据用于决定点击 查看SKU列表 按钮后，弹出的对话框的显示与隐藏
let show = ref<boolean>(false)

// 监视第三级分类ID值的变化
watch(
  () => categoryStore.c3Id,
  () => {
    if (categoryStore.c3Id) {
      getHasSpu() // 当第三级分类的ID值发生变化的时候触发这个函数，也就是第三个下拉菜单选中或更改选项的时候触发这个函数
    }
  },
)
// 此方法执行可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  // 这个函数被调用的时候如果不传入一个参数，那么pager就默认为1，就将当前的页码设置为1，如果传递进来了参数，那么当前页码就为传递进来的哪个参数数值
  //修改当前页码
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 当前分页器的每一页能放置的数据条数设置发生改变的时候触发
const changeSize = () => {
  getHasSpu() // 重新获取已有的spu数据
}
//添加新的SPU按钮的回调
const addSpu = () => {
  // 通过修改scene的值来切换至场景 1 显示添加与修改已有SPU组件结构->SpuForm
  scene.value = 1
  //点击添加SPU按钮，通过子组件的实例，调用子组件的定义的方法，用于初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}
// 这个函数是给子组件spuForm绑定的事件的回调函数：目的是为了让子组件通知当前这个组件将scene的值修改为0 从而切换场景
const changeScene = (obj: any) => {
  //子组件Spuform点击取消变为场景0:展示已有的SPU
  scene.value = obj.flag
  if (obj.params == "update") {
    //执行的是更新操作，那么就留在当前页
    getHasSpu(pageNo.value)
  } else {
    // 如果执行的是添加操作，那么就留在第一页
    getHasSpu()
  }
}
// 修改已有的SPU的按钮的回调
const updateSpu = (row: SpuData) => {
  // 切换为场景1  显示添加与修改已有SPU结构的功能组件->SpuForm
  scene.value = 1
  console.log(row)
  // 调用子组件实例方法来获取完整已有的SPU的数据，并且把当前点击按钮所在的那一行的数据row作为参数传递给子组件
  spu.value.initHasSpuData(row)
}

//添加SKU按钮的回调
const addSku = (row: SpuData) => {
  //点击添加SKU按钮切换场景为2
  scene.value = 2
  //调用子组件对外暴露的方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
//查看SKU列表的数据
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    //对话框显示出来
    show.value = true
  }
}
//删除已有的SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    })
    //获取剩余SPU数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    })
  }
}
//路由组件销毁前，情况仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
