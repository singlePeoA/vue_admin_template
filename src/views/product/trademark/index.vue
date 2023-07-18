<!-- 这个文件对应的是 商品管理下的品牌管理模块 -->
<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌的按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="plus"
        @click="addTrademark"
        v-has="`btn.Trademark.add`"
      >
        添加品牌
      </el-button>

      <!-- 表格组件，用于展示已有的品牌的数据 -->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <!-- 
        el-table
          border 用于添加整个表格的纵向的边框
          data 用于设置表格中要显示的数据，data的属性值一定要是一个数组，这个数组有几个元素，那么table下就会有几行表格

        el-table-column
          el-table-column 代表表格中的一列
          label 用于设置一列中最顶部的的标题
          align 设置一列中文字的对齐方式
          type 用于设置表格中一列的类型，如果它的值为index，那么在这一列下的所有单元格都会显示它们对应的index下标值
          prop/property 用于设置表格中一列下所有单元格中显示的内容，下面prop的属性值为tmName，那么那一列下的所有单元格中的内容就是对应的tmName值
      -->
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <!-- table-column  默认展示数据用的是div标签 但也可以用插槽的方法来展示数据 -->
        <!-- 以下就是用作用域插槽的写法来展示数据，而下面这种作用域插槽的写法是根据当前组件文档中规定的来写的 -->
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <!-- row是这一行已有品牌的数据 -->
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            >
              <!-- updateTrademark函数的作用是修改当前已有品牌，点击当前这个按钮后将row作为参数传递进去，row是当前这个按钮所在的这一行的所有数据 -->
            </el-button>
            <!-- 
              el-popconfirm组件是一个气泡确认框，当它里面的el-button被点击后，外层的el-popconfirm就会弹出
              confirm 是一个事件，当点击了气泡弹出框中的确认按钮就会触发，下面的confirm事件函数传递了一个参数row.id，是当前要被删除的品牌的id值，要把这个id值传递进去
             -->
            <el-popconfirm
              :title="`您确定要删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
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

      <!-- 分页器组件 -->
      <!-- 
      pagination
        v-model:current-page 设置分页器当前的页码
        v-model:page-size 设置每一页展示多少条数据
        page-sizes 用于设置分页器中下拉菜单中可以更改的每一页展示多少条数据
        background 是否为分页器中的按钮添加背景颜色，值为布尔值
        layout 可以设置分页器六个子组件的布局调整
        total 是设置分页器的展示数据的总数
        current-change 这是一个事件，当分页器中的页码发生变化时就会触发，它的回调函数是一个封装了接口的函数，所有当页码发生变化的时候，就会调用接口，重新获取品牌数据并且展示出来
     -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :pager-count="9"
        :total="total"
      />
    </el-card>

    <!-- 对话框组件 在添加品牌与修改已有品牌后显示 -->
    <!-- 
        v-model: 属性用户控制对话框的显示与隐藏的 true显示 false隐藏
        title: 设置对话框左上角标题
   -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <!-- rules 用于定义自定义校验规则 -->
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <!-- 
        label 用于设置表单项的标题
        label-width 用于设置表单项中标题的宽度
        prop 用于设置需要被校验的字段
     -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 下面这个upload组件用于上传图片 -->
          <!--
          upload
            action 这个属性的作用是将获取到的图片上传到指定地址，图片上传路径书写要书写 /api ,否则代理服务器不发送这次post请求
            show-file-list 是否显示上传的图片列表
            before-upload 是当前组件上传文件之前会触发的事件，它会给事件回调函数注入参数(当前准备上传的文件)，如果这个事件回调函数中返回了false或者Promise，并且被reject，那么这里就会停止上传当前文件，可以利用这一点来约束上传文件的类型和大小等
            on-success 是当前组件上传文件成功后会触发的事件
        -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <!-- 上面有个v-if 下面有个v-else，当有trademarkParams.logoUrl属性时，展示上面是img标签，当没有的时候展示下面的组件 -->
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽: footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue"
import { ElMessage, UploadProps } from "element-plus"
// 引入获取已有品牌数据和添加新品牌和删除品牌的接口
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from "@/api/product/trademark"
// 引入数据类型
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from "@/api/product/trademark/type"

