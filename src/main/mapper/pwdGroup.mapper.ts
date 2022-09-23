import {Injectable} from "einf";
import {PwdGroup} from "@main/model/pwdGroup";
import {sequelize} from "@main/sequelize.init";


@Injectable()
export class pwdGroupMapper {
    constructor() {
    }

    public getPwdGroupListByUserInfo(user: {}) {
        try {
            return PwdGroup.findAll({
                order: ['groupIndex']
            }).then(res => {
                return res
            })
        } catch (error) {
            return null
        }
    }

    public async savePwdGroup(pwdGroup: PwdGroup): Promise<PwdGroup> {
        try {
            return await sequelize.transaction((t) => {
                return PwdGroup.create(pwdGroup)
            })
        } catch (error) {
            return null
        }
    }
}
