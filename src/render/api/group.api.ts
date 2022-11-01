import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";
import {Result} from "@main/vo/resultVo";
import {IUserVo} from "@main/model/user";

export function getGroupListByUserInfo(user: IUserVo) {
    return ipcInstance.send<Result>(channel.group.getGroupListByUserInfo, user)
}

export function getGroupListByUserInfoByPage(vo) {
    return ipcInstance.send<Result>(channel.group.getGroupListByUserInfoByPage, vo)
}

export function getGroupById(vo) {
    return ipcInstance.send<Result>(channel.group.getGroupById, vo)
}

export function saveGroup(vo) {
    return ipcInstance.send(channel.group.saveGroup, vo)
}

export function updateGroup(vo) {
    return ipcInstance.send(channel.group.updateGroup, vo)
}

export function saveOrUpdateGroup(vo) {
    return ipcInstance.send(channel.group.saveOrUpdateGroup, vo)
}

export function deleteGroupById(itemId: string) {
    return ipcInstance.send<Result>(channel.group.deleteGroupById, itemId)
}

