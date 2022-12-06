import {ipcInstance} from "@render/plugins";
import {Result} from "@main/vo/resultVo";
import {channel} from "@render/api/channel";

/**
 * 模糊搜索图片
 * @param q 查询值
 * @param number 数量
 */
export function findImage(q: string, number: number) {
    return ipcInstance.send<Result>(channel.group.findIcon, q, number)
}

/**
 * 向用户邮箱发送邮件
 * @param data
 * @param type
 */
export function sendEmail(data: { email: string, validCode: string }, type: number) {
    return ipcInstance.send<Result>(channel.user.sendEmail, data, type)
}

/**
 * 显示打开文件弹出框
 */
export function showOpenDialog(options) {
    return ipcInstance.send<Result>(channel.app.showOpenDialog, options)
}

export function showSaveDialog(options) {
    return ipcInstance.send<Result>(channel.app.showSaveDialog, options)
}

export function dataSourceTest(type: number, options) {
    return ipcInstance.send<Result>(channel.app.dataSource.dataSourceTest, type, options)
}
