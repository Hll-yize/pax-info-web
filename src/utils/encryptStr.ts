import CryptoJS from 'crypto-js';

// 加密方法
const encryptStr = (str: string): string => {
  // 定义密钥和偏移量，必须是 16 字节
  const key = CryptoJS.enc.Utf8.parse('123gsf78900ijk0012345yhf900mja00');
  const iv = CryptoJS.enc.Utf8.parse('123ujh78900dfg00');
  
  // 使用 AES CBC 模式加密
  const encrypted = CryptoJS.AES.encrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // 返回加密后的十六进制字符串
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
};

export default encryptStr;
