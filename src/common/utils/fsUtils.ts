import fs from "fs";
import path from "path";
import log from 'electron-log'
import {promisify} from "util";

/**
 * 异步写入本地文件，没有则创建
 * @param folderPath
 * @param fileName
 * @param data
 */
export const writeFs = ({folderPath, fileName}, data) => {
    fs.open(path.join(folderPath, fileName), 'w+', (e, fd) => {
        if (e) {
            //不存在文件或路径时
            if (e.code === 'ENOENT') {
                fs.mkdir(folderPath, {recursive: true}, (error) => {
                    if (error) log.error(error)
                    else{
                        fs.writeFile(path.join(folderPath, fileName), data, (err) => {
                            if (err) log.error(err)
                        })
                    }
                })
                log.log(path.join(folderPath, fileName) + '\twrite success!');
            } else {
                log.error('writeFs:' + e)
            }
        } else {
            fs.write(fd, data, (err) => {
                if (err) log.error(err)
            })
            fs.close(fd, function () {
                log.log(path.join(folderPath, fileName) + '\twrite success!');
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
                    log.log(filePath + '\tread success!');
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
 * 删除文件，文件不存在则提示
 * @param filePath
 */
export const deleteFileFs = (filePath: string) => {
    fs.unlink(filePath, (e) => {
        if (e) log.error(e)
        else log.log(filePath + '\twas deleted!')
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

// 使用promisify方法来promise化指定方法
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

/**
 * 异步计算文件夹的大小
 * 利用回调函数和递归来完成多层级目录中的文件大小计算
 * @param dirPath
 * @param cb
 */
export const calcSize = async (dirPath, cb) => {
    let fileSize = 0;
    let error = null

    async function calc(dirPath) {
        try {
            const statObj = await stat(dirPath)
            if (statObj.isDirectory()) {
                const files = await readdir(dirPath)
                let dirs = files.map(item => {
                    return path.join(dirPath, item)
                })
                let index = 0
                async function next() {
                    if (index < dirs.length) {
                        let current = dirs[index++]
                        await calc(current)
                        await next()
                    }
                }
                return await next()
            } else {
                fileSize += statObj.size
            }
        } catch (err) {
            error = err
        }
    }
    await calc(dirPath)
    cb(error, fileSize)
}
