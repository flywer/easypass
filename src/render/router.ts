import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHashHistory} from 'vue-router'

const GroupMgt = () => import('@render/components/groupMgt/GroupMgt.vue')
const Settings = () => import('@render/components/settings/Settings.vue')
const GroupItems = () => import('@render/components/groupItemMgt/GroupItemMgt.vue')
const GroupItemTableForm = () => import('@render/components/groupItemMgt/SaveOrUpdateItemForm.vue')
const CommonAccount = () => import('@render/components/groupItemMgt/CommonAccount.vue')
const DataSourceMgt = () => import('@render/components/dataSourceMgt/DataSourceMgt.vue')

export const routeName = {
    GROUP_MGT: 'groupMgt',
    COMMON_ACCOUNT: 'commonAccount',
    SETTINGS: 'settings',
    GROUP_ITEM: 'groupItems',
    GROUP_ITEM_TABLE_FORM: 'groupItemTableForm',
    DATA_SOURCE: 'dataSource'
}

// 定义一些路由
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/group',
    },
    {
        path: '/group',
        name: routeName.GROUP_MGT,
        component: GroupMgt,
    },
    {
        path: '/commonAccount',
        name: routeName.COMMON_ACCOUNT,
        component: CommonAccount
    },
    {
        path: '/settings/:tabActiveKey',
        name: routeName.SETTINGS,
        component: Settings,
    },
    {
        path: '/items',
        name: routeName.GROUP_ITEM,
        component: GroupItems,
    },
    {
        path: '/save_item',
        name: routeName.GROUP_ITEM_TABLE_FORM,
        component: GroupItemTableForm,
    },
    {
        path: '/dataSource',
        name: routeName.DATA_SOURCE,
        component: DataSourceMgt,
    }
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router