// 当前页码
let pageNo = ref<number>(1)
// 定义每一页展示多少条数据
let limit = ref<number>(3)
// 定义已有品牌数据的总数
let total = ref<number>(0)
// 定义一个数组存储已有品牌的数据
let trademarkArr = ref<Records>([])
//控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 定义一个变量来收集新增的品牌的数据
let trademarkParams = reactive<TradeMark>({
  tmName: "", // 品牌名称
  logoUrl: "", // 品牌图片的url地址
})
//定义一个变量来获取el-form组件实例
let formRef = ref()
// 将获取已有品牌数据的接口封装为一个函数，这里面的pager是当前页码，下面如果调用这个函数的时候传递了参数，这里的pager就会等于那个参数，如果没传递，那么这里的pager就会等于1
const getHasTrademark = async (pager = 1) => {
  // 将当前页码修改为第1页
  pageNo.value = pager
  // 调用接口的时候需要传递两个指定的参数，这个是后台接口要求的
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value, // 当前的页码
    limit.value, // 当前一页要展示多少条数据
  )
  if (result.code == 200) {
    // 当code为200，代表请求数据成功
    total.value = result.data.total // 这里是已有品牌的总数
    trademarkArr.value = result.data.records // 这里是指定页数中的指定数量的已有品牌的数据，pageNo是多少，它就是第几页的数据，limit是多少，它就展示多少条数据
  }
}
//组件挂载完毕钩子---发一次请求,获取第一页、一页中放三个已有品牌的数据
onMounted(() => {
  getHasTrademark()
})

// 当分页器的下拉菜单中每页页数发生变化的时候出发此函数
//这个自定义事件,分页器组件会将下拉菜单选中数据作为函数的参数返回，只不过上面已经定义了一个数据来获取当前每一页的数据量，所以这里就不需要这个参数了
const sizeChange = () => {
  // console.log(pagesize)  // 使用这个前，得在上面的小括号里面加上pagesize
  //当前每一页的数据量发生变化的时候，当前页码回归到第1页
  // pageNo.value = 1 由于上面的getHasTrademark函数中拥有了功能类似的操作，所以这里可以注释掉
  getHasTrademark()
}
// 添加品牌按钮的回调
const addTrademark = () => {
  //对话框显示
  dialogFormVisible.value = true
  //清空对话框中之前收集的数据，每次点击添加品牌按钮的时候，都要把之前点击按钮后弹出对话框中的填写的数据清空
  trademarkParams.id = 0
  trademarkParams.tmName = ""
  trademarkParams.logoUrl = ""

  //第一种写法: ts的问号语法
  // formRef.value?.clearValidate('tmName'); // 这种的写法的原因：因为el-form组件是点击了添加品牌或修改已有品牌按钮才会显示的，一般情况下都是隐藏的状态，而clearValidate是el-form组件的方法，如果在el-form隐藏的情况下调用el-form的方法，那么就会报错
  // formRef.value?.clearValidate('logoUrl'); // formRef是通过ref标识符获取到的el-form的实例对象，这里通过formRef.value来判断el-form是否隐藏，利用三元运算符，如果不隐藏，就调用el-form的clearValidate方法来情况对应的校验规则提示信息

  // 第二种写法：nextTick方法中的代码会等到当前函数中其他的所有代码执行结束后才会执行，而这个时候，el-form已经不是隐藏状态了
  nextTick(() => {
    formRef.value.clearValidate("tmName")
    formRef.value.clearValidate("logoUrl")
  })
}
//修改已有品牌的按钮的回调
//row:row即为当前已有的品牌
const updateTrademark = (row: TradeMark) => {
  // 清空校验规则错误提示信息
  nextTick(() => {
    formRef.value.clearValidate("tmName")
    formRef.value.clearValidate("logoUrl")
  })
  // 对话框显示
  dialogFormVisible.value = true
  // 展示已有品牌的数据
  // trademarkParams.id = row.id // 这里必须给trademarkParams一个id值，因为下面有一个条件判断语句，是根据它是否有id值来判断这里进行的操作是修改已有品牌还是添加新品牌
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  //ES6语法：合并对象 以下一行操作相当于上面三行操作
  Object.assign(trademarkParams, row) // 这里是将row中的对象数据拷贝赋值给trademarkParams，这样trademarkParams就有了row中的所有数据
}
// 对话框底部取消按钮的点击事件
const cancel = () => {
  // 点击后通过 dialogFormVisible 属性来隐藏对话框
  dialogFormVisible.value = false
}
// 对话框底部确定按钮的点击事件
const confirm = async () => {
  // 在请求之前,要对整个表单进行校验，下面通过标识符获取到整个表单的实例对象，再通过value获取到整个表单的值
  // 调用validate这个方法对表单中的所有值用对应的自定义校验规则(这些规则在下面定于了)进行单独校验，这个validate方法返回的是一个Promise对象，如果校验全部通过，再执行后面的语句
  await formRef.value.validate()

  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  //添加|修改已有品牌
  if (result.code == 200) {
    // 添加品牌成功
    // 关闭对话框
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: "success",
      message: trademarkParams.id ? "修改品牌成功" : "添加品牌成功", // trademarkParams是当前调用接口时要传入的品牌的信息，如果信息中存在id，那么证明当前品牌已经存在(id值是经过后台后，后台添加上的，新添加的品牌没有经过后台就不会有id值)，这里执行的是修改品牌操作，如果不存在id，则证明当前品牌不存在，那么这里执行的就是添加品牌的操作
    })
    // 再次发请求获取已有全部的品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1) // 这里根据trademarkParams.id判断是修改还是添加，如果是修改，那么就把当前页码作为参数传递给这个函数，这个函数会跳转到这个这个页码(这里就是保持不变，修改已有品牌后页码不会跳转到第一页)，如果是添加品牌，那么就会把1作为页码参数传递给这个函数，这个函数就会让页码跳转到第一页
  } else {
    // 添加品牌失败
    ElMessage({
      type: "error",
      message: trademarkParams.id ? "修改品牌失败" : "添加品牌失败",
    })
    // 关闭对话框
    dialogFormVisible.value = false
  }
}
// 上传图片组件 -> 上传图片之前会触发的事件回调函数
// 这里的UploadProps是element-plus组件自己定义的数据类型
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  //要求:上传文件格式png|jpg|gif 4M
  if (
    //这个rawFile就是当前正在上传的文件，可以凭借这个用来约束文件的大小和类型
    rawFile.type == "image/png" ||
    rawFile.type == "image/jpeg" ||
    rawFile.type == "image/gif"
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      // 这里是判断文件的大小，如果小于4MB，那么就符合条件
      return true
    } else {
      ElMessage({
        type: "error",
        message: "上传文件大小必须小于4M",
      })
      return false
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件格式务必PNG|JPG|GIF",
    })
    return false // 如果返回了false，那么就会终止上传当前文件
  }
}
// 上传图片组件 -> 图片上传成功后会触发的事件回调函数
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response, // response 即为当前这次上传图片post请求服务器返回的数据，上传成功后他会把图片的地址返回
  uploadFile,
) => {
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate("logoUrl") // clearValidate是 el-form组件提供的方法，它用于清除表单校验的提示信息
}

