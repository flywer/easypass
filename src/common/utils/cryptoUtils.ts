import crypto from 'crypto'

const algorithm = 'aes-256-ctr';
const secretKey = 'tOVH63ecvpNWjRRIqQs7rdxs1lwHZfrf';
const iv = crypto.randomBytes(16);
const accountIv = Buffer.from('10f5db4436659727ef454b1be9d34e9e', 'hex')
const appTokenIv = Buffer.from('20f5db4136659347ef454b1bead34e8e', 'hex')
/**
 * 加密
 * @param text
 */
export const encrypt = (text) => {

    //Creating Cipheriv with its parameter
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    //Updating text;Using concatenation
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    //Returning iv and encrypted data
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

/**
 * 解密
 * @param hash
 */
export const decrypt = (hash: { iv, content }) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrypted.toString();
};

/**
 * 账号加密
 * @param text
 */
export const accountEncrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, accountIv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex')
};

/**
 * 账号解密
 * @param content
 */
export const accountDecrypt = (content) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, accountIv)
    const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    return decrypted.toString();
}

/**
 * 账号组解密
 * @param value
 */
export const groupItemDecrypt = (value) => {
    return decrypt({iv: value.substring(0, 32), content: value.substring(32, value.length)})
}

/**
 * 应用令牌加密
 */
export const appTokenEncrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, appTokenIv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex')
}

/**
 * 应用令牌解密
 * @param value
 */
export const appTokenDecrypt = (value) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, appTokenIv);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(value, 'hex')), decipher.final()]);
    return decrypted.toString();
}
