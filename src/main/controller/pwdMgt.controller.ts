import {Controller, IpcHandle} from "einf";
import {PwdMgtService} from "@main/service/pdwMgt.service";
import {PwdGroup, PwdGroupVo} from "@main/model/pwdGroup";
import {GroupedCountResultItem} from "sequelize/types/model";

@Controller()
export class PwdMgtController {
    constructor(
        private pwdMgtService: PwdMgtService,
    ) {
    }

    /**
     * 通过用户信息获取密码分组信息
     * @param user
     */
    @IpcHandle('pwdMgt/getPwdGroupListByUserInfo')
    public handleGetPwdGroupListByUserInfo(user: {}): Promise<PwdGroup[]> {
        return this.pwdMgtService.getPwdGroupListByUserInfo(user)
    }

    /**
     * 通过分组名、用户信息分页获取密码分组信息
     * @param vo
     */
    @IpcHandle('pwdMgt/getPwdGroupListByUserInfoByPage')
    public handleGetPwdGroupListByUserInfoByPage(vo: PwdGroupVo): Promise<{ rows: []; count: GroupedCountResultItem[] }> {
        return this.pwdMgtService.getPwdGroupListByUserInfoByPage(vo)
    }

    /**
     * 新增保存分组信息
     * @param pwdGroup
     */
    @IpcHandle('pwdMgt/savePwdGroup')
    public async handleSavePwdGroup(pwdGroup: PwdGroup): Promise<PwdGroup> {
        return await this.pwdMgtService.savePwdGroup(pwdGroup);
    }


}
