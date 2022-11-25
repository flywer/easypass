import {Injectable} from 'einf'
import {UserMapper} from "@main/mapper/user.mapper";
import {accountEncrypt} from "@common/utils/cryptoUtils";
import {IUserVo} from "@main/model/user";

@Injectable()
export class UserService {
    constructor(private userMapper: UserMapper) {
    }

    public async getUserByMac(mac: string) {
        return (await this.userMapper.getUserByMac(mac)).map(item => item.dataValues)
    }

    public async register(userVo: IUserVo) {
        userVo.password = accountEncrypt(userVo.password)
        return await this.userMapper.register(userVo)
    }

    /**
     * 登录
     * @param userVo
     * @param isAuto 是否为系统读取本地信息自动登录
     */
    public async login(userVo: IUserVo, isAuto: boolean) {
        if (!isAuto)//加密
            userVo.password = accountEncrypt(userVo.password)
        return (await this.userMapper.getUserByAccountLogin(userVo))?.dataValues
    }

    public async getUserById(userId: string) {
        return (await this.userMapper.getUserById(userId))?.dataValues
    }

    public async updateUserInfoByUserId(user: IUserVo) {
        if (user.password != null)
            user.password = accountEncrypt(user.password)
        await this.userMapper.updateUserInfoByUserId(user)
    }

    public async deleteUserById(userId: string) {
        await this.userMapper.deleteUserById(userId)
    }

    /**
     * 校验注册时信息检查，true为通过，false为不通过
     * @param userVo
     */
    public async registerCheck(userVo) {
        let res = (await this.userMapper.getUserByAccount(userVo));
        return res.length <= 0;
    }
}
