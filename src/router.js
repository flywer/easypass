//定义路由组件.也可以从其他文件导入
const Home = {template: '<div>Home</div>'}
const About = {template: '<div>About</div>'}

// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes = [
    {path: '/', name: Home, component: Home},
    {path: '/about', component: About},
]

export default routes

