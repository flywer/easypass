import {createApp} from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import routes from "./router";
import {createRouter, createWebHashHistory } from 'vue-router'

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

createApp(App)//创建应用
    .use(Antd)
    .use(router)//整个应用支持路由
    .mount('#app');//挂载根实例
