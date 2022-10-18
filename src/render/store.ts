import {reactive} from 'vue'

//全局变量
export const store = reactive({
    currentGroupId: null,
    currentGroupName: null,
    theme: {},
    isUpdating: false,
    isDownloaded: false,
    mac: null,
    isLogin:false,
    userId:null
})

