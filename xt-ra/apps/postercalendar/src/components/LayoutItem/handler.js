import React from 'react';
import { fromJS } from 'immutable';
import { merge, template, get } from 'lodash';
import { TEMPLATE_SRC } from '../../contants/apiUrl';
import {
  elementTypes,
  productTypes,
  dragTypes,
  mouseWheel,
  LAYOUT_MAX_VIEW_NUM_PS,
  LAYOUT_MAX_VIEW_NUM_DEFAULT
} from '../../contants/strings';

import { loadImg } from '../../utils/image';
import { filterOptions } from '../../contants/strings';
import classNames from 'classnames';

import LayoutItem from '../LayoutItem';

import { setTransferData } from '../../../../common/utils/drag';
import XDrag from '../../../../common/ZNOComponents/XDrag';

const getSize = (setting) => {
  let size = '8X8';

  // 所有尺寸为方形的使用8X8的图片
  if (setting) {
    size = setting.get('size');

    const sizeArr = size ? size.split('X') : [];
    if (sizeArr.length === 2 && sizeArr[0] === sizeArr[1]) {
      size = '8X8';
    }
  }

  return size;
};

const calcImageSizeByRule = (originalImageSize) => {
  const { width = 0, height = 0 } = originalImageSize;
  let baseWidth = 0;

  // 每行显示的个数.
  let colNumber = 0;

  // 计算原始图片的宽高比.
  const WHRatio = height ? (width / height) : 0;

  // 获取排列规则.
  // 一排2个
  if (WHRatio > 1.5) {
    baseWidth = 190;
    colNumber = 2;
  } else if (WHRatio <= 1.5 && WHRatio >= 1 / 1.5) {
    // 一排3个
    baseWidth = 120;
    colNumber = 3;
  } else {
    // 一排4个
    baseWidth = 85;
    colNumber = 4;
  }

  return {
    width: baseWidth,
    height: WHRatio ? (baseWidth / WHRatio) : 0,
    colNumber
  };
};

const setNewImageSizeInState = (that, list) => {
  const download = (index) => {
    if (index >= list.length) {
      return;
    }

    const template = list[index];
    loadImg(template.templateUrl).then((result) => {
      if (result.img) {
        const newObj = calcImageSizeByRule({
          width: result.img.width,
          height: result.img.height
        });

        that.setState({
          imageSize: {
            width: newObj.width,
            height: newObj.height
          },
          colNumber: newObj.colNumber
        });
      } else {
        const nextIndex = index + 1;
        download(nextIndex);
      }
    }, (error) => {
      const nextIndex = index + 1;
      download(nextIndex);
    });
  };

  if (list && list.length) {
    download(0);
  }
};

/**
 * 把一维数组转换成二维数组.
 * @param  {Array} list        [description]
 * @param  {number} numInColumn 二维数组中, 子数组的长度.
 */
const toTwoDimensionalArray = (list, numInColumn) => {
  let twoDimenArr = [list];

  // 根据每行显示layout的个数, 把templateList转成一个2维数据.
  if (numInColumn && list && list.length) {
    twoDimenArr = [];
    let tempArr = [];

    list.forEach((t) => {
      if (tempArr.length === numInColumn) {
        twoDimenArr.push(tempArr);
        tempArr = [];
      }

      tempArr.push(t);
    });

    if (tempArr.length) {
      twoDimenArr.push(tempArr);
      tempArr = [];
    }
  }

  return twoDimenArr;
};

export const getTemplateHTML = (that) => {
  const { data, actions, t } = that.props;
  const { applyTemplate, boundTemplateActions, onSelectFilter } = actions;
  const { baseUrls, setting, paginationSpread, page, userInfo, currentFilterTag, pagination } = data;
  const { templateList, imageSize, colNumber } = that.state;

  if (setting) {
    // 所有尺寸为方形的使用8X8的图片
    // let size = getSize(setting);

    // const templateThumbnailPrefx = baseUrls.templateThumbnailPrefx;
    const pages = paginationSpread.get('pages');
    const pageId = pagination.pageId;
    const page = pages.find((p) => {
      return p.get('id') === pageId;
    });
    let selectedTemplateId = page ? page.getIn(['template', 'tplGuid']) : 0;

    // 如果当前page没有元素则没有选中模板
    if (page && page.get('elements').size === 0) {
      selectedTemplateId = 0;
    }

    // 根据每行显示layout的个数, 把templateList转成一个2维数据.
    const newTemplateList = toTwoDimensionalArray(templateList, colNumber);

    // const layoutRowStyle = {
    //   // 所有layout的width + layout之间的margin值.
    //   width: `${imageSize.width * colNumber + (colNumber - 1) * 20}px`
    // };

    return newTemplateList.map((list, i) => {
      const itemList = [];

      list.forEach((templt, key) => {
        const isSelected = selectedTemplateId === templt.guid;

        // layout data and actions
        const layoutItemData = fromJS({
          template: templt,
          imageSize,
          isSelected,
          userInfo,
          currentFilterTag
        });

        const layoutItemActions = { applyTemplate, deleteTemplate: boundTemplateActions.deleteTemplate, onSelectFilter };

        const itemClass = classNames('lazy-item', {
          selected: isSelected
        });

        itemList.push(
          <div className={itemClass} key={templt.guid}>
            <XDrag onDragStarted={that.onLayoutDragStarted.bind(that, templt.guid)}>
              <LayoutItem
                actions={layoutItemActions}
                data={layoutItemData}
              />
            </XDrag>
          </div>
        );
      });

      return (<div
        key={i}
        className="layout-row clearfix"
      >
        {itemList}
      </div>);
    });
  }
  return [];
};

