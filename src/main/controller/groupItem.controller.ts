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
    public handleSaveGroupItems(groupItems: typeof GroupItem[]) {
        try {
            return this.groupItemService.saveGroupItems(groupItems);
        } catch (e) {
            throw new Error(e)
        }
    }


}
