import path from "path";
import os from "os";

/*似乎utils文件加载在此文件之后，出现了无法使用其方法的问题，这里再写一遍*/
const getAppDataPath = () => {
    return path.join(os.homedir(), '/AppData/Local/EasyPass')
}

/*应用设置文件*/
export const appSettingsFile = {
    folderPath: path.join(getAppDataPath(), '/config'),
    fileName: 'settings.json',
    getFullPath: () => {
        return path.join(appSettingsFile.folderPath, appSettingsFile.fileName)
    }
}

/*应用主题文件*/
export const appThemeFile = {
    folderPath: path.join(getAppDataPath(), '/config'),
    fileName: 'theme.json',
    getFullPath: () => {
        return path.join(appThemeFile.folderPath, appThemeFile.fileName)
    }
}

/*网络代理配置文件*/
export const appProxyFile = {
    folderPath: path.join(getAppDataPath(), '/config'),
    fileName: 'proxy.json',
    getFullPath: () => {
        return path.join(appProxyFile.folderPath, appProxyFile.fileName)
    }
}

/*数据源文件*/
export const appDSFile = {
    folderPath: path.join(getAppDataPath(), '/config'),
    fileName: 'ds.json',
    getFullPath: () => {
        return path.join(appDSFile.folderPath, appDSFile.fileName)
    }
}

/*数据库操作文件*/
export const appDSStatFile = {
    folderPath: path.join(getAppDataPath(), '/config'),
    fileName: 'dbStat.json',
    getFullPath: () => {
        return path.join(appDSStatFile.folderPath, appDSStatFile.fileName)
    }
}


