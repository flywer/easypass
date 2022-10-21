import {reactive} from 'vue'
import {SysUser} from "@main/model/sysUser";

//全局变量
export const store = reactive({
    currentGroupId: null,
    currentGroupName: null,
    theme: {},
    isUpdating: false,
    isDownloaded: false,
    isLogin: false,
    selectedMenuKeys: ['100'],
    user: <typeof SysUser>{}
})

