import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";

export function saveGroupItem(obj: {}) {
    return ipcInstance.send(channel.groupItem.saveGroupItem, obj)
}
