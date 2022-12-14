import {Injectable} from "einf";
import {IUserVo, User} from "@main/model/user";

@Injectable()
export class UserMapper {
    constructor() {
    }

    public async getUserByMac(mac: string) {
        return await User.findAll({
            where: {
                mac: mac
            }
        })
    }

    public async register(user: IUserVo) {
        return await User.create({
            name: user.name,
            password: user.password,
            account: user.account,
            mac: user.mac
        })
    }

    public async getUserByAccountLogin(user: IUserVo) {
        return await User.findOne({
            where: {
                account: user.account,
                password: user.password
            }
        })
    }

    public async getUserByAccount(user: IUserVo) {
        return await User.findAll({
            where: {
                account: user.account
            }
        })
    }

    public async deleteUserById(userId: string) {
        await User.destroy({
            where: {
                id: userId
            }
        })
    }

    public async updateUserInfoByUserId(user: IUserVo) {
        await User.update(user, {
            where: {
                id: user.id
            }
        })
    }

    public async getUserById(userId: string) {
        return await User.findOne({
            where: {
                id: userId
            }
        })
    }
}
