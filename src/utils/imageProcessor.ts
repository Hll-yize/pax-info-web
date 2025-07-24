import imageCompression from 'browser-image-compression';

/**
 * 选择图片或拍照后的压缩处理逻辑
 * @param file 图片文件（File 对象）
 * @returns base64 编码的压缩后图片
 */
export async function compressAndConvertToBase64(file: File): Promise<string> {
  // 压缩配置
  const options = {
    maxWidthOrHeight: 900,
    maxSizeMB: 1, // 最大大小，单位MB
    useWebWorker: true,
    initialQuality: 0.8, // 初始压缩质量
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const base64 = await convertFileToBase64(compressedFile);
    return base64;
  } catch (error) {
    console.error('图片压缩失败', error);
    throw error;
  }
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]); // 去掉 data:image/...;base64, 前缀
      } else {
        reject('无法解析为base64');
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
