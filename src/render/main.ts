import {createApp} from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import 'vue-happy-scroll/docs/happy-scroll.css'
createApp(App)// 创建应用
    .use(router)// 整个应用支持路由
    .use(Antd)
    .mount('#app')// 挂载根实例
