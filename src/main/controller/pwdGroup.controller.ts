import {Controller, IpcHandle} from "einf";
import {PwdGroupService} from "@main/service/pwdGroup.service";
import {PwdGroup, PwdGroupVo} from "@main/model/pwdGroup";
import {GroupedCountResultItem} from "sequelize/types/model";
import {channel} from "@render/api/channel";

@Controller()
export class PwdGroupController {
    constructor(
        private pwdGroupService: PwdGroupService,
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
    public async handleSavePwdGroup(pwdGroup: typeof PwdGroup): Promise<typeof PwdGroup> {
        return await this.pwdGroupService.savePwdGroup(pwdGroup);
    }


}
