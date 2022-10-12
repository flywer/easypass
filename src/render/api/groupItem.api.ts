import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";
import {Result} from "@main/vo/resultVo";

export function saveGroupItems(obj: {}, groupId: string) {
    return ipcInstance.send(channel.groupItem.saveGroupItems, obj, groupId)
}

export function getGroupItemsListByPage(vo: {}) {
    return ipcInstance.send<Result>(channel.groupItem.getGroupItemsListByPage, vo)
}

export function deleteGroupItemByItemId(itemId: string) {
    return ipcInstance.send<Result>(channel.groupItem.deleteGroupItemByItemId, itemId)
}
