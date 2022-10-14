import {createApp} from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import UUID from "vue3-uuid";
import less from 'less'
import 'ant-design-vue/dist/antd.variable.less'
import 'animate.css'

createApp(App)// 创建应用
    .use(router)// 整个应用支持路由
    .use(Antd)
    .use(UUID)
    .use(less)
    .mount('#app')// 挂载根实例
