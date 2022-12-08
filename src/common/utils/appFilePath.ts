import path from "path";
import os from "os";

/*应用配置文件夹路径*/
export const appSettingsFolderPath = path.join(os.homedir(), '/AppData/Local/EasyPass/config')

/*应用设置文件*/
export const appSettingsFile = {
    fileName: 'settings.json',
    getFullPath: () => {
        return path.join(appSettingsFolderPath, appSettingsFile.fileName)
    }
}

/*应用主题文件*/
export const appThemeFile = {
    fileName: 'theme.json',
    getFullPath: () => {
        return path.join(appSettingsFolderPath, appThemeFile.fileName)
    }
}

/*网络代理配置文件*/
export const appProxyFile = {
    fileName: 'proxy.json',
    getFullPath: () => {
        return path.join(appSettingsFolderPath, appProxyFile.fileName)
    }
}

/*数据源文件*/
export const appDSFile = {
    fileName: 'ds.json',
    getFullPath: () => {
        return path.join(appSettingsFolderPath, appDSFile.fileName)
    }
}

/*数据库操作文件*/
export const appDSStatFile = {
    fileName: 'dbStat.json',
    getFullPath: () => {
        return path.join(appSettingsFolderPath, appDSStatFile.fileName)
    }
}

/*用户本地信息文件*/
export const userConfigFile = {
    fileName: 'userConfig.json',
    getFullPath: () => {
        return path.join(appSettingsFolderPath, userConfigFile.fileName)
    }
}


