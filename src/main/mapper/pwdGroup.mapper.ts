import {Injectable} from "einf";
import {PwdGroup} from "@main/model/pwdGroup";


@Injectable()
export class pwdGroupMapper {
    constructor() {
    }

    public getPwdGroupListByUserInfo(user: {}) {
        return PwdGroup.findAll().then(res=>{
            return res
        })
    }
}
