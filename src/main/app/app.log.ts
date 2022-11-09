import log from "electron-log";
import Path from "path";
import {getAppTempDataPath, getDayString} from "@common/utils/utils";

/**
 * 应用日志初始化
 */
export const appLogInit = () => {
    //设置日志存储位置
    const logPath = Path.join(getAppTempDataPath(), 'logs')
    //根据日期来存日志
    log.transports.file.resolvePath = () => Path.join(logPath, '/ep-' + getDayString() + '.log')
}
