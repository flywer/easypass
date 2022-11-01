import {Controller, IpcHandle} from "einf";
import {GroupItemService} from "@main/service/groupItem.service";
import {channel} from "@render/api/channel";
import {failure, Result, success} from "@main/vo/resultVo";
import log, {error} from 'electron-log'
import {GroupService} from "@main/service/group.service";
import {IGroupItemVo, itemTypeEnum} from "@main/model/groupItem";

@Controller()
export class GroupItemController {
    constructor(
        private groupItemService: GroupItemService,
        private groupService: GroupService
    ) {
    }

    /**
     * 新增保存组项信息
     * @param groupItems
     * @param groupId
     * @param isUpdate
     * @constructor
     */
    @IpcHandle(channel.groupItem.saveOrUpdateGroupItems)
    public async HandleSaveOrUpdateGroupItems(groupItems: any[], groupId: string, isUpdate: boolean) {
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
     * @param groupItemVo
     */
    @IpcHandle(channel.groupItem.getGroupItemsListByPage)
    public async HandleGetGroupItemsListByPage(groupItemVo) {
        groupItemVo = groupItemVo as IGroupItemVo
        let result
        try {
            if (groupItemVo.userId == null)
                throw new Error('NO_USER')

            const groupIdList = await this.groupService.getGroupIdByUserId(groupItemVo.userId)

            //获取账号组项ID列表
            let rows: any[]
            let count: number
            if (groupItemVo.value != null) {
                //模糊搜索
                let data = await this.groupItemService.getAllItemsTitleListByPage(groupItemVo, groupIdList)
                rows = data.rows
                count = data.count
            } else {
                let data = await this.groupItemService.getItemsIdListByPage(groupItemVo)
                rows = data.rows
                count = data.count
            }
            let itemGroupList = []
            for (const row of rows) {
                let itemGroup = await this.groupItemService.getItemsListByItemId(row.itemId)
                itemGroupList.push(itemGroup)
            }
            result = success()
            result.result = {rows: itemGroupList, count: count}
        } catch (e) {
            log.error(e.message)
            if (e.code === 'ERR_CRYPTO_INVALID_IV') {
                log.error(e.code, "数据IV值异常！")
                result = failure("数据IV值异常")
            } else if (e.message === 'NO_USER') {
                log.error(e.code, "登录状态异常！")
                result = failure("登录状态异常！")
            } else {
                log.error("系统异常")
                result = failure("系统异常")
            }
            result.result = null
        }
        return result
    }

    /**
     * 获取常用账号列表
     * @param groupItemVo
     * @constructor
     */
    @IpcHandle(channel.groupItem.getCommonGroupItemsListByPage)
    public async HandleGetCommonGroupItemsListByPage(groupItemVo) {
        groupItemVo = groupItemVo as IGroupItemVo
        let result
        try {
            if (groupItemVo.userId == null)
                throw error('NO_USER')

            const groupIdList = await this.groupService.getGroupIdByUserId(groupItemVo.userId)

            //获取常用账号标题项
            let rows: any[]
            let count: number
            if (groupItemVo.value != null) {
                //模糊搜索
                let data = await this.groupItemService.getAllItemsTitleListByPage(groupItemVo, groupIdList)
                rows = data.rows
                count = data.count
            } else {
                let data = await this.groupItemService.getCommonGroupItemsListByPage(groupItemVo, groupIdList)
                rows = data.rows
                count = data.count
            }
            let itemGroupList = []
            for (const row of rows) {
                let itemGroup = await this.groupItemService.getItemsListByItemId(row.itemId)
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
    public async HandleGetItemsListByItemId(itemId: string) {
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
    public async HandleDeleteGroupItemByItemId(itemId: string) {
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

    /**
     * 设置是否为常用账号
     * @param itemId
     * @param isCommon
     * @constructor
     */
    @IpcHandle(channel.groupItem.setGroupItemCommon)
    public async HandleSetGroupItemCommon(itemId: string, isCommon: string) {
        let result
        try {
            await this.groupItemService.setGroupItemCommon(itemId, isCommon)
            result = success()
        } catch (e) {
            log.error(e)
            result = failure("系统异常")
            result.result = e
        }
        return result
    }

    /**
     * 获取组项类型枚举值
     * @constructor
     */
    @IpcHandle(channel.groupItem.getItemTypeEnum)
    public HandleGetItemTypeEnum() {
        let result = success()
        result.result = itemTypeEnum
        return result
    }

}
