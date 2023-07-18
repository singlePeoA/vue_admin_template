<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <BreadCrumb />
    </div>
    <div class="tabbar_right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入顶部栏左边的区域
import BreadCrumb from "./breadcrumb/index.vue"
// 引入顶部栏右边的区域
import Setting from "./setting/index.vue"
</script>
<script lang="ts">
export default {
  name: "Top",
}
</script>
<style scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.tabbar_left {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.tabbar_right {
  display: flex;
  align-items: center;
}
</style>
