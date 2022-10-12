import useClipboard from 'vue-clipboard3';
import {message} from 'ant-design-vue';

const {toClipboard} = useClipboard();

export const copyText = async (text: string, showMsg?: true) => {
    try {
        await toClipboard(text);
        if (showMsg) message.success({content: '已复制到剪贴板', duration:1});
    } catch (e) {
        console.error(e);
    }
}
