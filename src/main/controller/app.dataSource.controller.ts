import {Controller, IpcHandle} from "einf";
import {channel} from "@render/api/channel";
import {failure, success} from "@main/vo/resultVo";
import {getAppDbStat, getDataSourceSettings} from "@common/utils/utils";
import log from "electron-log";
import {dataSourceType} from "@common/types";
import {Sequelize} from "sequelize";
import {jsonfileWrite} from "@common/utils/fsUtils";
import {isEqual} from "lodash";
import {appDSFile, appDSStatFile} from "@common/utils/appFilePath";

/**
 * 应用数据源Controller
 */
@Controller()
export class AppDataSourceController {
    constructor() {
    }

    /**
     * 获取数据源列表
     * @constructor
     */
    @IpcHandle(channel.app.dataSource.getDataSourceList)
    public async HandleGetDataSourceList() {
        let result
        try {
            result = success()
            result.result = await getDataSourceSettings()
        } catch (e) {
            log.error(e)
            result = failure('系统异常')
        }
        return result
    }

    /**
     * 数据源测试
     * @param type
     * @param options
     * @constructor
     */
    @IpcHandle(channel.app.dataSource.dataSourceTest)
    public async HandleDataSourceTest(type: dataSourceType, options) {
        let result
        try {
            let s = new Sequelize(options)
            await s.authenticate().then(() => {
                result = success('连接成功')
            }).catch(e => {
                result = failure('连接失败')
                result.result = e
            })
            await s.close()
            return result
        } catch (e) {
            log.error(e)
            result = failure('测试失败,系统异常')
            result.result = e
        }
        return result
    }

    /**
     * 添加或更新数据源
     * @constructor
     */
    @IpcHandle(channel.app.dataSource.addDataSource)
    public async HandleAddDataSource(opt) {
        let result
        try {
            let ds = (await getDataSourceSettings()) as any[]
            if (opt.id == null) {
                ds.push(opt)
                jsonfileWrite(appDSFile.getFullPath(), ds, {spaces: 2})
                result = success('数据源添加成功')
            } else {
                let ds2 = ds.filter(item => !isEqual(item.id, opt.id))
                ds2.push(opt)
                jsonfileWrite(appDSFile.getFullPath(), ds2, {spaces: 2})
                result = success('数据源修改成功')
            }
        } catch (e) {
            log.error(e)
            result = failure('数据源操作失败')
        }
        return result
    }

    /**
     * 获取应用数据库目前需要进行的操作配置
     * @constructor
     */
    @IpcHandle(channel.app.dataSource.getAppDbStat)
    public async HandleGetAppDbStat() {
        let result
        try {
            result = success()
            result.result = await getAppDbStat()
        } catch (e) {
            log.error(e)
            result = failure()
        }
        return result
    }

    /**
     * 切换数据源
     */
    @IpcHandle(channel.app.dataSource.changeDataSource)
    public async HandleChangeDataSource(id: string) {
        let result
        try {
            let appDbStat = await getAppDbStat()
            appDbStat.currentDSId = id
            jsonfileWrite(appDSStatFile.getFullPath(), appDbStat, {spaces: 2})
            result = success('切换数据源成功')
        } catch (e) {
            log.error(e)
            result = failure('切换数据源失败')
        }
        return result
    }

    /**
     * 删除数据源
     */
    @IpcHandle(channel.app.dataSource.deleteDataSource)
    public async HandleDeleteDataSource(id: string) {
        let result
        try {
            let dsList = (await getDataSourceSettings()) as any[]
            dsList = dsList.filter(item => !isEqual(item.id, id))

            jsonfileWrite(appDSFile.getFullPath(), dsList, {spaces: 2})
            result = success('数据源删除成功')
        } catch (e) {
            log.error(e)
            result = failure('数据源删除失败')
        }
        return result
    }
}