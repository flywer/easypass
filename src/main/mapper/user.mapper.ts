import {Injectable} from "einf";
import {SysUser} from "@main/model/sysUser";

@Injectable()
export class UserMapper {
    constructor() {
    }

    public async getUserByMac(mac: any) {
        const row = await SysUser.findAll({
            attributes: ['id'],
            where: {
                mac: mac
            }
        })
        return row
    }
}
