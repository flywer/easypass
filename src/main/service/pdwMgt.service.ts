import {Injectable} from "einf";
import {pwdGroupMapper} from "@main/mapper/pwdGroup.mapper";

@Injectable()
export class PwdMgtService {
    constructor(private pwdGroupMapper: pwdGroupMapper) {
    }

    public getPwdGroupListByUserInfo(user: {}) {
        return this.pwdGroupMapper.getPwdGroupListByUserInfo(user);
    }
}
