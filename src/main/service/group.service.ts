import {Injectable} from "einf";
import {GroupMapper} from "@main/mapper/group.mapper";
import {IUserVo} from "@main/model/user";
import {IGroupVo} from "@main/model/group";

@Injectable()
export class GroupService {
    constructor(private groupMapper: GroupMapper) {
    }

    public async getGroupListByUserInfo(user: IUserVo) {
        return (await this.groupMapper.getGroupListByUserId(user)).map(item => item.dataValues);
    }

    public async getGroupIdByUserId(userId: string) {
        return (await this.groupMapper.getGroupListByUserId({id: userId})).map(item => item.dataValues.id)
    }

    public async getGroupListByUserInfoByPage(group: IGroupVo) {
        const data = await this.groupMapper.getGroupListByUserInfoByPage(group)
        return {
            rows: data.rows.map(row => row.dataValues),
            count: data.count
        }
    }

    public async getGroupById(groupId: string) {
        return (await this.groupMapper.getGroupById(groupId)).map(item => item.dataValues);
    }

    public async saveGroup(group: IGroupVo) {
        await this.groupMapper.saveGroup(group)
    }

    public async updateGroup(group: IGroupVo) {
        await this.groupMapper.updateGroup(group)
    }


    public async deleteGroupById(groupId: string) {
        await this.groupMapper.deleteGroupById(groupId)
    }
}
