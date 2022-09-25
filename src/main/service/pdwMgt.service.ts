import {Injectable} from "einf";
import {pwdGroupMapper} from "@main/mapper/pwdGroup.mapper";
import {PwdGroup, PwdGroupVo} from "@main/model/pwdGroup";

@Injectable()
export class PwdMgtService {
    constructor(private pwdGroupMapper: pwdGroupMapper) {
    }

    public getPwdGroupListByUserInfo(user: {}) {
        return this.pwdGroupMapper.getPwdGroupListByUserInfo(user);
    }

    public getPwdGroupListByUserInfoByPage(vo: PwdGroupVo) {
        return this.pwdGroupMapper.getPwdGroupListByUserInfoByPage(vo);
    }

    public async savePwdGroup(pwdGroup: PwdGroup): Promise<PwdGroup> {
        return await this.pwdGroupMapper.savePwdGroup(pwdGroup)
    }

    public getPwdGroupById(groupId: string) {
        return this.pwdGroupMapper.getPwdGroupById(groupId);
    }
}
