import { defineConfig, loadEnv } from "vite"
// loadEnv 是可以加载对应环境下的配置的变量
import vue from "@vitejs/plugin-vue"
import path from "path"
// 引入svg需要用到的插件
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
// mock插件提供的方法
import { viteMockServe } from "vite-plugin-mock"
export default defineConfig(({ command, mode }) => {
  // 获取各个环境下的对应的变量
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      viteMockServe({
        // 如果你的 vite-plugin-mock 的版本是 3.0.0，那么这里会报错，要将 vite-plugin-mock 的版本换成2.9.6
        localEnabled: command === "serve", // 这行代码保证开发阶段可以使用mock接口
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    // scss全局变量的配置，配置了这个后，就能在scss样式中书写全局变量，这个全局变量就能够在其他scss样式文件中使用
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  }
})
