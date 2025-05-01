import CryptoJS from "crypto-js";
import Cookie from "js-cookie"

export function decrypt() {
    const userCrypt = Cookie.get('user')

    if (userCrypt) {
        const bytes = CryptoJS.AES.decrypt(userCrypt, import.meta.env.VITE_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData
    } else {
        return false
    }
}