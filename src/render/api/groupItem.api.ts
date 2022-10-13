import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";
import {Result} from "@main/vo/resultVo";
import {GroupItem} from "@main/model/groupItem";

export function saveOrUpdateGroupItems(obj: any[], groupId: string, isUpdate: boolean) {
    return ipcInstance.send<Result>(channel.groupItem.saveOrUpdateGroupItems, obj, groupId, isUpdate)
}

export function getGroupItemsListByPage(vo: {}) {
    return ipcInstance.send<Result>(channel.groupItem.getGroupItemsListByPage, vo)
}

export function deleteGroupItemByItemId(itemId: string) {
    return ipcInstance.send<Result>(channel.groupItem.deleteGroupItemByItemId, itemId)
}

export function getItemsListByItemId(itemId: string) {
    return ipcInstance.send<Result>(channel.groupItem.getItemsListByItemId, itemId)
}
