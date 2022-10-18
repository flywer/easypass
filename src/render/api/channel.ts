import {reactive} from "vue";

/*通信管道*/
export const channel = reactive({
    app: {
        setWindow: 'app/setWindow',
        setOpenAtLogin: 'app/setOpenAtLogin',
        getOpenAtLogin: 'app/getOpenAtLogin',
        getAppTheme: 'app/getAppTheme',
        setAppTheme: 'app/setAppTheme',
        getAppVersion: 'app/getAppVersion',
        checkForUpdate: 'app/checkForUpdate',
        sendUpdateInfo: 'app/sendUpdateInfo',
        sendDownloadProgress: 'app/sendDownloadProgress',
        downloadUpdate: 'app/downloadUpdate',
        sendUpdateDownloaded: 'app/sendUpdateDownloaded',
        quitAndInstall: 'app/quitAndInstall',
        sendDefaultTheme: 'app/sendDefaultTheme',
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
        saveOrUpdateGroupItems: 'groupItem/saveGroupItems',
        getGroupItemsListByPage: "groupItem/getGroupItemsListByPage",
        deleteGroupItemByItemId: "groupItem/deleteGroupItemByItemId",
        getItemsListByItemId: "groupItem/getItemsListByItemId",
    }
})
