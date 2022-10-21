import {Injectable} from 'einf'
import {UserMapper} from "@main/mapper/user.mapper";

@Injectable()
export class UserService {
    constructor(private userMapper: UserMapper) {
    }

    public async getUserByMac(mac: any) {
        return await this.userMapper.getUserByMac(mac)
    }

    public async register(userVo) {
        return await this.userMapper.register(userVo)
    }

    public async login(user) {
        return await this.userMapper.getUserByAccountLogin(user)
    }

    public async deleteUserById(id) {
        await this.userMapper.deleteUserById(id)
    }

    public async updateUserInfoByUserId(vo) {
        await this.userMapper.updateUserInfoByUserId(vo)
    }

    public async getUserById(id) {
        return  await this.userMapper.getUserById(id)
    }
}
