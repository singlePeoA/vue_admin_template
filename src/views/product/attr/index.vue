<template>
  <div>
    <!-- 全局组件Category 三级分类 在copmponents文件夹下 -->
    <!-- 这里将scene变量作为参数传递给Category子组件，子组件根据scene来决定是否要禁用三级分类下拉菜单 -->
    <Category :scene="scene" />

    <el-card style="margin: 10px 0px">
      <!-- 如果变量scene的值为0，那么就展示下面这个div -->
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
        >
          <!-- disabled 的作用是禁用当前按钮组件，值为布尔类型，上面加了一个三元运算符，如果categoryStore.c3Id存在，那么就不禁用当前按钮组件，反之则禁用，如果categoryStore.c3Id存在则代表三个下拉菜单都选中了选项，可以进行添加属性的操作，所有这里就不要禁用了 -->
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row: 即为当前属性值对象 -->
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- row: 即为当前属性值对象 -->
            <!-- 下面是编辑修改已有属性的按钮 -->
            <template #="{ row, index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`你确定删除${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 如果变量scene的值为1，那么就展示下面这个div -->
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
        >
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <!-- 
          border 是添加表格每一列的左右的边框
          data el-table会根据data绑定的数据的长度而生成table下表格的行数
         -->
        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row: 即为当前这一行的属性值对象 -->
            <!-- $index 是当前这一行数据的下标值，如果这一行在表格中是第一行，那么$index就是0 -->
            <template #="{ row, $index }">
              <!-- row中有一个flag属性，它决定编辑模式和查看模式之间的转换 -->
              <!-- :ref 是vue3的一种写法，它相当于给el-input组件注册了一个事件，这个事件是当前el-input组件或者组件中的内容发生改变的时候就会触发，同时这个事件可以获取到当前这个组件的实例对象 -->
              <!-- (vc: any) => inputArr[$index] = vc   就是ref事件的回调箭头函数，参数vc是当前这个组件的实力对象，这个函数被调用的时候将当前这个el-input组件实例对象按照对应的下标存储进数组变量inputArr中 -->
              <el-input
                :ref="(vc: any) => inputArr[$index] = vc"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice(index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from "vue"
// 引入获取已有属性和属性值的接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from "@/api/product/attr"
// 引入ts数据类型
import type { AttrResponseData, Attr, AttrValue } from "@/api/product/attr/type"
// 引入三级分类组件相关的小仓库
import useCategoryStore from "@/store/modules/category"
// 引入element-plus组件库
import { ElMessage } from "element-plus"

let categoryStore = useCategoryStore()
// 定义一个变量存储已有的属性和属性值
let attrArr = ref<Attr[]>([])
// 定义一个变量来决定el-card卡片组件中展示的内容的切换
let scene = ref<number>(0) // 如果值为0，那么就展示el-table表格组件，如果不是0，那么就展示添加与修改属性的组件结构
// 定义一个变量来收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: "", // 新增的属性的名字
  attrValueList: [
    // 新增的属性值数组
  ],
  categoryId: "", // 三级分类的ID，对应三级分类下拉菜单下的某一个选项
  categoryLevel: 3, // 代表的是三级分类
})
//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([])

