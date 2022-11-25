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
    emailValidCode: '',
    haveToken: false,/*是否使用了应用令牌*/
    showTokenPanel: true,/*是否显示应用令牌输入界面*/
    tokenCheckRemainTimes: 5,/*令牌输入剩余校验次数*/
    commonText:{
        account:'',
        password:''
    }
})
