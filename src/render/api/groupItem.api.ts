import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";

export function saveGroupItems(obj: {},groupId:string) {
    return ipcInstance.send(channel.groupItem.saveGroupItems, obj)
}

export function getGroupItemsListByPage(vo:{}) {
    return ipcInstance.send<{ rows: []; count: number }>(channel.groupItem.getGroupItemsListByPage, vo)
}
