import {Injectable} from "einf";
import {PwdGroupMapper} from "@main/mapper/pwd-group-mapper.service";
import {PwdGroup, PwdGroupVo} from "@main/model/pwdGroup";

@Injectable()
export class PwdGroupService {
    constructor(private pwdGroupMapper: PwdGroupMapper) {
    }

    /**
     * 通过人员信息查询全部信息
     * @param user
     */
    public getPwdGroupListByUserInfo(user) {
        return this.pwdGroupMapper.getPwdGroupListByUserInfo(user);
    }

    /**
     * 通过人员ID查询组ID
     * @param userId
     */
    public async getPwdGroupIdByUserId(userId) {
        return (await this.pwdGroupMapper.getPwdGroupIdByUserId(userId)).map(item=>item.dataValues.id)
    }

    public getPwdGroupListByUserInfoByPage(vo) {
        return this.pwdGroupMapper.getPwdGroupListByUserInfoByPage(vo);
    }

    public async savePwdGroup(pwdGroup: typeof PwdGroup) {
        await this.pwdGroupMapper.savePwdGroup(pwdGroup)
    }

    public async updatePwdGroup(pwdGroup: typeof PwdGroup) {
        await this.pwdGroupMapper.updatePwdGroup(pwdGroup)
    }

    public getPwdGroupById(groupId: string) {
        return this.pwdGroupMapper.getPwdGroupById(groupId);
    }

    public async deleteGroupById(id) {
        await this.pwdGroupMapper.deleteGroupById(id)
    }


}
