import {reactive} from "vue";

/*通信管道*/
export const channel = reactive({
    app: {
        window: {
            setWindow: 'app/setWindow',
        },
        settings: {
            getAppTheme: 'app/getAppTheme',
            setAppTheme: 'app/setAppTheme',
            getAppSettings: 'app/getAppSettings',
            setAppSettings: 'app/setAppSettings',
            setProxySettings: 'app/setProxy',
            getAppProxySettings: 'app/getAppProxySettings',
        },
        updater: {
            getAppVersion: 'app/getAppVersion',
            checkForUpdate: 'app/checkForUpdate',
            sendUpdateInfo: 'app/sendUpdateInfo',
            sendDownloadProgress: 'app/sendDownloadProgress',
            downloadUpdate: 'app/downloadUpdate',
            sendUpdateDownloaded: 'app/sendUpdateDownloaded',
            quitAndInstall: 'app/quitAndInstall',
        },
        dataSource: {
            getDataSourceList: 'app/searchDatabases',
            dataSourceTest: 'app/dataSourceTest',
            addDataSource: 'app/addDataSource',
            getAppDbStat: 'app/getAppDbStat',
            changeDataSource: 'app/changeDataSource',
            deleteDataSource: 'app/deleteDataSource',
        },
        getNetworkInterfaces: 'app/getNetworkInterfaces',
        sendNetworkInfo: 'app/sendNetworkInfo',
        getAppInfo: 'app/getAppInfo',
        relaunch: 'app/relaunch',

        setAppToken: 'app/setAppToken',
        checkAppToken: 'app/checkAppToken',
        getTokenSettings: 'app/getTokenSettings',
        showTokenPanel: 'app/showTokenPanel',

        getResourcePath: 'app/getResourcePath',
        setAppMinSizeLock: 'app/setAppMinSizeLock',
        getAppMetrics: 'app/getAppMetrics',

        showEmojiPanel: 'app/showEmojiPanel',

        openPath: 'app/openPath',
        openAppFolder: 'app/openAppFolder',
        openAppDataFolder: 'app/openAppDataFolder',
        openAppTempDataFolder: 'app/openAppTempDataFolder',

        getAppFolderSize: 'app/getAppFolderSize',
        getAppDataFolderSize: 'app/getAppDataFolderSize',
        getAppTempDataFolderSize: 'app/getAppTempDataFolderSize',

        lockApp: 'app/lockApp',

        showOpenDialog: 'app/showOpenDialog',
        showSaveDialog: 'app/showSaveDialog',

        setCommonAccount: 'app/setCommonAccount',
        getCommonTextContent: 'app/getCommonTextContent',
        setCommonPassword: 'app/setCommonPassword',
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
        exportByGroupIds: "group/exportByGroupIds",
    },
    groupItem: {
        saveOrUpdateGroupItems: 'groupItem/saveGroupItems',
        getGroupItemsListByPage: "groupItem/getGroupItemsListByPage",
        deleteGroupItemByItemId: "groupItem/deleteGroupItemByItemId",
        getItemsListByItemId: "groupItem/getItemsListByItemId",
        setGroupItemCommon: "groupItem/setGroupItemCommon",
        getCommonGroupItemsListByPage: "groupItem/getCommonGroupItemsListByPage",
        getItemTypeEnum: "groupItem/getItemTypeEnum",
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
        registerCheck: 'user/registerCheck'
    }
})
