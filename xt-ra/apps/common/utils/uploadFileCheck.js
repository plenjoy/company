import { supportedImagesTypes } from './strings';

export const isAcceptFile = (file) => {
  let isAccept = true;
  let errorText = '';
  let translateKey = '';

  if (file) {
    // 1. 判断文件是否超过最大值100M.
    const fileSize = file.size / (1024 * 1024);
    if (fileSize === 0) {
      isAccept = false;
      translateKey = 'FILE_EMPTY';
      errorText = 'Invalid image file, please select another file';

      return { isAccept, translateKey, errorText };
    } else if (fileSize > 100) {
      isAccept = false;
      translateKey = 'FILE_EXCEEDS_MAXIMUM_SIZE';
      errorText = 'File exceeds maximum size of 100M';

      return { isAccept, translateKey, errorText };
    }

    // 2. 检查是不是图片格式.
    if (supportedImagesTypes.indexOf(file.type) === -1) {
      isAccept = false;
      translateKey = 'TYPE_CONFLICT';
      errorText = 'Only .jpg .jpeg and .png files are supported';

      return { isAccept, translateKey, errorText };
    }
  }

  return { isAccept, translateKey, errorText };
};
