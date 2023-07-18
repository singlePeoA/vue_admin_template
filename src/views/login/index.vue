<template>
  <div class="login_container">
    <el-row>
      <!-- :span是占位，两个el-col组件都设置为12，意为着这两个组件的宽度在页面上各占50%，后面的 :xs 的作用是当当前浏览器屏幕宽度小于等于768的时候，修改两个el-col的占位 -->
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- :rules 是给当前表单组件绑定校验规则 -->
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到九江职业技术学院</h2>
          <!-- prop的作用是将prop的属性值作为需要进行校验的元素 -->
          <el-form-item prop="username">
            <!-- prefix-icon 的作用是在输入框的前面插入icon图片 -->
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <!-- show-password的作用是切换input输入框的type类型，text和password之间切换，效果就是密码框中有一个小眼睛，操作密码是否隐藏 -->
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!-- loading的作用是在button按钮中显示一个正在转的圆圈，意为着正在加载，当loading的值为true时，显示正在加载，反之则不显示 -->
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue" // 引入element-plus组件中的icon图像
import { reactive, ref } from "vue"
// 引入用户相关的小仓库
import useUserStore from "@/store/modules/user"
// 引入路由
import { useRouter, useRoute } from "vue-router"
// 引入element-plus组件库中的组件张，这个组件负责弹出提示信息
import { ElNotification } from "element-plus"
// 引入获取当前时间的函数
import { getTime } from "@/utils/time"

// 通过ref标识来获取el-form组件
let loginForms = ref()
// 获取路由器
let $router = useRouter()
// 获取路由对象
let $route = useRoute()
let useStore = useUserStore()
// 定义变量控制按钮加载中效果，默认为不加载
let loading = ref(false)
// 收集表单中账号与密码的数据
let loginForm = reactive({ username: "admin", password: "atguigu123" })
// 登录按钮的回调函数
const login = async () => {
  // 通知仓库发登录请求
  // 请求成功 -> 首页展示数据的地方
  // 请求失败 -> 弹出登录失败信息

  // 下面这行代码能够保证表单校验通过才发请求
  await loginForms.value.validate() // el-form组件中有validate属性，这个属性会返回一个Promise对象，当当前表单组件校验不通过的时候，这个Promise对象的状态就为false，反之则为true，这里就是当前校验不通过的时候，不继续执行下面的代码
  // 下面这个变量控制加载效果
  loading.value = true
  try {
    // 如果登录成功就会执行try里面的代码
    await useStore.userLogin(loginForm) // 登录成功后调用pinia仓库中定义的userLogin方法，并且将loginForm作为参数传递进去
    // 判断登录的时候路由路径中是否携带query参数(这里的query参数一般是用户退出登录回到当前登陆页面传递的)，如果有，就往query参数对应的路由路径跳转，如果没有，就往首页的路由路径跳转
    let redirect: any = $route.query.redirect
    // 编程式导航跳转路由，跳转到首页
    $router.push({ path: redirect || "/" }) // 如果redirect存在，就往redirect对应的路由路径跳转，如果没有，就往 / 跳转
    // 登录成功后的提示信息
    ElNotification({
      type: "success",
      message: "欢迎回来",
      title: `HI,${getTime()}好！`,
    })
    // 登录成功后加载效果消失
    loading.value = false
  } catch (error) {
    // 登录失败后加载效果消失
    loading.value = false
    // 如果登录失败就会执行catch里面的代码
    // 登录失败后的提示信息
    ElNotification({
      type: "error",
      message: (error as Error).message,
    })
  }
}
// 自定义校验规则函数
// 第一个参数rule就是校验对象   第二个参数value就是表单元素文本内容(也就是需要校验的字段)   第三个参数callback就是校验通过后才执行的回调函数，如果校验未通过那么就在callback函数中注入错误信息
const validatorUserName = (rule: any, value: any, callback: any) => {
  console.log(rule)
  if (value.length >= 5) {
    callback() // 校验通过就直接调用callback方法，表示校验通过
  } else {
    callback(new Error("账号长度至少为5")) // 校验结果失败就调用callback，并且将报错信息作为参数传递进去
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  console.log(rule)
  if (value.length >= 6) {
    callback() // 校验通过就直接调用callback方法，表示校验通过
  } else {
    callback(new Error("账号长度至少为6")) // 校验结果失败就调用callback，并且将报错信息作为参数传递进去
  }
}
// 定义表单校验需要的配置对象
const rules = {
  // 下面校验规则中，required是设置当前字段是必须要经过校验的，message是校验错误后的提示信息，trigger校验的触发时机
  username: [
    /* {
      required: true,
      min: 5, // min代表是校验字段的长度最少位数
      max: 10, // max代表是校验字段的长度最多位数
      message: "账号长度要在5到10位之间",
      trigger: "change",
    }, */
    {
      trigger: "change",
      validator: validatorUserName, // 这行代码是设置自定义校验规则，用自定义校验规则validatorUserName去校验username字段
    },
  ],
  password: [
    /* {
      required: true,
      min: 6,
      max: 15,
      message: "账号长度要在6到15位之间",
      trigger: "change",
    }, */
    {
      trigger: "change",
      validator: validatorPassword,
    },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }
  }
  .login_btn {
    width: 100%;
  }
}
</style>