//品牌名称的自定义校验规则方法
/* 
  rule 是响应的校验规则对象
  value 是要被校验的内容对象
  callback 是放行函数
*/
const validatorTmName = (rule: any, value: any, callBack: any) => {
  // 根据下面表单检验规则对象的设置，这里是当表单元素触发blur失焦事件的时候，就会触发此方法
  // 自定义校验规则
  if (value.trim().length >= 2) {
    callBack() // 这个放行函数一被调用就代表校验完成
  } else {
    //校验未通过返回的错误的提示信息
    callBack(new Error("品牌名称长度要大于等于两位"))
  }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error("一定要上传一个LOGO图片"))
  }
}
//表单校验规则对象
const rules = {
  // 这个tmName用于校验tmName字段
  tmName: [
    // required: 这个字段务必校验，对应的表单项前面显示一个红色五角星
    // trigger: 代表触发校验规则时机 [blur、change]
    { required: true, trigger: "blur", validator: validatorTmName },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }], // 由于这个校验规则对应的是一个用于文件选择的组件，它没有对应的校验时机，所以这里就没必要写trigger
}

// 删除品牌按钮点击后弹出的气泡弹出框中的确定按钮被点击后就会触发的函数
const removeTradeMark = async (id: number) => {
  //点击确定按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id) // result接收的是这个接口调用后返回的数据
  if (result.code == 200) {
    //删除成功提示信息
    ElMessage({
      type: "success",
      message: "删除品牌成功",
    })
    //再次获取已有的品牌数据
    getHasTrademark(
      // 以下代码的意思是：trademarkArr.value.length是当前页码下的品牌的数量，当当前页码下的品牌数量不为0的时候，页码保持不变；如果为0，那么页码就修改值当前页码的上一页
      // 运用三元运算符，如果 trademarkArr.value.length > 1 ，就将当前页码pageNo.value作为参数传递过去，反之，就将 当前页码的上一页pageNo.value - 1作为参数传递回去
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: "error",
      message: "删除品牌失败",
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
