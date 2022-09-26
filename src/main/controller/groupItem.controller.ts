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
     * @param groupItem
     */
    @IpcHandle(channel.groupItem.saveGroupItem)
    public handleSaveOrUpdatePwdGroup(groupItem: typeof GroupItem) {
        try {
            return this.groupItemService.saveGroupItem(groupItem);
        } catch (e) {
            throw new Error(e)
        }
    }


}
