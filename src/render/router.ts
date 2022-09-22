import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const PwdMgt = () => import('./components/pwdMgt/PwdMgt.vue')
// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/pwd-mgt/100',
  },
  {
    path: '/pwd-mgt/:key',
    name: 'pwdMgt',
    component: PwdMgt,
  },
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router

