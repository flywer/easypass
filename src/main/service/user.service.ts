import {Injectable} from 'einf'
import {UserMapper} from "@main/mapper/user.mapper";
import {accountEnCrypt} from "@common/utils/cryptoUtils";
import {IUserVo} from "@main/model/user";

@Injectable()
export class UserService {
    constructor(private userMapper: UserMapper) {
    }

    public async getUserByMac(mac: string) {
        return (await this.userMapper.getUserByMac(mac)).map(item => item.dataValues)
    }

    public async register(userVo: IUserVo) {
        userVo.password = accountEnCrypt(userVo.password)
        return await this.userMapper.register(userVo)
    }

    /**
     * 登录
     * @param userVo
     * @param isAuto 是否为系统读取本地信息自动登录
     */
    public async login(userVo: IUserVo, isAuto: boolean) {
        if (!isAuto)//加密
            userVo.password = accountEnCrypt(userVo.password)
        return (await this.userMapper.getUserByAccountLogin(userVo)).dataValues
    }

    public async getUserById(userId: string) {
        return (await this.userMapper.getUserById(userId)).dataValues
    }

    public async updateUserInfoByUserId(user: IUserVo) {
        if (user.password != null)
            user.password = accountEnCrypt(user.password)
        await this.userMapper.updateUserInfoByUserId(user)
    }

    public async deleteUserById(userId: string) {
        await this.userMapper.deleteUserById(userId)
    }


}
