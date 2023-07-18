// 这个小仓库存储的数据用于决定layout主页中侧边栏菜单是否要折叠
import { defineStore } from "pinia"

const useLayoutSettingStore = defineStore("SettingStore", {
  state: () => {
    return {
      fold: false, // 这个值用于决定侧边菜单栏是否要折叠
      refresh: false, //这个属性用于决定内容展示区域要不要刷新
    }
  },
})
export default useLayoutSettingStore
