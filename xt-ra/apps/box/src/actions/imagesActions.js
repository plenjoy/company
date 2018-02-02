import {
  ADD_IMAGES,
  UPDATE_IMAGEID,
  UPDATE_PERCENT,
  UPLOAD_COMPLETE,
  UPDATE_FIELDS,
  CLEAR_IMAGES,
  DELETE_IMAGE,
  RETRY_IMAGE,
  ERROR_TO_FIRST,
  SORT_IMAGE,
  DELETE_UPLOADED_IMAGE,
  UPDATE_IMAGE_USED_COUNT,
  UPDATE_ELEMENT,
  AUTO_ADD_PHOTO_TO_CANVAS,
  UPDATE_IMAGE_USED_COUNT_MAP,
  ADD_TRACKER
} from '../contants/actionTypes';
import { PENDING, DONE, PROGRESS, FAIL } from '../contants/uploadStatus';
import { UPLOAD_BASE, GET_IMAGE_IDS, UPLOAD_IMAGES, IMAGE_SRC } from '../contants/apiUrl';

import { set, get, template, merge } from 'lodash';
import qs from 'qs';

import x2jsInstance from '../utils/xml2js';
import request from '../utils/ajax';
import { combine } from '../utils/url';
import { getCropOptions} from '../utils/crop';
import { getDefaultCropLRXY } from '../../common/utils/crop';
import { Element } from '../../common/utils/entry';
import {convertObjIn} from '../../common/utils/typeConverter';
import { getDegree } from '../../../common/utils/exif';

export function addImages(files) {
  return (dispatch, getState) => {
    const { system, project } = getState();
    const { uploading } = system.images;
    const { env, workspace } = system;
    const { autoAddPhotoToCanvas } = workspace;
    const getImageIdsUrl = template(GET_IMAGE_IDS)({ uploadBaseUrl: env.urls.uploadBaseUrl });
    const uploadImagesUrl = template(UPLOAD_IMAGES)({ uploadBaseUrl: env.urls.uploadBaseUrl });
    //未登录不上传
    if (!system.env.userInfo) {
      return false;
    }

    // 将格式不对的图片排到前面
    files.sort(item => {
  		return ['image/jpeg','image/jpg','image/png','image/x-png'].indexOf(item.type) !== -1 ? true : false;
  	});

    dispatch({ type: ADD_IMAGES, files });
    uploadFiles(getImageIdsUrl, uploadImagesUrl, files, dispatch, env, project.setting.title, uploading, autoAddPhotoToCanvas, getState);
  }
}

export function clearImages() {
  return {
    type: CLEAR_IMAGES
  }
}

export function deleteImage(imageId) {
  return {
    type: DELETE_IMAGE,
    imageId
  }
}

export function retryImage(imageId) {
  return (dispatch, getState) => {
    const { system, project } = getState();
    const { uploading } = system.images;
    const { env, workspace } = system;
    const { autoAddPhotoToCanvas } = workspace;
    const getImageIdsUrl = template(GET_IMAGE_IDS)({ uploadBaseUrl: env.urls.uploadBaseUrl });
    const uploadImagesUrl = template(UPLOAD_IMAGES)({ uploadBaseUrl: env.urls.uploadBaseUrl });
    //未登录不上传
    if (!system.env.userInfo) {
      return false;
    }
    //重传拿原始索引
    const index = uploading.findIndex((item)=> {
      return item.imageId === imageId;
    })

    uploadFiles(getImageIdsUrl, uploadImagesUrl, [uploading[index].file], dispatch, env, project.setting.title, uploading, autoAddPhotoToCanvas, getState, true, index);
  }
}
// /**
//  * 根据field重新排序uploadedImage
//  * @param field
//  */
// export function sortImage(field){
//     return {
//       type : SORT_IMAGE,
//       field
//     }
// }
// /**
//  * 根据imageId删除图片列表中选中的图片
//  *@param imageId
//  */
// export function deleteUploadedImage(imageId){
//   return {
//     type : DELETE_UPLOADED_IMAGE,
//     imageId
//   }
// }
// /**
//  * 根据imageId更新图片的使用次数
//  *@param imageId
//  */
// export function updateUploadedImageUsedCount(imageId){
//   return {
//     type : UPDATE_IMAGE_USED_COUNT,
//     imageId
//   }
// }

/**
 * action, 上传图片
 * @param getImgIdsUrl 获取图片ids接口
 * @param uploadImagesUrl 上传图片接口
 * @param files 上传图片列表
 * @param dispatch
 * @param env
 * @param uploadedImages
 * @param isRetry 是否重传
 * @param index 重传索引
 * @returns {function(*)}
 */

