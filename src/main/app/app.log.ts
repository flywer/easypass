import log from "electron-log";
import Path from "path";
import {getAppTempDataPath} from "@common/utils/utils";

/**
 * 应用日志初始化
 */
export const appLogInit = () => {
    //设置日志存储位置
    log.transports.file.resolvePath = () => Path.join(getAppTempDataPath(), 'logs/all.log')
}
