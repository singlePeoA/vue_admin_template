<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
// 引入设置项目标题与logo的配置文件，将标题和logo单独写在setting文件中是为了便于其他使用者更加便捷的修改项目标题和logo图片
import setting from "@/setting"
</script>
<script lang="ts">
export default {
  name: "Logo",
}
</script>
<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: $base-menu-title-fontSize;
    margin-left: 10px;
  }
}
</style>
