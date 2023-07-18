<!-- 这个文件是三级分类的全局组件 这个组件在商品管理下的属性管理模块中被用到了 -->
<template>
  <el-card>
    <!-- inline 使得el-form中的元素变成行内式，在一行上显示 -->
    <el-form :inline="true">
      <!-- label 用于设置标题 -->
      <el-form-item label="一级分类">
        <!-- change 当下拉菜单选项选中了一个option值的时候就会触发的事件 -->
        <!-- disabled 决定当前组件是否禁用，下面是根据scene来决定是否禁用，如果scene -->
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handler"
        >
          <!-- el-option中的value即为el-select下拉菜单收集的数据，这里value的值为c1.id，那么上面el-select就是用所有el-option组件中的c1.id属性值来与categoryStore.c1Id进行了双向数据绑定，而c1Id的属性值就是所有 c1.id -->
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handler1"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
// 引入生命周期函数钩子
import { onMounted } from "vue"
// 引入三级分类全局组件相关的数据
import useCategoryStore from "@/store/modules/category"

let categoryStore = useCategoryStore()

onMounted(() => {
  // 组件挂载完毕就通知仓库获取一级分类的数据
  getC1()
})
// 通知属性管理模块的仓库获取一级分类的方法
const getC1 = () => {
  categoryStore.getC1()
}

// 这个函数一级分类下拉菜单el-select组件的change事件的回调
const handler = () => {
  // 一级分类下拉框选项选中或者发生变化的时候需要将以前的二级、三级分类的数据清空
  categoryStore.c2Id = ""
  categoryStore.c3Arr = []
  categoryStore.c3Id = ""
  // 通知仓库去获取二级分类的数据
  categoryStore.getC2()
}
// 这个函数二级分类下拉菜单el-select组件的change事件的回调
const handler1 = () => {
  // 一级分类下拉框选项选中或者发生变化的时候需要清空以前的三级分类的数据
  categoryStore.c3Id = ""
  // 通知仓库去获取二级分类的数据
  categoryStore.getC3()
}

// 接收父组件传递过来的数据
// 数据scene用于决定这里的三级分类下拉菜单是否禁用
defineProps(["scene"])
</script>

<style scoped></style>
