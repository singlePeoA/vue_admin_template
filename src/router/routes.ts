// 对外暴露配置路由(常量路由)
export const constantRoute = [
  {
    // 这个路由对应的是登录页面组件
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login", // 命名路由
    meta: {
      // 这个meta是用于展示路由源信息
      title: "登录",
      hidden: true, // 这个hidden代表当前这个路由是否要遍历到layout主页中侧边栏的菜单选项中，true是不要，false是要，如果没有写hidden就默认为false
      icon: "Promotion", //菜单文字左侧的图标,支持element-plus全部图标
    },
  },
  {
    // 这个路由对应的是登录成功后展示的主页的组件
    path: "/",
    component: () => import("@/layout/index.vue"),
    name: "layout",
    meta: {
      // 这个meta是用于展示路由源信息
      title: "",
      hidden: false,
      icon: "", // 这个icon代表着element-plus中提供的对应的图标，要被运用到layout主页中侧边栏菜单的图标显示
    },
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          // 这个meta是用于展示路由源信息
          title: "首页",
          hidden: false,
          icon: "HomeFilled",
        },
      },
    ],
  },
  {
    // 这个路由对应的是登录失败后展示的页面的组件
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404",
    meta: {
      // 这个meta是用于展示路由源信息
      title: "404",
      hidden: true,
      icon: "DocumentDelete",
    },
  },
  {
    // 这个路由对应的是数据大屏侧边菜单栏的组件
    path: "/screen",
    component: () => import("@/views/screen/index.vue"),
    name: "Screen",
    meta: {
      title: "数据大屏",
      icon: "Platform",
    },
  },
  {
    // 这个路由对应的是权限管理侧边下拉菜单栏的组件
    path: "/acl",
    component: () => import("@/layout/index.vue"),
    name: "Acl",
    meta: {
      title: "权限管理",
      icon: "Lock",
    },
    redirect: "/acl/user",
    children: [
      {
        // 这个路由对应的是用户管理侧边菜单栏的组件
        path: "/acl/user",
        component: () => import("@/views/acl/user/index.vue"),
        name: "User",
        meta: {
          title: "用户管理",
          icon: "User",
        },
      },
      {
        // 这个路由对应的是角色管理侧边菜单栏的组件
        path: "/acl/role",
        component: () => import("@/views/acl/role/index.vue"),
        name: "Role",
        meta: {
          title: "角色管理",
          icon: "UserFilled",
        },
      },
      {
        // 这个路由对应的是菜单管理侧边菜单栏的组件
        path: "/acl/permission",
        component: () => import("@/views/acl/permission/index.vue"),
        name: "Permission",
        meta: {
          title: "菜单管理",
          icon: "Monitor",
        },
      },
    ],
  },
  {
    // 这个路由对应的是商品管理侧边下拉菜单栏的组件
    path: "/product",
    component: () => import("@/layout/index.vue"),
    name: "Product",
    meta: {
      title: "商品管理",
      icon: "Goods",
    },
    redirect: "/product/trademark",
    children: [
      {
        // 这个路由对应的是品牌管理侧边菜单栏的组件
        path: "/product/trademark",
        component: () => import("@/views/product/trademark/index.vue"),
        name: "Trademark",
        meta: {
          title: "品牌管理",
          icon: "ShoppingCartFull",
        },
      },
      {
        // 这个路由对应的是属性管理侧边菜单栏的组件
        path: "/product/attr",
        component: () => import("@/views/product/attr/index.vue"),
        name: "Attr",
        meta: {
          title: "属性管理",
          icon: "ChromeFilled",
        },
      },
      {
        // 这个路由对应的是SPU管理侧边菜单栏的组件
        path: "/product/spu",
        component: () => import("@/views/product/spu/index.vue"),
        name: "Spu",
        meta: {
          title: "SPU管理",
          icon: "Calendar",
        },
      },
      {
        // 这个路由对应的是SKU管理侧边菜单栏的组件
        path: "/product/sku",
        component: () => import("@/views/product/sku/index.vue"),
        name: "Sku",
        meta: {
          title: "SKU管理",
          icon: "Orange",
        },
      },
    ],
  },
  {
    // 这个路由对应的当路由路径当不是以上三种情况时才展示的路由组件
    path: "/:pathMatch(.*)*",
    redirect: "/404", // 重定向，当路由路径不是以上三种情况的时候，将路由路径重定向为 /404 ，从而展示404路由路径对应的路由组件
    name: "Any",
    meta: {
      // 这个meta是用于展示路由源信息
      title: "任意路由",
      hidden: true,
    },
  },
]
