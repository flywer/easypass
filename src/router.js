const PwdMgt=() => import('./components/pwdMgt/PwdMgt.vue')

// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes = [
    /*{
        path: '/',
        redirect: '/home/hello'
    },
    {
        path: '/home',
        component: CenterContent,
        children: [
            {
                path: 'about',
                component: About
            }, {
                path: 'hello',
                component: Hello
            }
        ]

    },*/
    {path: '/', redirect: '/pwd-mgt/100'},
    {path: '/pwd-mgt/:key', name: 'pwdMgt', component:PwdMgt}
]

export default routes

