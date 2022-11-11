import {showOpenDialog, showSaveDialog} from "@render/api/utils.api";

interface dialogOptions {
    title: string,
    defaultPath?: string,
    filters: [{ name: string, extensions: any[] }],
    properties: {
        openFile: boolean,
        openDirectory: boolean,
        multiSelections: boolean,/*允许多选*/
    }
}

/**
 * 打开弹框默认配置
 */
export const defaultOpenDialogOptions: dialogOptions = {
    title: '选择',
    filters: [{name: 'All Files', extensions: ['*']}],
    properties: {
        openFile: true,
        openDirectory: false,
        multiSelections: false,/*允许多选*/
    }
}

export const showAppOpenDialog = async (options: dialogOptions) => {
    let path
    await showOpenDialog(options).then(res => {
        if (res.data.success && res.data.tag) {
            path = res.data.result
        } else {
            path = null
        }
    })
    return path
}

export const showAppSaveDialog = async (options: dialogOptions) => {
    let path
    await showSaveDialog(options).then(res => {
        if (res.data.success && res.data.tag) {
            path = res.data.result
        } else {
            path = null
        }
    })
    return path
}
