import path from "path";
import os from "os";
import moment from "moment/moment";
import {readFsSync} from "@common/utils/fsUtils";
import {isEmpty} from "lodash";
import config from "@common/config/appConfig.json";
import parseJson from 'parse-json'
import log from "electron-log";
import fs from "fs";
import {promisify} from 'util'
import {app} from "electron";

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

export const getDayString = () => {
    moment.locale('zh-cn') //设置时区
    return moment().format('YYYY-MM-DD')
}

//endregion

//region 应用
/**
 * 获取操作系统home文件夹
 */
export const getUserHome = () => {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
 * 获取本应用在操作系统中的文件存储位置
 */
export const getAppDataPath = () => {
    return path.join(os.homedir(), '/AppData/Local/EasyPass')
}

/**
 * 获取本应用在操作系统的临时文件存储位置
 */
export const getAppTempDataPath = () => {
    return path.join(os.tmpdir(), '/EasyPass')
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

export const getAppPath = () => {
    return path.dirname(app.getPath('exe'))
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
        folderPath: path.join(getAppDataPath(), '/config'),
        fileName: 'settings.json'
    }
    const buffer = await readFsSync(path.join(appSettingsFile.folderPath, appSettingsFile.fileName))
    if (buffer == null || isEmpty(buffer.toString()))
        return defaultSettings
    else
        return parseJson(buffer.toString())
}

/**
 * 获取应用网络代理设置
 */
export const getAppProxySettings = async () => {
    const defaultSettings = config.defaultProxySettings
    const appSettingsFile = {
        folderPath: path.join(getAppDataPath(), '/config'),
        fileName: 'proxy.json'
    }

    const buffer = await readFsSync(path.join(appSettingsFile.folderPath, appSettingsFile.fileName))
    if (buffer == null || isEmpty(buffer.toString()))
        return defaultSettings
    else
        return parseJson(buffer.toString())
}

/**
 * 获取应用令牌信息
 */
export const getAppTokenSettings = async () => {
    const defaultSettings = config.defaultTokenSettings
    const appTokenFile = {
        folderPath: path.join(getAppDataPath(), '/config'),
        fileName: 'token.json'
    }

    const buffer = await readFsSync(path.join(appTokenFile.folderPath, appTokenFile.fileName))
    if (buffer == null || isEmpty(buffer.toString()))
        return defaultSettings
    else
        return parseJson(buffer.toString())
}

/**
 * 获取应用数据库目前需要进行的操作配置
 */
export const getAppDbStat = async () => {
    const defaultSettings = config.databaseStat
    const appBdStat = {
        folderPath: path.join(getAppDataPath(), '/config'),
        fileName: 'dbStat.json'
    }

    const buffer = await readFsSync(path.join(appBdStat.folderPath, appBdStat.fileName))
    if (buffer == null || isEmpty(buffer.toString()))
        return defaultSettings
    else
        return parseJson(buffer.toString())
}

/**
 * 获取应用目前可使用的数据源
 */
export const getDataSourceSettings = async () => {
    const defaultSettings = [{
        id: 'default',
        type: 1,
        name: '本地默认',
        dialect: 'sqlite',
        storage: path.join(getAppDataPath(), '/local/easy_pass.sqlite')
    }]

    const dataSourceSettings = {
        folderPath: path.join(getAppDataPath(), '/config'),
        fileName: 'ds.json'
    }
    const buffer = await readFsSync(path.join(dataSourceSettings.folderPath, dataSourceSettings.fileName))
    if (buffer == null || isEmpty(buffer.toString()))
        return defaultSettings
    else
        return parseJson(buffer.toString())
}
//endregion
