import { template, merge, get } from 'lodash';
import Immutable from 'immutable';
import { elementTypes, imageShapeTypes, pageTypes, spineShodawRatioForHardCover, spineShodawRatioForPaperCover, coverTypes } from '../../../contants/strings';
import { hexString2Number, hexToRGBA } from '../../../../../common/utils/colorConverter';
import { toDecode, isEncode, toEncode } from '../../../../../common/utils/encode';
import { checkElementTemplateType, templateTypes } from '../../../../../common/utils/encode';
import { getPxByPt } from '../../../../../common/utils/math';
import securityString from '../../../../../common/utils/securityString';
import {
  IMAGES_CROPPER_PARAMS,
  IMAGES_CROPPER,
  IMAGES_API,
  IMAGES_FILTER_PARAMS,
  TEXT_SRC,
  PAINETEXT_SRC,
  STICKER_SRC
} from '../../../contants/apiUrl';

import { getCropOptions, getCropOptionsByLR } from '../../../utils/crop';

const MIN_FONT_SIZE = 4;
const MAX_FONT_SIZE = 120;

/**
 * 计算element的显示时的宽高和left,top值.
 * @param  {object} that BookPage的this指向
 * @param  {object} element 原始数据
 * @param  {number} ratio 原始值与显示值的缩放比
 */
