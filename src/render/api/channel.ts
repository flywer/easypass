import {reactive} from "vue";

/*通信管道*/
export const channel = reactive({
    app: {
        setWindow: 'app/setWindow',
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
        getNetworkInterfaces: 'app/getNetworkInterfaces',
        sendNetworkInfo: 'app/sendNetworkInfo',
        getAppInfo: 'app/getAppInfo',
        getAppSettings: 'app/getAppSettings',
        setAppSettings: 'app/setAppSettings',
        setLoginMode: 'app/setLoginMode',
        relaunch: 'app/relaunch',
        setProxy: 'app/setProxy',
        getAppProxySettings: 'app/getAppProxySettings',
        setAppToken: 'app/setAppToken',
        checkAppToken: 'app/checkAppToken',
        getTokenSettings:  'app/getTokenSettings',
        showTokenPanel:  'app/showTokenPanel',
        getResourcePath:'app/getResourcePath',
        setAppMinSizeLock: 'app/setAppMinSizeLock',
    },
    group: {
        getGroupListByUserInfo: 'group/getGroupListByUserInfo',
        getGroupListByUserInfoByPage: 'group/getGroupListByUserInfoByPage',
        getGroupById: 'group/getGroupById',
        saveGroup: 'group/saveGroup',
        updateGroup: "group/updateGroup",
        deleteGroupById: "group/deleteGroupById",
        saveOrUpdateGroup: "group/saveOrUpdateGroup",
        findIcon: "group/findIcon",


    },
    groupItem: {
        saveOrUpdateGroupItems: 'groupItem/saveGroupItems',
        getGroupItemsListByPage: "groupItem/getGroupItemsListByPage",
        deleteGroupItemByItemId: "groupItem/deleteGroupItemByItemId",
        getItemsListByItemId: "groupItem/getItemsListByItemId",
        setGroupItemCommon: "groupItem/setGroupItemCommon",
        getCommonGroupItemsListByPage: "groupItem/getCommonGroupItemsListByPage",
        getItemTypeEnum:"groupItem/getItemTypeEnum",
        updateGroupIdByItemId: "groupItem/updateGroupIdByItemId",
    },
    user: {
        getUserByMac: 'user/getUserByMac',
        register: 'user/register',
        login: 'user/login',
        checkLogin: 'user/checkLogin',
        logout: 'user/logout',
        cancellation: 'user/cancellation',
        updateUserInfoByUserId: 'user/updateUserInfoByUserId',
        checkPassword: 'user/checkPassword',
        sendEmail: 'user/sendEmail',

    }
})
