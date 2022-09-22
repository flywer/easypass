const {Sequelize, Model, DataTypes} = require('sequelize');
import {sequelize} from "@main/mysql";

/**
 * 用户信息类
 */
export const User = sequelize.define('User', {
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
    tableName: 'sys_user',
});


