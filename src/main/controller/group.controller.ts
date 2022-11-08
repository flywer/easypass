import {Controller, IpcHandle} from "einf";
import {GroupService} from "@main/service/group.service";
import {channel} from "@render/api/channel";
import {success, failure} from "@main/vo/resultVo";
import {GroupItemService} from "@main/service/groupItem.service";
import log from 'electron-log'
import {findIcon} from "@common/utils/findIcon";

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
            result = failure("更新失败！")
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
}