/**
 * 把模板根据模板的图片数量分组.
 */
export const groupTemplateByNum = (that, list) => {
  const { data } = that.props;
  const { setting } = data;
  const product = setting.get('product');
  const isPressBook = product === productTypes.PS;
  const maxNum = isPressBook ? LAYOUT_MAX_VIEW_NUM_PS : LAYOUT_MAX_VIEW_NUM_DEFAULT;

  const numTemplate = {};
  const copyList = merge([], list);
  copyList.sort((prev, next) => {
    return next.spread - prev.spread;
  });
  copyList.map((item) => {
    let num = item.imageNum;
    // 过滤到包含text的和用户自定义的模板.
    if (item.textFrameNum > 0 || item.customerId) {
      return;
    }
    if (num >= maxNum) {
      num = `${maxNum}+`;
    }
    if (!numTemplate[num]) {
      numTemplate[num] = [];
    }
    numTemplate[num].push(item);
  });
  return numTemplate;
};


export const doFilter = (that, tag, list) => {
  const { data, actions } = that.props;
  const { boundTrackerActions, onSelectFilter } = actions;
  const { baseUrls, setting, page, realFilterTag } = data;
  const { numTemplate } = that.state;
  const { MY, TOP, TEXT } = filterOptions;

  const product = setting.get('product');
  const isPressBook = product === productTypes.PS;
  const maxNum = isPressBook ? LAYOUT_MAX_VIEW_NUM_PS : LAYOUT_MAX_VIEW_NUM_DEFAULT;

  const templateThumbnailPrefx = baseUrls.templateThumbnailPrefx;
  const size = getSize(setting);

  // 筛选模版时的埋点
  boundTrackerActions.addTracker(`FilterLayouts,${tag}`);
  let newList = [];
  switch (tag) {
    case TOP:
      newList = merge([], list);
      newList.sort((prev, next) => {
        return next.spread - prev.spread;
      });
      newList = newList.splice(0, 20);
      break;
    case MY:
      newList = list.filter((template) => {
        return !!template.customerId;
      });
      break;
    case TEXT:
      newList = list.filter((template) => {
        return template.textFrameNum > 0 && !template.customerId;
      });
      break;
    default:
      newList = numTemplate[tag] || list;
      break;
  }

  let verticalImgNum = 0;
  let horizontalImgNum = 0;
  let squareImgNum = 0;

  const elements = page ? page.get('elements') : fromJS([]);

  // 统计element的横竖个数
  elements.forEach((ele) => {
    if (ele.get('type') === elementTypes.photo) {
      const width = ele.get('width');
      const height = ele.get('height');
      if (width > height) {
        horizontalImgNum++;
      } else if (width < height) {
        verticalImgNum++;
      } else {
        squareImgNum++;
      }
    }
  });

  let copyNewList = merge([], newList);

  const elementSize = elements.filter((ele) => {
    return ele.get('type') === elementTypes.photo;
  }).size;

  // toppicks, n+, my layouts, text
  if (isNaN(tag)) {
    if (tag.indexOf('+') >= 0) {
      copyNewList = newList.filter(m => m.imageNum >= maxNum);
    }
  } else {
    // number.
    if (elementSize === parseInt(tag)) {
      copyNewList = newList.filter(m => m.imageNum === elementSize);
    } else {
      copyNewList = newList.filter(m => m.imageNum === parseInt(tag));
    }
  }

  // 把符合条件的放在最前面.
  const matchedList = copyNewList.filter(m => {
    return m.horizontalNum === horizontalImgNum &&
      m.verticalNum === verticalImgNum &&
      m.squareNum === squareImgNum;
  }) || [];

  const matchedAddtionalList = copyNewList.filter(m => {
    return !(m.horizontalNum === horizontalImgNum &&
      m.verticalNum === verticalImgNum &&
      m.squareNum === squareImgNum);
  }) || [];

  copyNewList = matchedList.concat(matchedAddtionalList);

  // 如果没找到合适的模板, 并且当前点击的filter不是my layout和text.
  // 就切换到top picks.
  if (!copyNewList.length &&
      tag !== MY &&
      tag !== TEXT) {
    onSelectFilter(TOP);
  }

  if (copyNewList.length) {
    copyNewList = copyNewList.map((item) => {
      const templateUrl = template(TEMPLATE_SRC)({
        templateThumbnailPrefx,
        size,
        guid: item.guid
      });

      return merge({}, item, {
        templateUrl
      });
    });
  }

  // 更新新的layout图片的大小.
  setNewImageSizeInState(that, copyNewList);

  that.setState({
    templateList: copyNewList
  });
};


export const onLayoutDragStarted = (that, guid, event) => {
  setTransferData(event, {
    type: dragTypes.template,
    guid
  });
  // dragover, dragenter 没法从dataTransfer传值，所以借用window传值
  __app.dragType = dragTypes.template;
};


export const handlerMouseWheel = (that, dir) => {
  that.layoutList.scrollLeft += dir * mouseWheel.width;
};
