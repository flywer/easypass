import {Controller, IpcHandle} from "einf";
import {GroupService} from "@main/service/group.service";
import {channel} from "@render/api/channel";
import {success, failure} from "@main/vo/resultVo";
import {GroupItemService} from "@main/service/groupItem.service";
import log from 'electron-log'
import {findIcon} from "@common/utils/findIcon";
import {isEqual} from "lodash";
import {itemTypeEnum} from "@main/model/groupItem";
import {jsonfileWrite} from "@common/utils/fsUtils";
import {dialog} from "electron";

@Controller()
export class GroupController {
    constructor(
        private groupService: GroupService,
        private groupItemService: GroupItemService
    ) {
    }

    /**
     * 通过用户信息获取密码分组信息
     * @param user
     */
    @IpcHandle(channel.group.getGroupListByUserInfo)
    public async handleGetGroupListByUserInfo(user) {
        let result
        try {
            result = success()
            result.result = await this.groupService.getGroupListByUserInfo(user)
        } catch (error) {
            log.error(error)
            result = failure()
        }
        return result
    }

    /**
     * 通过分组名、用户ID分页获取密码分组信息
     * @param group
     */
    @IpcHandle(channel.group.getGroupListByUserInfoByPage)
    public async handleGetGroupListByUserInfoByPage(group) {
        let result
        try {
            let {rows, count} = await this.groupService.getGroupListByUserInfoByPage(group)
            result = success()
            result.result = {rows: rows, count: count}
        } catch (error) {
            console.log(error.code)
            log.error(error)
            result = failure()
        }
        return result
    }

    /**
     * 通过分组ID获取密码分组信息
     * @param groupId
     */
    @IpcHandle(channel.group.getGroupById)
    public handleGetGroupById(groupId: string) {
        let result
        try {
            result = success()
            result.result = this.groupService.getGroupById(groupId)
        } catch (error) {
            log.error(error)
            result = failure()
        }
        return result
    }

    /**
     * 新增保存分组信息
     * @param group
     */
    @IpcHandle(channel.group.saveGroup)
    public async handleSaveGroup(group) {
        let result
        try {
            //若ID为null移除此属性，否则会报错
            if (group.id == null)
                delete group.id
            await this.groupService.saveGroup(group)
            result = success("新增成功！")
        } catch (e) {
            log.error(e)
            result = failure("新增失败！")
        }
        return result
    }

    /**
     * 更新密码组信息
     * @param group
     */
    @IpcHandle(channel.group.updateGroup)
    public async handleUpdateGroup(group) {
        let result
        try {
            await this.groupService.updateGroup(group)
            result = success("更新成功！")
        } catch (error) {
            log.log(error)
            result = failure("更新失败！")
            result.result = error
        }
        return result
    }

    /**
     * 删除密码组以及其下的账号组
     * @param groupId
     */
    @IpcHandle(channel.group.deleteGroupById)
    public async handleDeleteGroupById(groupId: string) {
        let result
        try {
            await this.groupItemService.deleteGroupItemsByGroupId(groupId)
            await this.groupService.deleteGroupById(groupId)
            result = success()
        } catch (e) {
            log.error(e)
            result = failure("删除失败！")
        }
        return result
    }

    /**
     * 通过标题查询图标
     * @param title
     * @param number
     * @constructor
     */
    @IpcHandle(channel.group.findIcon)
    public async HandleFindIcon(title: string, number: number) {
        let result
        try {
            result = success()
            result.result = await findIcon(title, number)
        } catch (e) {
            log.error(e)
            result = failure("图标查询失败！")
        }
        return result
    }

    /**
     * 根据组导出账号组
     * @param groupIds
     * @param isSimple 是否仅导出KV值（name,value），否则根据原数据格式导出，便于数据再次导入
     * @constructor
     */
    @IpcHandle(channel.group.exportByGroupIds)
    public async HandleExportByGroupIds(groupIds: [], isSimple: boolean) {
        let result
        try {
            result = success()
            let groupJson = []
            const groupData = await this.groupService.getGroupById(groupIds)
            for (const group of groupData) {
                /*获取这个组中组项ID列表*/
                let itemIdList = await this.groupItemService.getItemsIdListByGroupId(group.id)
                //账号组格式
                let accountList = []
                for (const id of itemIdList) {
                    //通过itemId去获取每个组项信息
                    let items = await this.groupItemService.getItemsListByItemId(id.itemId)
                    let account = {
                        title: '',
                        itemsList: [],
                        isCommon: 0
                    }
                    items.forEach(item => {
                        if (isEqual(item.type, itemTypeEnum.title)) {
                            account.title = item.value
                            account.isCommon = item.isCommon
                        } else {
                            let i = {
                                name: item.name,
                                value: item.value,
                                type: item.type
                            }
                            account.itemsList.push(i)
                        }
                    })
                    accountList.push(account)
                }
                let g = {
                    name: group.name,
                    description: group.description,
                    accountList: accountList
                }
                groupJson.push(g)
            }
            await dialog.showSaveDialog({
                title: '导出至',
                defaultPath: '账号列表',
                filters: [
                    {name: 'Json', extensions: ['json']},
                ]
            }).then(res => {
                if (!res.canceled) {
                    jsonfileWrite(res.filePath, groupJson, {spaces: 2})
                    result.message = '导出成功！'
                    result.tag = 1
                } else {
                    result.tag = 2
                }
            })
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

}
