import {ipcInstance} from '@render/plugins'

export function getPwdGroupListByUserInfo(user: {}) {
    return ipcInstance.send<any[]>('pwdMgt/getPwdGroupListByUserInfo', user)
}

export function getPwdGroupListByUserInfoByPage(vo: {}) {
    return ipcInstance.send<{ rows: []; count: number }>('pwdMgt/getPwdGroupListByUserInfoByPage', vo)
}

export function getPwdGroupById(vo: {}) {
    return ipcInstance.send<{}>('pwdMgt/getPwdGroupById', vo)
}

export function savePwdGroup(obj: {}) {
    return ipcInstance.send('pwdMgt/savePwdGroup', obj)
}


