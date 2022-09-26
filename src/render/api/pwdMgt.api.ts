import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";

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


