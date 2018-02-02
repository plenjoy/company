import { get } from 'lodash';
import { getCropOptions, getNewCropByBase } from '../crop';
import { elementTypes } from '../../contants/strings';
import { guid } from '../../../../common/utils/math';
import { numberToHex } from '../../../../common/utils/colorConverter';

export function mergeTemplateData(
  images,
  templateData,
  allImages,
  pageWidth,
  pageHeight,
  pageElements,
  ratio
) {
  const comparePxFunc = (a, b) => {
    return a.px - b.px;
  };


  const templateElements = templateData.elements.sort(comparePxFunc);

  const newElements = [];

  templateElements.forEach((templateElement, index) => {
    const x = pageWidth * templateElement.px;
    const y = pageHeight * templateElement.py;
    const width = pageWidth * templateElement.pw;
    const height = pageHeight * templateElement.ph;
    let imgRot = 0;
    let imgFlip = false;

    let newElement = Object.assign(
      {},
      {
        x,
        y,
        width,
        height,
        id: guid(),
        type: templateElement.type,
        dep: templateElement.dep,
        rot: templateElement.rot || 0,
        px: templateElement.px,
        py: templateElement.py,
        pw: templateElement.pw,
        ph: templateElement.ph
      }
    );

    switch (templateElement.type) {
      case elementTypes.photo: {
        const theImage = images[index];

        let theElement = null;

        if (theImage) {
          const encImgId = get(theImage, 'encImgId');

          const image = allImages.find((o) => {
            return o.encImgId === encImgId;
          });

          if (pageElements) {
            theElement = pageElements[index];

            if (theElement) {
              // imgRot = theElement.imgRot;
              imgFlip = theElement.imgFlip;
            }
          }

          // 优先使用元素上的imgRot.
          imgRot = theElement ? theElement.imgRot :
            (image ? image.orientation : 0);

          const defaultCropParams = {
            cropLUX: 0,
            cropLUY: 0,
            cropRLX: 0,
            cropRLY: 0
          };

          const imageCropParams = {};

          if (image) {
            let cropOptions = {};
            cropOptions = getCropOptions(
                image.width,
                image.height,
                width,
                height,
                imgRot
              );

            imageCropParams.cropLUX = cropOptions.cropLUX;
            imageCropParams.cropLUY = cropOptions.cropLUY;
            imageCropParams.cropRLX = cropOptions.cropRLX;
            imageCropParams.cropRLY = cropOptions.cropRLY;
          }

          newElement = Object.assign(
            {},
            newElement,
            defaultCropParams,
            imageCropParams,
            {
              encImgId,
              imgRot,
              imgFlip
            }
          );
        }
        break;
      }

      case elementTypes.text: {
        newElement = Object.assign({}, newElement, {
          fontColor: numberToHex(templateElement.color),
          fontFamily: decodeURI(templateElement.fontFamily),
          fontSize: templateElement.fontSize,
          fontWeight: templateElement.fontWeight,
          textAlign: templateElement.textAlign,
          textVAlign: templateElement.textVAlign,
          text: ''
        });
        break;
      }
    }

    newElements.push(newElement);
  });

  return newElements;
}
