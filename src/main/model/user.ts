const {Sequelize, Model, DataTypes} = require('sequelize');
import {sequelize} from "@main/sequelize.init";

/**
 * 用户信息model
 */
export class User extends Model {
    declare id: string
    declare name: string
    declare token: string

    constructor(obj?: {
        id?: string,
        name?: string,
        token?: string,
    }) {
        super();
        this.id = obj.id
        this.name = obj.name
        this.token = obj.token
    }
}

/**
 * 初始化，注册为sequelize模型
 */
export const userInit = () => {
    User.init({
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
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: 'tokenIndex',
            comment: '用户唯一秘钥'
        }
    }, {
        sequelize,
        tableName: 'sys_user',
        comment: '用户信息表'
    })
}
