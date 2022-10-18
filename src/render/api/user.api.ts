import {ipcInstance} from '@render/plugins'
import {channel} from "@render/api/channel";
import {Result} from "@main/vo/resultVo";


/**
 * 当前Mac地址是否注册
 */
export function getMacExist() {
    return ipcInstance.send<Result>(channel.user.getMacExist)
}
