const {Sequelize, Model, DataTypes} = require('sequelize');
import {sequelize} from "@main/mysql";

export const PwdGroup = sequelize.define('PwdGroup', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: '主键ID'
    },
    name: {
        type: DataTypes.STRING(36),
        comment: '组名'
    },
    groupIndex: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        comment: '排序号'
    }
}, {
    tableName: 'pwd_group'
})
