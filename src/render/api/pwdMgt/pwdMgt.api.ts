import {ipcInstance} from '@render/plugins'
import {PwdGroup} from "@main/model/pwdGroup";
import {BaseVo} from "@main/model/baseVo";
import {GroupedCountResultItem} from "sequelize/types/model";

export function getPwdGroupListByUserInfo(user: {}) {
    return ipcInstance.send<any[]>('pwdMgt/getPwdGroupListByUserInfo', user)
}

export function getPwdGroupListByUserInfoByPage(vo: {}) {
    return ipcInstance.send<{ rows: []; count: number }>('pwdMgt/getPwdGroupListByUserInfoByPage', vo)
}

export function savePwdGroup(obj: {}) {
    return ipcInstance.send('pwdMgt/savePwdGroup', obj)
}


