/**
 * 包装sql中like语句所需要的'%'
 * @param content
 * @param left
 * @param right
 */
export const sqlLikePack = (content: any, left?: boolean, right?: boolean) => {
    if (left)
        content = '%' + content
    if (right)
        content = content + '%'
    return content
}
