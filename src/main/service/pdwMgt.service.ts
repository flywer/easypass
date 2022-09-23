import {Injectable} from "einf";
import {pwdGroupMapper} from "@main/mapper/pwdGroup.mapper";
import {PwdGroup} from "@main/model/pwdGroup";

@Injectable()
export class PwdMgtService {
    constructor(private pwdGroupMapper: pwdGroupMapper) {
    }

    public getPwdGroupListByUserInfo(user: {}) {
        return this.pwdGroupMapper.getPwdGroupListByUserInfo(user);
    }

    public async savePwdGroup(pwdGroup: PwdGroup): Promise<PwdGroup> {
        return await this.pwdGroupMapper.savePwdGroup(pwdGroup)
    }
}
