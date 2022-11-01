import superagent from 'superagent'
import cheerio from 'cheerio'
import log from "electron-log";
import {isEmpty, isEqual} from "lodash";

const baseUrl = 'https://cn.bing.com/images/search?'
const option = '&qs=n&form=QBIR&qft=%20filterui%3Aimagesize-custom_128_128%20filterui%3Aphoto-transparent%20filterui%3Aaspect-square&sp=-1&pq=steam&sc=0-5&ghsh=0&ghacc=0&first=1&tsc=ImageHoverTitle'

export const findIcon = async (q: string, number: number) => {
    if (!isEmpty(q)) {
        const url = baseUrl + 'q=' + encodeURI(q) + option
        log.info('图片搜素URL', url)
        const html = await superagent.get(url)
        return getIcon(html.text, number)
    }
    return null
}

const getIcon = (html: string, number: number) => {
    const imageUrls = []
    const $ = cheerio.load(html)
    $('.mimg').map((index, element) => {
        if (index < number) {
            const imgUrl = element.attributes.filter(item => isEqual(item.name, 'src')).map(item => item.value).at(0)
            imageUrls.push(imgUrl as string)
        }
    })
    return imageUrls
}
