import path from "path";
import os from "os";
import moment from "moment/moment";
import {readFsSync} from "@common/utils/fsUtils";
import {isEmpty} from "lodash";
import config from "@common/config/appConfig.json";
import parseJson from 'parse-json'
import log from "electron-log";

//region 字符串

/**
 * 包装sql中like语句所需要的'%'
 * @param content
 * @param left
 * @param right
 */
export const sqlLikePack = (content: any, left?: boolean, right?: boolean) => {
    if (left)
        content = '%' + content
    if (right)
        content = content + '%'
    return content
}

//endregion

// region 时间
/**
 * 获取当前时间
 */
export const getDateString = () => {
    moment.locale('zh-cn') //设置时区
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

//endregion

//region 应用
/**
 * 获取操作系统home文件夹
 */
export const getUserHome = () => {
    return process.env[(process.platform ==
        'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
 * 获取本应用在操作系统中的文件存储位置
 */
export const getUserAppDataFolder = () => {
    const userHome = getUserHome()
    if (process.platform == 'win32') {
        return path.join(userHome, '/AppData/Local/easyPass')
    } else {
        return path.join(userHome, '/easyPass')
    }
}


/**
 * 获取应用资源位置
 * 开发环境：项目根目录
 * 生产环境：根目录下的resources文件夹
 */
export const getResourcePath = () => {
    return !process.env.NODE_ENV || process.env.NODE_ENV === "production"
        ? process.resourcesPath // Live Mode
        : process.cwd(); // Dev Mode
}

/**
 * 获取网络接口信息
 */
export const getNetworkInfo = () => {
    let result = {
        mac: null,
        hostname: null
    }
    try {
        if (os.networkInterfaces().WLAN) {
            result.mac = os.networkInterfaces().WLAN[0].mac
        } else {
            result.mac = os.networkInterfaces()['以太网'][0].mac
        }
        result.hostname = os.hostname()
    } catch (e) {
        log.error(e)
    }
    return result
}

/**
 * 获取应用设置
 */
export const getAppSettings = async () => {
    const defaultSettings = config.defaultSettings
    const appSettingsFile = {
        folderPath: path.join(getUserAppDataFolder(), '/config'),
        fileName: 'settings.json'
    }
    const buffer = await readFsSync(path.join(appSettingsFile.folderPath, appSettingsFile.fileName))
    if (buffer == null || isEmpty(buffer.toString()))
        return defaultSettings
    else
        return parseJson(buffer.toString())
}

//endregion
