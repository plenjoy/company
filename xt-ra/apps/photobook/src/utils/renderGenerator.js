import { merge } from 'lodash';
import { run } from '../../../common/utils/bookRender';
import { getMaterialsByCoverType } from './material';
import { getCoverPaddings, getInnerPaddings } from './paddings';

/**
 * 根据封面类型, 书脊大小, 希望的生成的实际大小, 生成相对应的图片.
 * @param coverType 书的封面类型.
 * @param targetSize 希望的生成的实际大小, {width, height}
 * @param spainWidth 书脊大小
 * @param {function} done 合并完成后的回调.
 */
export const makeCoverImage = (originalMaterialObj, coverType, targetSize, spainWidth, done) => {
  // 根据封面类型, 获取相应的原始素材.
  const material = getMaterialsByCoverType(originalMaterialObj, coverType, true);

  // 计算正面, 后面和书脊的宽高.
  const backFrontWidth = (targetSize.width - spainWidth) / 2;
  const backFrontHeight = targetSize.height;
  const spainHeight = backFrontHeight;

  // 获取图片四周的白边的大小.
  const coverPaddings = getCoverPaddings(coverType);

  const back = {
    images: material.back,
    size: { width: backFrontWidth, height: backFrontHeight },
    paddings: coverPaddings.back
  };
  const spain = {
    images: material.spain,
    size: { width: spainWidth, height: spainHeight },
    paddings: coverPaddings.spain
  };
  const cover = {
    images: material.cover,
    size: { width: backFrontWidth, height: backFrontHeight },
    paddings: coverPaddings.cover
  };

  run([back, spain, cover], (opt)=> {
    opt.size = merge({}, opt.size, {
        innerWidth: targetSize.width,
        innerHeight: targetSize.height
      }
    );
    done && done(opt);
  });
};

/**
 * 根据封面类型, 书脊大小, 希望的生成的实际大小, 生成相对应的图片.
 * @param coverType 书的封面类型.
 * @param targetSize 希望的生成的实际大小, {width, height}
 * @param {function} done 合并完成后的回调.
 */
export const makeInnerImage = (originalMaterialObj, coverType, targetSize, done) => {
  // 根据封面类型, 获取相应的原始素材.
  const material = getMaterialsByCoverType(originalMaterialObj, coverType, false);

  // 获取左半页和右半页的原始小图.
  const leftImages = material.left;
  const rightImages = material.right;

  // 计算正面, 后面和书脊的宽高.
  const imageWidth = rightImages && rightImages.length ? targetSize.width / 2 : targetSize.width;
  const imageHeight = targetSize.height;

  // 获取图片四周的白边的大小.
  const paddings = getInnerPaddings(coverType);

  const left = leftImages && leftImages.length ? {
    images: leftImages,
    size: { width: imageWidth, height: imageHeight },
    paddings: paddings.left,
    outPaddings: paddings.outLeft
  } : null;

  const right = rightImages && rightImages.length ? {
    images: rightImages,
    size: { width: imageWidth, height: imageHeight },
    paddings: paddings.right,
    outPaddings: paddings.outRight
  }: null;

  const arr = [];
  if(left){
    arr.push(left);
  }

  if(right){
    arr.push(right);
  }

  run(arr,  (opt)=> {
    opt.size = merge({}, opt.size, {
        innerWidth: targetSize.width,
        innerHeight: targetSize.height
      }
    );
    done && done(opt);
  });
};
