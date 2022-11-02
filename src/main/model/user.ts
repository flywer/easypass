import {sequelize} from "@main/sequelize.init";
import {DataTypes} from "sequelize";
import {IPageVo} from "@main/vo/pageVo";

export interface IUserVo extends IPageVo {
    id?: string,
    name?: string,
    account?: string,
    password?: string,
    token?: string,
    mac?: string
}

/**
 * 系统用户model
 */
export let User
export const UserInit = () => {
    User = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: '主键ID'
        },
        name: {
            type: DataTypes.STRING(36),
            comment: '昵称'
        },
        account: {
            type: DataTypes.STRING(36),
            comment: '账号'
        },
        password: {
            type: DataTypes.STRING(256),
            comment: '密码'
        },
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: 'tokenIndex',
            comment: '用户唯一秘钥'
        },
        mac: {
            type: DataTypes.STRING(17),
            comment: '用户Mac地址'
        },
    }, {
        tableName: 'user',
        comment: '用户信息表'
    })
}
