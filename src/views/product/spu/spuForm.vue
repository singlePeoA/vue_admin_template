<template>
  <!-- label-width 用于设置标签的长度，这个长度会被当前这个el-Form组件的所有子组件el-form-item的label标签所继承 -->
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="(item, index) in AllTradesMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        palceholder="请输入SPU的描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- 
        v-model:fileList -> 展示默认图片(可以fileList可以是个数组，它可以展示多个图片) 
        action: 上传图片的接口地址
        list-type: 文件列表的类型
        on-preview 照片点击预览时触发的事件
        on-remove 照片被删除前会触发的事件
        before-upload 照片被更新时回会触发的事件
        before-upload 照片上传成功之前会触发的事件，可以用来限制文件的类型
      -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 这个下拉菜单用于展示还未选择的销售属性 -->
      <el-select
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
        v-model="saleAttrIdAndValueName"
      >
        <!-- 下面el-option中的 :value 是将还未选择的销售属性的id和名字收集起来，id和名字中间有个符号: ，这是便于后面将id和名字拆分出来，上面el-select中的v-model是将收集起来的数据与saleAttrIdAndValueName进行双向数据绑定 -->
        <el-option
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disabled="saleAttrIdAndValueName ? false : true"
        @click="addSaleAttr"
        style="margin-left: 10px"
      >
        添加属性
      </el-button>
      <!-- 这里的table用于展示销售属性和属性值 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          align="center"
          width="80px"
          type="index"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row: 即为当前SPU已有的销售属性对象 -->
          <!-- close 是当el-tag标签组件被删除之前会触发的事件 -->
          <template #="{ row, $index }">
            <el-tag
              style="margin: 0px 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              class="mx-1"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="saleAttr.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// 引入spu模块需要的ts数据类型
import type { SpuData } from "@/api/product/spu/type"
// 引入获取完整的spu数据的接口
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from "@/api/product/spu"
// 引入上面接口调用后返回的数据的ts类型
import type {
  SaleAttrValue,
  HasSaleAttr,
  SaleAttr,
  SpuImg,
  Trademark,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from "@/api/product/spu/type"
import { ref, computed } from "vue"
import { ElMessage } from "element-plus"

let $emit = defineEmits(["changeScene"])
//存储已有的SPU这些数据
let AllTradesMark = ref<Trademark[]>([])
//商品图片
let imgList = ref<SpuImg[]>([])
//已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: "", //收集三级分类的ID
  spuName: "", //SPU的名字
  description: "", //SPU的描述
  tmId: "", //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//存储预览图片地址
let dialogImageUrl = ref<string>("")
//这个变量用于收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>("")

// 点击取消按钮触发父组件给当前组件绑定的自定义事件changeScene，通知父组件切换场景值scene为0，展示已有的SPU数据
const cancel = () => {
  $emit("changeScene", { flag: 0, params: "update" }) // 触发自定义事件changeScene，并且将一共对象参数传递给父组件
  // flag为0是让父组件切换场景，params: "update" 是为了告诉父组件执行的是更新的操作，那么就让页面留在当前页
}
// 子组件书写一个方法，这个方法经过 defineExpose 对外暴露后，父组件就可以拿到这个方法了
// 这里的参数spu接收的是父组件传递进来的已有的不完整的spu数据
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象,将来在模板中展示
  SpuParams.value = spu
  // spu:即为父组件传递过来的已有的SPU对象[不完整]
  // 获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  // 根据品牌id获取它旗下全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 获取已有的SPU销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取整个项目全部SPU的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储全部品牌的数据
  AllTradesMark.value = result.data
  // SPU对应商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  //存储已有的SPU的销售属性
  saleAttr.value = result2.data
  //存储全部的销售属性
  allSaleAttr.value = result3.data
}
//照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  //对话框弹出来
  dialogVisible.value = true
}
//照片墙删除文件钩子
const handleRemove = () => {
  console.log(123)
}
//照片钱上传成功之前的钩子，可以用来约束文件的大小与类型
const handlerUpload = (file: any) => {
  if (
    file.type == "image/png" ||
    file.type == "image/jpeg" ||
    file.type == "image/gif"
  ) {
    if (file.size / 1024 / 1024 < 5) {
      return true
    } else {
      ElMessage({
        type: "error",
        message: "上传文件务必小于5M",
      })
      return false
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件务必PNG|JPG|GIF",
    })
    return false
  }
}
//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //全部销售属性: 颜色、版本、尺码
  //已有的销售属性: 颜色、版本
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
//添加销售属性的方法
const addSaleAttr = () => {
  /*
    必须有下面这三个字段
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList
    */

  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(":")
  //准备一个新的销售属性对象:将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  //将这个新增的对象追加到数组当中，表格会根据这个数组，把新增的对象遍历到表格中
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAttrIdAndValueName.value = ""
}
//属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  //点击按钮的时候，input组件显示 -> 切换到编辑模式
  row.flag = true
  row.saleAttrValue = ""
}
//表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  //整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  //整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  //非法情况判断
  if ((saleAttrValue as string).trim() == "") {
    ElMessage({
      type: "error",
      message: "属性值不能为空的",
    })
    return
  }
  //判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })

  if (repeat) {
    ElMessage({
      type: "error",
      message: "属性值重复",
    })
    return
  }
  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换为查看模式
  row.flag = false
}
//保存按钮的回调
const save = async () => {
  //整理收集到的数据参数
  //发请求:添加SPU|更新已有的SPU
  //成功
  //失败

  //1:照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, //图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  //2:整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: SpuParams.value.id ? "更新成功" : "添加成功",
    })
    //通知父组件切换场景为0
    $emit("changeScene", {
      flag: 0,
      params: SpuParams.value.id ? "update" : "add",
    })
  } else {
    ElMessage({
      type: "success",
      message: SpuParams.value.id ? "更新成功" : "添加成功",
    })
  }
}
//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //清空上一次点击后跳转到页面后留下的数据
  Object.assign(SpuParams.value, {
    category3Id: "", //收集三级分类的ID
    spuName: "", //SPU的名字
    description: "", //SPU的描述
    tmId: "", //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  //存储三级分类的ID
  SpuParams.value.category3Id = c3Id
  //获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  //存储数据
  AllTradesMark.value = result.data
  allSaleAttr.value = result1.data
}

// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped lang="scss"></style>
