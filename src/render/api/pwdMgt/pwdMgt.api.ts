import {ipcInstance} from '@render/plugins'

export function getPwdGroupListByUserInfo(user: {}) {
    return ipcInstance.send<[]>('pwdMgt/getPwdGroupListByUserInfo', user)
}
