import crypto from 'crypto'

const algorithm = 'aes-256-ctr';
const secretKey = 'tOVH63ecvpNWjRRIqQs7rdxs1lwHZfrf';
const iv = crypto.randomBytes(16);

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
 * 账号组解密
 * @param value
 */
export const groupItemDecrypt = (value) => {
    return  decrypt({iv: value.substring(0, 32), content: value.substring(32, value.length)})
}
