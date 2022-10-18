import {sequelize} from "@main/sequelize.init";
import {DataTypes} from "sequelize";

/**
 * 系统用户model
 */
export const SysUser = sequelize.define('sysUser', {
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
    },
    mac: {
        type: DataTypes.STRING(17),
        defaultValue: null,
        comment: '用户Mac地址'
    }
}, {
    tableName: 'sys_user',
    comment: '用户信息表'
})
