<template>
  <div class="container">
    <!-- 数据大屏展示内容的区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top />
      </div>
      <!-- 数据大屏底部 -->
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Counter class="count"></Counter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
//引入顶部的子组件
import Top from "./component/top/index.vue"
//引入左侧三个子组件
import Tourist from "./component/tourist/index.vue"
import Sex from "./component/sex/index.vue"
import Age from "./component/age/index.vue"

//引入中间两个子组件
import Map from "./component/map/index.vue"
import Line from "./component/line/index.vue"

//引入右侧三个子组件
import Rank from "./component/rank/index.vue"
import Year from "./component/year/index.vue"
import Counter from "./component/couter/index.vue"

//获取数据大屏展示内容盒子的DOM元素
let screen = ref()
onMounted(() => {
  // 下面代码的作用是将screen元素按照指定的缩放比例进行缩放，并向左上方移动50%
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
//定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}
// 下面这个函数是当浏览器窗口大小发生变化的时候触发，窗口大小变化的时候，按照变化后的大小比例对screen元素进行缩放
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw; // vw 是占页面可视区域宽度的百分比
  height: 100vh; // vh 是占页面可视区域高度的百分比
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    /* 下面的代码是将screen盒子的缩放尺寸的基点设置在左上角 */
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 40px;

        .rank {
          flex: 1.5;
        }

        .year {
          flex: 1;
        }

        .count {
          flex: 1;
        }
      }
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column; // 使得left下的标签横向排列
        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }
      .center {
        flex: 2; // 这个是flex布局的一种写法效果，根据flex的值分配大小
        display: flex;
        flex-direction: column;
        .map {
          flex: 4;
        }

        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