// 监听仓库三级分类ID的变化，当三级分类组件中第三级下拉菜单选中获取更改选项的时候就会触发这个事件监听
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类id存在才能发请求
    if (!categoryStore.c3Id) return
    // 获取分类的ID
    getAttr()
  },
)
//获取已有的属性与属性值方法
const getAttr = async () => {
  // 这里运用了解构赋值
  const { c1Id, c2Id, c3Id } = categoryStore
  //获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 添加属性按钮的回调
const addAttr = () => {
  //每一次点击的时候,先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: "", //新增的属性的名字
    attrValueList: [
      //新增的属性值数组
    ],
    categoryId: categoryStore.c3Id, //三级分类的ID
    categoryLevel: 3, //代表的是三级分类
  })
  // 通过修改scene的值来将当前组件el-table切换至修改属性和属性值的组件
  scene.value = 1
  // 收集当前的第三级分类下拉菜单所选中的选项的id
  attrParams.categoryId = categoryStore.c3Id
}
// 点击删除属性按钮弹出的气泡确认框中的确认按钮的回调
const deleteAttr = async (attrId: number) => {
  // 这里的attrId参数接收到是上面按钮传递进来的按钮所在的那一行的数据中的id值，要根据这个id值找到这个属性，再调用接口删除它
  //发相应的删除已有的属性的请求
  let result: any = await reqRemoveAttr(attrId)
  //删除成功
  if (result.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    })
    //获取一次已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    })
  }
}
// el-table组件下修改已有属性的按钮的回调
const updateAttr = (row) => {
  scene.value = 1
  //将已有的属性对象赋值给attrParams对象
  //ES6->Object.assign进行对象的合并，这种语法是一种浅拷贝，进行合并的两个对象会相互影响，如果其中一个对象发生了改变，另外一个对象也会发生改变，所有这里就要用到JSON语法，它可以让浅拷贝变成深拷贝，这样进行合并的两个对象就不会相互影响了
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 修改属性和属性值的功能组件下的取消按钮的事件回调
const cancel = () => {
  // 点击后通过修改scene的值将修改属性和属性值的功能组件切换回原先的el-table组件
  scene.value = 0
}
// 修改属性和属性值的功能组件下的添加属性值按钮的事件回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候,向attrValueList属性值数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: "",
    flag: true, // 控制每一个属性值编辑模式与切换模式的切换
  })
  //获取表格中最后一个el-input组件实例，使它聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 修改属性和属性值的功能组件下的保存按钮的事件回调
const save = async () => {
  //发请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  //添加属性|修改已有的属性已经成功
  if (result.code == 200) {
    // 切换回原先的el-table组件
    scene.value = 0
    // 提示信息
    ElMessage({
      type: "success",
      message: attrParams.id ? "修改成功" : "添加成功",
    })
    // 获取全部已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: "error",
      message: attrParams.id ? "修改失败" : "添加失败",
    })
  }
}

// 属性值表单元素失去焦点的事件回调，这里的参数row是事件调用者传递进来的它所在的表格的那一行的所有数据
// $index 是下标，是事件调用者所在的那一行数据在 attrValueList 数据数组中的下标
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况的判断
  // 修改后的属性值不能为空
  if (row.valueName.trim() == "") {
    //删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: "error",
      message: "属性值不能为空",
    })
    return
  }
  //非法情况2
  // 不能出现相同的属性值
  let repeat = attrParams.attrValueList.find((item) => {
    // 切记把当前失去焦点属性值对象从当前数组扣除，否则会影响这里的判断，因为这里是判断数组中有没有出现一个和当前元素一模一样的元素，如果不把自己去除，那么就会在数组中找到自己，从而错误判断数组中有和当前自己一模一样的元素
    if (item != row) {
      return item.valueName === row.valueName
    }
  })

  // 如果用重复的属性值
  if (repeat) {
    // 将重复的属性值从数组当中去除掉
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: "error",
      message: "属性值不能重复",
    })
    return
  }
  row.flag = false // 切换至查看模式，input标签隐藏，展示div标签
}
// 属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true // 切换至编辑模式，div标签隐藏，展示input标签
  // 切换至编辑模式后，同时使得对应的el-input标签聚焦
  // 这里使用nextTick是为了等响应式数据发生变化后，DOM更新完毕在执行里面的代码
  // 如果这里不使用nextTick，执行完上面代码，DOM还没更新完毕，el-input组件还没显示出来，就执行下面代码让el-input组件聚焦，是不会有效果的
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 当前路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  // 清空三级分类组件相关的仓库的数据  $reset 可以重置仓库的数据
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
