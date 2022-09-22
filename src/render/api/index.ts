import { ipcInstance } from '@render/plugins'

export function sendMsgToMainProcess(msg: string) {
  return ipcInstance.send<string>('send-msg', msg)
}

export function setWindow(msg: string) {
  return ipcInstance.send<string>('set-window', msg)
}
