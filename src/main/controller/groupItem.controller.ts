import {Controller, IpcHandle} from "einf";
import {GroupItemService} from "@main/service/groupItem.service";
import {PwdGroup} from "@main/model/pwdGroup";
import {GroupItem} from "@main/model/groupItem";
import {channel} from "@render/api/channel";

@Controller()
export class GroupItemController {
    constructor(private groupItemService: GroupItemService) {
    }

    /**
     * 新增保存组项信息
     * @param groupItems
     */
    @IpcHandle(channel.groupItem.saveGroupItems)
    public handleSaveGroupItems(groupItems: typeof GroupItem[],groupId) {
        let result
        try {
            result = this.groupItemService.saveGroupItems(groupItems,groupId);
        } catch (e) {
            throw new Error(e)
        }
        return result
    }

    @IpcHandle(channel.groupItem.getGroupItemsListByPage)
    public handleGetGroupItemsListByPage(vo) {
        let result
        try {
            result = this.groupItemService.getGroupItemsList(vo)
        } catch (e) {

        }
        return result
    }

}
