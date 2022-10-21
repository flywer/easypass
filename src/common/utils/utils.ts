import path from "path";
import os from "os";
import moment from "moment/moment";

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
        console.error(e)
    }
    return result
}

//endregion
