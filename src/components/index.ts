// 这个文件是可以指定的组件变成全局组件并且对外暴露
//引入项目中全部的全局组件
import SvgIcon from "./SvgIcon/index.vue"
import Pagination from "./Pagination/index.vue"
import Category from "./Category/index.vue"
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
//全局对象
const allGloablComponent: any = { SvgIcon, Pagination, Category }
//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: any) {
    //注册项目全部的全局组件  Object.keys方法的作用是获取指定对象中的所有key键，并且存入到一个数组中
    Object.keys(allGloablComponent).forEach((key) => {
      // 这里是利用forEach将数组中的所有key键遍历出来，再进行全局组件注册
      //注册为全局组件
      app.component(key, allGloablComponent[key])
    })
    //将element-plus提供图标注册为全局组件
    console.log(Object.entries(ElementPlusIconsVue)) // 这里输出的是element-plus提供的图标组件和对应的组件实例对象
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      // 运用解构赋值将图表组件和对应的组件实例对象解构出来，再把它们注册成全局组件，然后再当前项目下的任何地方都能使用这些图标全局组件
      app.component(key, component)
    }
  },
}
