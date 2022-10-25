import {Controller, IpcHandle} from "einf";
import {GroupItemService} from "@main/service/groupItem.service";
import {channel} from "@render/api/channel";
import {failure, Result, success} from "@main/vo/resultVo";
import log from 'electron-log'

@Controller()
export class GroupItemController {
    constructor(private groupItemService: GroupItemService) {
    }

    /**
     * 新增保存组项信息
     * @param groupItems
     */
    @IpcHandle(channel.groupItem.saveOrUpdateGroupItems)
    public async handleSaveOrUpdateGroupItems(groupItems: any[], groupId: string, isUpdate: boolean) {
        let result
        try {
            for (const item of groupItems) {
                if (item.deleteTag) {
                    await this.groupItemService.deleteItemById(item.id)
                }
            }
            await this.groupItemService.saveOrUpdateGroupItems(groupItems.filter(item => item.deleteTag == false), groupId, isUpdate);
            result = success()
        } catch (e) {
            log.error(e)
            result = failure("系统异常")
            result.result = e
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
        let items;
        try {
            //获取账号组项ID列表
            let {rows, count} = await this.groupItemService.getItemsIdListByPage(vo)
            let itemGroupList = []
            for (const row of rows) {
                let itemGroup = await this.groupItemService.getItemsListByItemId(row.dataValues.itemId)
                itemGroupList.push(itemGroup)
            }
            result = success()
            result.result = {rows: itemGroupList, count: count}
        } catch (e) {
            if (e.code === 'ERR_CRYPTO_INVALID_IV') {
                log.error(e.code, "数据IV值异常！")
                result = failure("数据IV值异常")
            } else {
                log.error("系统异常")
                result = failure("系统异常")
            }
            result.result = null
        }
        return result
    }

    /**
     * 通过itemId获取组项信息
     * @param itemId
     */
    @IpcHandle(channel.groupItem.getItemsListByItemId)
    public async handleGetItemsListByItemId(itemId: string) {
        let result
        try {
            result = success()
            result.result = await this.groupItemService.getItemsListByItemId(itemId)
        } catch (e) {
            if (e.code === 'ERR_CRYPTO_INVALID_IV') {
                log.error(e.code, "数据IV值异常！")
                result = failure("数据IV值异常")
            } else {
                log.error("系统异常")
                result = failure("系统异常")
            }
            result.result = null
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
            log.error(e)
            result = failure("删除失败！系统异常")
            result.result = e
        }
        return result
    }

}
