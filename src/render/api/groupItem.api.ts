import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";

export function saveGroupItems(obj: {}) {
    return ipcInstance.send(channel.groupItem.saveGroupItems, obj)
}