function uploadFiles(getImgIdsUrl, uploadImagesUrl, files, dispatch, env, projectTitle, uploadedImages, autoAddPhotoToCanvas, getState, isRetry, index) {
  const uploadImagesLength = uploadedImages.length;
  let locked = false;
  request({
    url: combine(getImgIdsUrl, '', {
      imageIdCount: files.length
    }),
    success: function (result) {
      if (result) {
        const xmlData = x2jsInstance.xml2js(result);
        const ids = xmlData.imageIds.id;
        const idCount = Array.isArray(ids) ? ids.length : 1;
        for (let i = 0; i < idCount; i++) {
          const currentId = Array.isArray(ids) ? ids[i] : ids;
          // 获取imageid
          const idx = typeof index != 'undefined' ? index : i + uploadImagesLength;
          dispatch({
            type: UPDATE_IMAGEID,
            index: idx,
            imageId: currentId
          });
          if (isRetry) {
            dispatch({
              type: UPDATE_FIELDS,
              imageId: currentId,
              fields: {
                precent: 0,
                info: ''
              }
            });
          }

          const isImageFile = ['image/jpeg','image/jpg','image/png','image/x-png'].indexOf(files[i].type) !== -1;
          const fileSizeMB = files[i].size / (1024 * 1024);

          if (isImageFile && fileSizeMB < 100 && fileSizeMB !== 0) {
            const file = files[i];
            const formData = new FormData();

            formData.append('uid', get(env, 'userInfo.id'));
            formData.append('timestamp', get(env, 'userInfo.timestamp'));
            formData.append('token', get(env, 'userInfo.authToken'));
            formData.append('albumId', get(env, 'albumId'));

            formData.append('albumName', projectTitle);
            formData.append('Filename', file.name.replace(/[\&\/\_]+/g, ''));
            formData.append('filename', file);
            // 更新上传状态并开始上传
            dispatch({
              type: UPDATE_FIELDS,
              imageId: currentId,
              fields: {
                status: PROGRESS
              }
            });
            const xhr = request({
              url: combine(uploadImagesUrl, '', {
                imageId: currentId
              }),
              method: 'post',
              data: formData,
              success: function (res) {
                // 从Store里面获取最新的autoAddPhotoToCanvas信息
                const shouldAutoAddPhotoToCanvas = getState().system.workspace.autoAddPhotoToCanvas;
                if (res) {
                  const xmlRes = x2jsInstance.xml2js(res);
                  if (res.indexOf('state="success"') !== -1) {
                    // 更新成功状态
                    dispatch({
                      type: UPDATE_FIELDS,
                      imageId: currentId,
                      fields: {
                        status: DONE,
                        percent: 'Done'
                      }
                    });

                    trackFinishUploadPhoto(dispatch, getState, file);

                    const fileInfo = {
                      name: file.name.replace(/[\&\/\_]+/g, ''),
                      url: combine(get(env, 'urls.uploadBaseUrl'), IMAGE_SRC, {
                        qaulityLevel: 0,
                        puid: get(xmlRes, 'resultData.img.encImgId')
                      }),
                      usedCount: 0,
                      status: DONE,
                      imageId: currentId,
                      totalSize: get(xmlRes, 'resultData.img.size'),
                      guid: get(xmlRes, 'resultData.img.guid'),
                      uploadTime: new Date(get(xmlRes, 'resultData.img.insertTime')).getTime(),
                      shotTime: new Date(+get(xmlRes, 'resultData.img.shotTime')).getTime(),
                      encImgId: get(xmlRes, 'resultData.img.encImgId'),
                      width: get(xmlRes, 'resultData.img.width'),
                      height: get(xmlRes, 'resultData.img.height'),
                      createTime: file.lastModified,
                      orientation: getDegree(get(xmlRes, 'resultData.img.exifOrientation'))
                    };
                    dispatch({
                      type: UPLOAD_COMPLETE,
                      fields: fileInfo
                    });

                    // 判断是否需要自动添加到画布中.
                    if (shouldAutoAddPhotoToCanvas && shouldAutoAddPhotoToCanvas.status && !locked) {
                      const { elementId, targetHeight, targetWidth } = shouldAutoAddPhotoToCanvas;
                      locked = true;
                      const newData = convertObjIn(merge({}, fileInfo, { imageid: fileInfo.imageId }));
                      const imgRot = newData.orientation || 0
                     const options = getCropOptions(newData.width, newData.height, targetWidth, targetHeight,imgRot);
                      const { cropLUX, cropLUY, cropRLX, cropRLY } = options;

                      // 获取图片的裁剪参数.
                      const element =  {
                        imageid: fileInfo.imageId,
                        encImgId: fileInfo.encImgId,
                        id: elementId,
                        cropLUX,
                        cropLUY,
                        cropRLX,
                        cropRLY,
                        imgRot
                      };

                      // 新增一个element.
                      dispatch({
                        type: UPDATE_ELEMENT,
                        element
                      });

                      // 更新图片的使用次数
                      dispatch({
                        type: UPDATE_IMAGE_USED_COUNT_MAP
                      });

                      // 关闭自动添加的功能, 只有在需要的时候再开启.
                      dispatch({
                        type: AUTO_ADD_PHOTO_TO_CANVAS,
                        status: false,
                        elementId: '',
                        targetWidth: 0,
                        targetHeight: 0
                      });
                    }
                  } else if (res.indexOf('state="fail"') !== -1) {
                    // 更新失败状态
                    dispatch({
                      type: UPDATE_FIELDS,
                      imageId: currentId,
                      fields: {
                        status: FAIL,
                        percent: xmlRes.resultData.errorInfo,
                        info: xmlRes.resultData.errorInfo,
                        file: file
                      }
                    });
                    //将上传失败的放到第一个
                    if (!isRetry) {
                      dispatch({
                        type: ERROR_TO_FIRST,
                        imageId: currentId
                      });
                    }
                  }
                }

              },
              progress: function (data) {
                const percent = Math.floor(data.loaded / data.total * 100);

                dispatch({
                  type: UPDATE_PERCENT,
                  imageId: currentId,
                  percent
                });

                trackStartUploadPhoto(dispatch, getState, file, percent);
              },
              readyStateChange: function(readyState, status) {
                if(readyState == 4){
									//上传图片过大时，处理方法
									if (status == 413) {
                    // 更新失败状态
                    dispatch({
                      type: UPDATE_FIELDS,
                      imageId: currentId,
                      fields: {
                        status: FAIL,
                        percent: "File exceeds maximum size of 100M",
                        info: "File exceeds maximum size of 100M",
                        file: null
                      }
                    });
                    //将上传失败的放到第一个
                    if (!isRetry) {
                      dispatch({
                        type: ERROR_TO_FIRST,
                        imageId: currentId
                      });
                    }
							 		}
								}
              },
              error: function () {
                // 更新失败状态
                dispatch({
                  type: UPDATE_FIELDS,
                  imageId: currentId,
                  fields: {
                    status: FAIL,
                    percent: "An unexpected error occurred. Try again",
                    info: "An unexpected error occurred. Try again",
                    file: null
                  }
                });
                //将上传失败的放到第一个
                if (!isRetry) {
                  dispatch({
                    type: ERROR_TO_FIRST,
                    imageId: currentId
                  });
                }
              }
            });
            //更新xhr
            dispatch({
              type: UPDATE_FIELDS,
              imageId: currentId,
              fields: {
                xhr: xhr,
              }
            });
          } else {
            let percent = 'Only .jpg .jpeg and .png files are supported';
            let info = 'Only .jpg .jpeg and .png files are supported';

            if(fileSizeMB >= 100) {
              percent = 'File exceeds maximum size of 100M';
              info = 'Failed: File exceeds maximum size of 100M';
            }

            if(fileSizeMB === 0) {
              percent = 'Invalid image file, please select another file';
              info = 'Failed: Invalid image file, please select another file';
            }

            dispatch({
              type: UPDATE_FIELDS,
              imageId: currentId,
              fields: {
                status: FAIL,
                percent,
                info,
                file: null
              }
            });
            //将上传失败的放到第一个
            dispatch({
              type: ERROR_TO_FIRST,
              imageId: currentId
            });
          }
        }
      }
    }
  })
}

function trackStartUploadPhoto(dispatch, getState, file, percent) {
  file.startUploadAt = file.startUploadAt || 0;

  if(file.startUploadAt === 0 && percent > 0) {
    const product = getState().project.setting.product;
    const photoName = file.name;
    const photoSize = file.size;

    file.startUploadAt = new Date().getTime();

    const params = qs.stringify({
      product,
      startUploadAt: file.startUploadAt,
      photoName,
      photoSize
    });

    dispatch({
      type: ADD_TRACKER,
      param: `StartUploadEachPhoto,${params}`
    });
  }
}

function trackFinishUploadPhoto(dispatch, getState, file) {
  file.successUploadAt = file.successUploadAt || 0;

  if(file.successUploadAt === 0) {
    const product = getState().project.setting.product;
    const photoName = file.name;
    const photoSize = file.size;

    file.successUploadAt = new Date().getTime();

    const params = qs.stringify({
      product,
      successUploadAt: file.successUploadAt,
      photoName,
      photoSize,
      uploadSpend: file.successUploadAt - file.startUploadAt
    });

    dispatch({
      type: ADD_TRACKER,
      param: `CompleteUploadEachPhoto,${params}`
    });
  }
}
