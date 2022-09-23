import {ipcInstance} from '@render/plugins'
import {PwdGroup} from "@main/model/pwdGroup";

export function getPwdGroupListByUserInfo(user: {}) {
    return ipcInstance.send<any[]>('pwdMgt/getPwdGroupListByUserInfo', user)
}

export function savePwdGroup(obj: {}) {
    return ipcInstance.send('pwdMgt/savePwdGroup', obj)
}
