export type Nullable<T> = T | null

export type Voidable<T> = T | null | undefined

export interface IpcResponse<T> {
    data?: T
    error?: any
}

export enum dataSourceType {
    none,
    sqlite,
    mysql,
    mariadb,
    mssql
}
