import {Controller, IpcHandle} from "einf";
import {PwdMgtService} from "@main/service/pdwMgt.service";
import {PwdGroup} from "@main/model/pwdGroup";

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

    @IpcHandle('pwdMgt/savePwdGroup')
    public async handleSavePwdGroup(pwdGroup: PwdGroup): Promise<PwdGroup> {
        return await this.pwdMgtService.savePwdGroup(pwdGroup);
    }
}
