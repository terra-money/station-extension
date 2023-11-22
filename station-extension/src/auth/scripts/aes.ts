import CryptoJS from "crypto-js"

const keySize = 256
const DEFAULT_ITERATIONS = 20_000
const msgSalt = "STATION:"

export const encrypt = (msg: string, pass: string, iterations?: number) => {
  try {
    const salt = CryptoJS.lib.WordArray.random(128 / 8)

    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations ?? DEFAULT_ITERATIONS,
    })

    const iv = CryptoJS.lib.WordArray.random(128 / 8)

    const encrypted = CryptoJS.AES.encrypt(msgSalt + msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    })

    const transitmessage =
      salt.toString() + iv.toString() + encrypted.toString()
    return transitmessage
  } catch (error) {
    return ""
  }
}

export const decrypt = (
  transitmessage: string,
  pass: string,
  iterations?: number
) => {
  const salt = CryptoJS.enc.Hex.parse(transitmessage.substring(0, 32))
  const iv = CryptoJS.enc.Hex.parse(transitmessage.substring(32, 64))
  const encrypted = transitmessage.substring(64)

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations ?? DEFAULT_ITERATIONS,
  })

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  })

  const decoded = decrypted.toString(CryptoJS.enc.Utf8)

  if (!decoded || !decoded.startsWith(msgSalt))
    throw new Error("Incorrect password")

  return decoded.substring(msgSalt.length)
}
