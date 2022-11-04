import {reactive} from 'vue'
import {User} from "@main/model/user";

//全局变量
export const store = reactive({
    currentGroupId: null,
    currentGroupName: null,
    theme: {},
    isUpdating: false,
    isDownloaded: false,
    isLogin: false,
    selectedMenuKeys: ['100'],
    user: <typeof User>{},
    loginMode: '02',
    hasUpdates: false,/*发现可更新版本*/
    emailValidCode:''
})
