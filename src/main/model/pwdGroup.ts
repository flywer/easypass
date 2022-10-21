import {sequelize} from "@main/sequelize.init";
import {DataTypes} from "sequelize";
import {PageVo} from "@main/vo/pageVo";

/**
 * 密码组信息model
 */
export const PwdGroup = sequelize.define('group', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        comment: '主键ID'
    },
    name: {
        type: DataTypes.STRING(36),
        comment: '组名'
    },
    description: {
        type: DataTypes.STRING(128),
        comment: '描述'
    },
    groupIndex: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        comment: '排序号'
    },
    userId: {
        type: DataTypes.STRING,
        comment: '所属用户ID'
    }
}, {
    tableName: 'pwd_group',
    comment: '密码组信息表'
})

export class PwdGroupVo extends PageVo {
    id: string
    name: string
    groupIndex: number
    userId: string
}
