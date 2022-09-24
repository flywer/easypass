import {BaseVo} from "@main/model/baseVo";

const {Sequelize, Model, DataTypes} = require('sequelize');
import {sequelize} from "@main/sequelize.init";

/**
 * 密码组信息model
 */
export class PwdGroup extends Model {
    declare id: string
    declare name: string
    declare groupIndex: number

    constructor(obj?: {
        id?: string,
        name?: string,
        groupIndex?: number
    }) {
        super();
        this.id = obj.id
        this.name = obj.name
        this.groupIndex = obj.groupIndex
    }
}

export class PwdGroupVo extends BaseVo {
    id: StringConstructor
    name: StringConstructor
    groupIndex: number
    userId: string
}

/**
 * 初始化，注册为sequelize模型
 */
export const pwdGroupInit = () => {
    PwdGroup.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: '主键ID',
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
        sequelize,
        tableName: 'pwd_group',
        comment: '密码组信息表'
    })
}


