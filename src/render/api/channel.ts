import {reactive} from "vue";

/*通信管道*/
export const channel = reactive({
    app: {
        setWindow: 'app/setWindow',
        setOpenAtLogin: 'app/setOpenAtLogin',
        getOpenAtLogin: 'app/getOpenAtLogin'
    },
    pwdGroup: {
        getPwdGroupListByUserInfo: 'pwdGroup/getPwdGroupListByUserInfo',
        getPwdGroupListByUserInfoByPage: 'pwdGroup/getPwdGroupListByUserInfoByPage',
        getPwdGroupById: 'pwdGroup/getPwdGroupById',
        savePwdGroup: 'pwdGroup/savePwdGroup',
        updatePwdGroup: "pwdGroup/updatePwdGroup",
        deleteGroupById: "groupItem/deleteGroupById",
    },
    groupItem: {
        saveGroupItems: 'groupItem/saveGroupItems',
        getGroupItemsListByPage: "groupItem/getGroupItemsListByPage",
        deleteGroupItemByItemId: "groupItem/deleteGroupItemByItemId",
    }
})
