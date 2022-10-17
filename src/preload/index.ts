import {contextBridge, ipcRenderer} from 'electron'
import {channel} from "@render/api/channel";

contextBridge.exposeInMainWorld(
    'ipcRenderer',
    {
        invoke: ipcRenderer.invoke.bind(ipcRenderer),
        on: ipcRenderer.on.bind(ipcRenderer),
        removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer),
    },
)
