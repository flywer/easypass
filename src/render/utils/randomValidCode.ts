//生成验证码  4位  包含数字和字母
const str = "abcdefghijklmnopqrstuvwxyz09876543212QWERTYUIOPLKJHGFDSAZXCVBNM";
export const randomValidCode = () => {
    let s = '';
    for (let i = 0; i < 4; i++) {
        s += str[Math.floor(Math.random() * str.length)];
    }
    return s
}
