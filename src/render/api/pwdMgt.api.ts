import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";
import {Result} from "@main/vo/resultVo";

export function getPwdGroupListByUserInfo(user: {}) {
    return ipcInstance.send<any[]>(channel.pwdGroup.getPwdGroupListByUserInfo, user)
}

export function getPwdGroupListByUserInfoByPage(vo: {}) {
    return ipcInstance.send<{ rows: []; count: number }>(channel.pwdGroup.getPwdGroupListByUserInfoByPage, vo)
}

export function getPwdGroupById(vo: {}) {
    return ipcInstance.send<{}>(channel.pwdGroup.getPwdGroupById, vo)
}

export function savePwdGroup(obj: {}) {
    return ipcInstance.send(channel.pwdGroup.savePwdGroup, obj)
}

export function updatePwdGroup(obj: {}) {
    return ipcInstance.send(channel.pwdGroup.updatePwdGroup, obj)
}

export function deleteGroupById(itemId: string) {
    return ipcInstance.send<Result>(channel.pwdGroup.deleteGroupById, itemId)
}


