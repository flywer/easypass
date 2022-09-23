export type Nullable<T> = T | null

export type Voidable<T> = T | null | undefined

export interface IpcResponse<T> {
    data?: T
    error?: any
}

//获取、解析、拆分出Ipc接口传来的数据
export const getIpcResponseData = (responseData: any[]): any[] => {
    let result = []
    if (responseData == null) {
        return result
    } else {
        responseData.forEach(item => {
            result.push(item.dataValues)
        })
        return result
    }
}
