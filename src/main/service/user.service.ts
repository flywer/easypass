import {Injectable} from 'einf'
import {UserMapper} from "@main/mapper/user.mapper";
import {accountDecrypt, accountEnCrypt} from "@common/utils/cryptoUtils";

@Injectable()
export class UserService {
    constructor(private userMapper: UserMapper) {
    }

    public async getUserByMac(mac: any) {
        return await this.userMapper.getUserByMac(mac)
    }

    public async register(userVo) {
        userVo.password = accountEnCrypt(userVo.password)
        return await this.userMapper.register(userVo)
    }

    public async login(userVo) {
        userVo.password = accountEnCrypt(userVo.password)
        return await this.userMapper.getUserByAccountLogin(userVo)
    }

    public async deleteUserById(id) {
        await this.userMapper.deleteUserById(id)
    }

    public async updateUserInfoByUserId(userVo) {
        if (userVo.password != null)
            userVo.password = accountEnCrypt(userVo.password)
        await this.userMapper.updateUserInfoByUserId(userVo)
    }

    public async getUserById(id) {
        return await this.userMapper.getUserById(id)
    }


}
