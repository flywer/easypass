import {Injectable} from "einf";
import {SysUser} from "@main/model/sysUser";
import {sequelize} from "@main/sequelize.init";
import {PwdGroup} from "@main/model/pwdGroup";

@Injectable()
export class UserMapper {
    constructor() {
    }

    public async getUserByMac(mac: any) {
        return await SysUser.findAll({
            where: {
                mac: mac
            }
        })
    }

    public async register(userVo: typeof SysUser) {
        return await SysUser.create({
            name: userVo.name,
            password: userVo.password,
            account: userVo.account,
            mac: userVo.mac,
            mode: userVo.mode
        })
    }

    public async getUserByAccountLogin(user) {
        return Promise.resolve(SysUser.findOne({
            where: {
                account: user.account,
                password: user.password
            }
        }));
    }

    public async deleteUserById(id) {
        await SysUser.destroy({
            where: {
                id: id
            }
        })
    }

    public async updateUserInfoByUserId(vo) {
        await SysUser.update(vo, {
            where: {
                id: vo.id
            }
        })
    }

    public async getUserById(id) {
        return await SysUser.findOne({
            where: {
                id: id
            }
        })
    }
}
