declare module "*.vue" {
  import { App } from "vue"
  const component: ReturnType<typeofdefineComponent> & {
    install(app: App): void
  }
  export default component
}
