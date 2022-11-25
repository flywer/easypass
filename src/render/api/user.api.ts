import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";
import {Result} from "@main/vo/resultVo";

/**
 * 当前Mac地址是否注册
 */
export function getUserByMac() {
    return ipcInstance.send<Result>(channel.user.getUserByMac)
}

/**
 * 注册
 * @param userVo
 */
export function register(userVo) {
    return ipcInstance.send<Result>(channel.user.register, userVo)
}

/**
 * 注册时检查操作
 * @param userVo
 */
export function registerCheck(userVo) {
    return ipcInstance.send<Result>(channel.user.registerCheck, userVo)
}

/**
 * 登录
 * @param userVo
 */
export function login(userVo) {
    return ipcInstance.send<Result>(channel.user.login, userVo)
}

/**
 * 检查本地是否有账号
 */
export function checkLogin() {
    return ipcInstance.send<Result>(channel.user.checkLogin)
}

/**
 * 退出账号
 */
export function logout() {
    return ipcInstance.send<Result>(channel.user.logout)
}

/**
 * 注销
 */
export function cancellation(vo) {
    return ipcInstance.send<Result>(channel.user.cancellation, vo)
}

/**
 * 更新用户信息
 * @param vo
 */
export function updateUserInfoByUserId(vo) {
    return ipcInstance.send<Result>(channel.user.updateUserInfoByUserId, vo)
}


export function checkPassword(vo) {
    return ipcInstance.send<Result>(channel.user.checkPassword, vo)
}

