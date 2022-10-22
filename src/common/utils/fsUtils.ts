import fs from "fs";
import path from "path";
import log from 'electron-log'

/**
 * 异步写入本地文件，没有则创建
 * @param path
 * @param data
 */
export const writeFs = (filePath: string, data) => {
    fs.open(filePath, 'w+', (e, fd) => {
        if (e) log.error(e)
        else {
            fs.write(fd, data, () => {
                if (e) log.error(e)
            })
            fs.close(fd, function () {
                log.log(filePath + '\twrite success!\n');
            });
        }
    })
}

/**
 * 异步读取文件，文件不存在则返回null
 * @param path
 */
export const readFs = (filePath: string) => {
    return new Promise((resolve, reject) => {
        fs.open(filePath, 'r', (e, fd) => {
            if (e) {
                resolve(null)
            } else {
                fs.read(fd, (e, bytesRead, buffer) => {
                    resolve(buffer)
                })
                fs.close(fd, function () {
                    log.log(filePath + '\tread success!\n');
                });
            }
        })
    })
}

/**
 * 同步读取文件，文件不存在则返回null
 * @param filePath
 */
export const readFsSync = (filePath: string) => {
    return new Promise((resolve, reject) => {
        fs.open(filePath, 'r', (e) => {
            if (!e) {
                resolve(fs.readFileSync(filePath))
            } else
                resolve(null)
        })
    })
}

/**
 * 判断此路径、文件是否存在，存在则读取，不存在则创建并写入
 * @param folderPath
 * @param fileName
 * @param data
 */
export const fileExistAndWrite = (folderPath: string, fileName: string, data?) => {
    return new Promise((resolve, reject) => {
        fs.open(path.join(folderPath, fileName), 'r', (e) => {
            //不存在
            if (e) {
                if (e.code === 'ENOENT') {
                    log.info(fileName + ' does not exist, was created')
                    fs.mkdir(folderPath, {recursive: true}, (err) => {
                        if (err) log.error(e)
                    })
                    //写入
                    fs.writeFileSync(path.join(folderPath, fileName), data)
                }
            }
            resolve(fs.readFileSync(path.join(folderPath, fileName)))
        })
    })
}

/**
 * 删除文件，文件不存在则提示
 * @param filePath
 */
export const deleteFileFs = (filePath: string) => {
    fs.unlink(filePath, (e) => {
        if (e) log.error(e)
        else log.log(filePath + '\twas deleted!\n')
    })
}

