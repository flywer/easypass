import {Controller, IpcHandle} from "einf";
import {PwdGroupService} from "@main/service/pwdGroup.service";
import {PwdGroup, PwdGroupVo} from "@main/model/pwdGroup";
import {GroupedCountResultItem} from "sequelize/types/model";
import {channel} from "@render/api/channel";
import {success, Result, failure} from "@main/vo/resultVo";
import {GroupItemService} from "@main/service/groupItem.service";

@Controller()
export class PwdGroupController {
    constructor(
        private pwdGroupService: PwdGroupService,
        private groupItemService: GroupItemService
    ) {
    }

    /**
     * 通过用户信息获取密码分组信息
     * @param user
     */
    @IpcHandle(channel.pwdGroup.getPwdGroupListByUserInfo)
    public handleGetPwdGroupListByUserInfo(user: {}): Promise<typeof PwdGroup[]> {
        return this.pwdGroupService.getPwdGroupListByUserInfo(user)
    }

    /**
     * 通过分组名、用户信息分页获取密码分组信息
     * @param vo
     */
    @IpcHandle(channel.pwdGroup.getPwdGroupListByUserInfoByPage)
    public handleGetPwdGroupListByUserInfoByPage(vo: PwdGroupVo): Promise<{ rows: []; count: GroupedCountResultItem[] }> {
        return this.pwdGroupService.getPwdGroupListByUserInfoByPage(vo)
    }

    /**
     * 通过分组ID获取密码分组信息
     * @param groupId
     */
    @IpcHandle(channel.pwdGroup.getPwdGroupById)
    public handleGetPwdGroupById(groupId: string): Promise<typeof PwdGroup> {
        return this.pwdGroupService.getPwdGroupById(groupId)
    }

    /**
     * 新增保存分组信息
     * @param pwdGroup
     */
    @IpcHandle(channel.pwdGroup.savePwdGroup)
    public async handleSavePwdGroup(pwdGroup: typeof PwdGroup): Promise<Result> {
        //若ID为null移除此属性，否则会报错
        if (pwdGroup.id == null)
            delete pwdGroup.id
        let result
        try {
            await this.pwdGroupService.savePwdGroup(pwdGroup)
            result = success("新增成功！")
        } catch (e) {
            console.error(e)
            result = failure("更新失败！")
            result.result = e
        }
        return result
    }

    /**
     * 更新密码组信息
     * @param pwdGroup
     */
    @IpcHandle(channel.pwdGroup.updatePwdGroup)
    public async handleUpdatePwdGroup(pwdGroup: typeof PwdGroup): Promise<Result> {
        let result
        try {
            await this.pwdGroupService.updatePwdGroup(pwdGroup)
            result = success("更新成功！")
        } catch (error) {
            console.log(error)
            result = failure("更新失败！")
            result.result = error
        }
        return result
    }

    /**
     * 删除密码组以及其下的账号组
     * @param id
     */
    @IpcHandle(channel.pwdGroup.deleteGroupById)
    public async handleDeleteGroupItemByItemId(id: string) {
        let result
        try {
            await this.groupItemService.deleteGroupItemByGroupId(id)
            await this.pwdGroupService.deleteGroupById(id)
            result = success()
        } catch (e) {
            console.error(e)
            result = failure("删除失败！系统异常")
            result.result = e
        }
        return result
    }
}
