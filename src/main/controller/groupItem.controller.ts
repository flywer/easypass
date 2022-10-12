import {Controller, IpcHandle} from "einf";
import {GroupItemService} from "@main/service/groupItem.service";
import {GroupItem} from "@main/model/groupItem";
import {channel} from "@render/api/channel";
import {failure, Result, success} from "@main/vo/resultVo";

@Controller()
export class GroupItemController {
    constructor(private groupItemService: GroupItemService) {
    }

    /**
     * 新增保存组项信息
     * @param groupItems
     */
    @IpcHandle(channel.groupItem.saveGroupItems)
    public handleSaveGroupItems(groupItems: typeof GroupItem[], groupId: string) {
        let result
        try {
            result = this.groupItemService.saveGroupItems(groupItems, groupId);
        } catch (e) {
            throw new Error(e)
        }
        return result
    }

    /**
     * 获取标题信息列表
     * @param vo
     */
    @IpcHandle(channel.groupItem.getGroupItemsListByPage)
    public async handleGetGroupItemsListByPage(vo) {
        let result
        try {
            //获取账号组项ID列表
            let {rows, count} = await this.groupItemService.getItemsIdListByPage(vo)
            let itemGroupList = []
            for (const row of rows) {
                let itemGroup = await this.groupItemService.getItemsByItemId(row.dataValues.itemId)
                itemGroupList.push(itemGroup)
            }
            result = success()
            result.result = {rows: itemGroupList, count: count}
        } catch (e) {
            console.error(e)
            result = failure("系统异常")
            result.result = e
        }
        return result
    }

    /**
     * 删除账号组
     * @param itemId
     */
    @IpcHandle(channel.groupItem.deleteGroupItemByItemId)
    public async handleDeleteGroupItemByItemId(itemId: string) {
        let result
        try {
            await this.groupItemService.deleteGroupItemByItemId(itemId)
            result = success()
        } catch (e) {
            console.error(e)
            result = failure("删除失败！系统异常")
            result.result = e
        }
        return result
    }
}
