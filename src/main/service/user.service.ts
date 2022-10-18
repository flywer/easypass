import {Injectable} from 'einf'
import {UserMapper} from "@main/mapper/user.mapper";

@Injectable()
export class UserService {
    constructor(private userMapper: UserMapper) {

    }

    public async getUserByMac(mac: any) {
        return await this.userMapper.getUserByMac(mac)
    }
}
