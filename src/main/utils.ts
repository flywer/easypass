import fs from 'fs'
import path from "path";
import {failure, success} from "@main/vo/resultVo";
import os from "os";

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

/**
 * 异步写入本地文件，没有则创建
 * @param path
 * @param data
 */
export const writeFs = (path: string, data) => {
    fs.writeFile(path, data, {flag: 'w+'}, (err) => {
        if (err) throw  err
    });
}

/**
 * 判断此路径、文件是否存在，存在则修改，不存在则创建
 * @param folderPath
 * @param fileName
 * @param data
 */
export const fileExistAndWrite = async (folderPath: string, fileName: string, data?) => {
    return new Promise((resolve, reject) => {
        fs.open(path.join(folderPath, fileName), 'r', (e) => {
            //不存在
            if (e) {
                if (e.code === 'ENOENT') {
                    console.info(fileName + ' does not exist, will be created')
                    fs.mkdir(folderPath, {recursive: true}, (err) => {
                        if (err) throw err;
                    })
                    //写入
                    fs.writeFileSync(path.join(folderPath, fileName), data, {flag: 'w'})
                }
            }
            resolve(fs.readFileSync(path.join(folderPath, fileName)))
        })
    })
}

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