export const computedElementOptions = (that, element, workspaceRatio) => {
  const { data } = that.props;
  const { urls, page, images, settings, summary, parameters, project,env } = data;
  const ratio = workspaceRatio || data.ratio.workspace;

  // 天窗形状.
  const cameShape = get(settings, 'spec.cameoShape');
  const isCover = summary.get('isCover');

  const obj = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    imgUrl: ''
  };

  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  const imageRotate = element.get('imgRot');
  const imgFlip = element.get('imgFlip');

  // 计算element的显示宽高.
  obj.width = Math.round(pageWidth * element.get('pw') * ratio);

  // 因为整个coverspread的top值减少了1px为了处理颜色线.
  obj.height = Math.round(pageHeight * element.get('ph') * ratio) + (isCover ? 2 : 0);

  // 计算element的left和top值
  obj.left = element.get('px') * pageWidth * ratio;
  obj.top = element.get('py') * pageHeight * ratio;

  if(isCover && page.get('type') === pageTypes.full && page.getIn(['backend', 'isPrint'])){
    // 书脊阴影的大小.
    let spineShodawWidth = 0;

    const coverType = project ? project.getIn(['setting', 'cover'])　: '';

    if (coverType === coverTypes.LBPAC) {
      spineShodawWidth = spineShodawRatioForPaperCover * pageWidth * ratio;
    }

    if (coverType === coverTypes.LBHC && checkElementTemplateType(element.get('templateId')) === templateTypes.full) {
      spineShodawWidth = spineShodawRatioForHardCover * pageWidth * ratio;
    }

    // 重新计算, 渲染时要减去书脊的压线.
    const expandingOverFrontcover = parameters.getIn(['spineExpanding', 'expandingOverFrontcover']);
    const expandingOverBackcover = parameters.getIn(['spineExpanding', 'expandingOverBackcover']);

    const newLeft = Math.ceil((pageWidth * element.get('px') - expandingOverFrontcover - expandingOverBackcover) * ratio + spineShodawWidth);
    const newWidth = obj.width - spineShodawWidth;

    obj.left = newLeft;
    obj.top -= 1;

    obj.width = newWidth;
    obj.height += 2;
  }

  // 计算获取裁剪图片的地址.
  const encImgId = element.get('encImgId');

  switch (element.get('type')) {
    case elementTypes.text: {
      const text = element.get('text');
      const fontSizePercent = element.get('fontSize');
      const originalFontSize = fontSizePercent * page.get('height');

      const fontColor = element.get('fontColor') ? element.get('fontColor') : '#ffffff';

      if (data.page.get('type') === pageTypes.spine) {
        // 兼容移动端.
        const w = obj.width;
        const h = obj.height;
        if (w > h) {
          obj.width = h;
          obj.height = w;
        }

        let eW = element.get('pw') * pageWidth;
        let eH = element.get('ph') * pageHeight;
        if (eW > eH) {
          eW = element.get('ph') * pageHeight;
          eH = element.get('pw') * pageWidth;
        }

                  // 计算element的left和top值
        obj.left = ((pageWidth - eW) / 2) * ratio;
        obj.top = ((pageHeight - eH) / 2) * ratio;

        obj.imgUrl = template(TEXT_SRC)({
          // 兼容老数据.
          text: toEncode(text),
          fontSize: originalFontSize,
          fontColor: hexString2Number(fontColor),
          fontFamily: element.get('fontFamily'),
          width: pageWidth * element.get('pw'),
          height: pageHeight * element.get('ph'),
          originalWidth: pageWidth * element.get('pw'),
          originalHeight: pageHeight * element.get('ph'),
          originalFontSize,
          baseUrl: urls.baseUrl,
          textAlign: element.get('textAlign'),
          verticalTextAlign: element.get('textVAlign'),
          ratio
        });
      } else {
        obj.imgUrl = template(TEXT_SRC)({
          // 兼容老数据.
          text: toEncode(text),
          fontSize: originalFontSize,
          fontColor: hexString2Number(fontColor),
          fontFamily: element.get('fontFamily'),
          width: pageWidth * element.get('pw'),
          height: pageHeight * element.get('ph'),
          originalWidth: pageWidth * element.get('pw'),
          originalHeight: pageHeight * element.get('ph'),
          originalFontSize,
          baseUrl: urls.baseUrl,
          textAlign: element.get('textAlign'),
          verticalTextAlign: element.get('textVAlign'),
          ratio
        });
      }

      break;
    }
    case elementTypes.photo: {
      if (encImgId) {
        let cropOptions = null;
        // 如果cropRLY为0, 表示新增的.
        if (!element.get('cropRLY')) {
          const image = images ? images.get('encImgId') : null;
          if (image) {
            cropOptions = getCropOptions(
              image.width,
              image.height,
              obj.width,
              obj.height,
              imageRotate
            );
          }
        } else {
          cropOptions = getCropOptionsByLR(
            element.get('cropLUX'),
            element.get('cropLUY'),
            element.get('cropRLX'),
            element.get('cropRLY'),
            obj.width,
            obj.height
          );
        }

        if (cropOptions) {
          // const shape = element.get('type') === elementTypes.cameo ?
          //   (cameShape === imageShapeTypes.rect ? 'rect' : 'oval') : 'rect';
          const shape = 'rect';

          let filterOptions = {
            effectId: 0,
            opacity: 100
          };
          if (element.get('style')) {
            filterOptions = element.get('style').toJS();
          }
          obj.imgUrl = template(`${IMAGES_API}${IMAGES_FILTER_PARAMS}`)(merge(
            {}, cropOptions, filterOptions, {
              encImgId,
              imgFlip,
              shape,
              rotation: imageRotate,
              baseUrl: urls.baseUrl,
              ...securityString
            }
          ));
          obj.keepRatio = false;


          obj.corpApiTemplate = template(IMAGES_CROPPER)({
            baseUrl: urls.baseUrl
          }) + IMAGES_CROPPER_PARAMS;
          obj.filterApiTemplate = template(IMAGES_API)({
            baseUrl: urls.baseUrl
          }) + IMAGES_FILTER_PARAMS;
        }

        // 计算border
        const border = element.get('border');
        if (border) {
          if (!border.get('size')) {
            obj.border = 'none';
          } else {
            const rbga = hexToRGBA(border.get('color'), border.get('opacity'));
            obj.border = `${Math.round(border.get('size') * ratio)}px solid ${rbga}`;
          }
        }
      }
      break;
    }
    default:
  }

  // 只要其中的width或height为0, 那么就不要请求图片, 因为该数据就是无效的图片路径, 会引起服务器返回601错误.
  if (!obj.width || !obj.height) {
    obj.imgUrl = '';
  }

  return Immutable.fromJS(obj);
};
