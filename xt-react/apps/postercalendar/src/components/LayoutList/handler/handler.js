import React from 'react';
import classNames from 'classnames';
import Immutable, { fromJS } from 'immutable';
import { merge, template, get, isEqual } from 'lodash';
import { TEMPLATE_SRC } from '../../../constants/apiUrl';
import {
  elementTypes,
  productTypes,
  dragTypes,
  mouseWheel,
  LAYOUT_MAX_VIEW_NUM_PS,
  LAYOUT_MAX_VIEW_NUM_DEFAULT
} from '../../../constants/strings';

import { loadImg } from '../../../utils/image';
import { filterOptions } from '../../../constants/strings';

import LayoutItem from '../../LayoutItem';

import { setTransferData } from '../../../../../common/utils/drag';
import XDrag from '../../../../../common/ZNOComponents/XDrag';

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

export const getTemplateHTML = (that) => {
  const { data, actions, t } = that.props;
  const { applyTemplate, boundTemplateActions, onSelectFilter } = actions;
  const { baseUrls, setting, paginationSpread, page, userInfo, currentFilterTag, pagination } = data;
  const { templateList, imageSize, colNumber } = that.state;

  if (setting) {
    const pages = paginationSpread.get('pages');
    const pageId = pagination.pageId;
    let selectedTemplateId = page ? page.getIn(['template', 'tplGuid']) : 0;

    // 如果当前page没有元素则没有选中模板
    if (page && page.get('elements').size === 0) {
      selectedTemplateId = 0;
    }

    return templateList.map((templt, key) => {
      const isSelected = selectedTemplateId === templt.guid;

      // layout data and actions
      const layoutItemData = fromJS({
        template: templt,
        imageSize,
        isSelected,
        userInfo
      });

      // const layoutItemActions = { applyTemplate, deleteTemplate: boundTemplateActions.deleteTemplate, onSelectFilter };
      const layoutItemActions = { applyTemplate: that.applyTemplate, deleteTemplate: () => {}, onSelectFilter: () => {} };

      const itemClass = classNames('lazy-item', {
        selected: isSelected
      });

      return (
        <div className={itemClass} key={templt.guid}>
          <LayoutItem
            actions={layoutItemActions}
            data={layoutItemData}
          />
        </div>
      );
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
    return next.imageNum - prev.imageNum;
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

const filterTemplate = (that, templateList, pagination, setting, pageEnabled = true) => {
  let newList = [];

  newList = templateList.filter((item) => {
    return true;
    // return !(item.imageNum === 0 && item.textFrameNum === 0);
  });
  // newList.length > 15 ? newList.length = 15 : newList;
  return newList;
};

const filterTemplateListByStyle = (list, styles, styleId) => {
  let newList;
  const selectedStyle = styles.find(s => {return s.id == styleId});
  let styleGuid = '';
  if (selectedStyle) {
    styleGuid = selectedStyle.guid;
    newList = list.filter((item) => {
      return item.styleGuid == styleGuid;
    });
    return newList;
  } else {
    return list;
  };
};


const getFilterTemplateList = (that, list, pagination, setting, pageEnabled) => {
  let newList = filterTemplate(that, list, pagination, setting, pageEnabled);

  // 按照使用频次排序
  newList = newList.sort((prev, next) => {
    if(next.isCoverDefault) { return 1; }
    return prev.imageNum - next.imageNum;
  });

  return newList;
};

// handlers write here
export const receiveProps = (that, nextProps) => {
  const oldList = get(that.props, 'data.template.list');
  let newList = get(nextProps, 'data.template.list');

  // page切换时.
  const oldPage = fromJS(get(that.props, 'data.page'));
  const newPage = fromJS(get(nextProps, 'data.page'));

  const oldElements = oldPage ? oldPage.get('elements') : fromJS({});
  const newElements = newPage ? newPage.get('elements') : fromJS({});

  const oldSelectedTemplateId = oldPage
    ? oldPage.getIn(['template', 'tplGuid'])
    : -1;
  const newSelectedTemplateId = newPage
    ? newPage.getIn(['template', 'tplGuid'])
    : -1;

  const oldSetting = get(that.props, 'data.setting');
  const setting = get(nextProps, 'data.setting');

  const pageEnabled = newPage && newPage.get('enabled');

  const pagination = get(nextProps, 'data.pagination');
  const styles = get(nextProps, 'data.styles');
  const baseUrls = get(nextProps, 'data.baseUrls');

  const oldSize = get(oldSetting, 'spec.size');
  const newSize = get(setting, 'spec.size');
  if (
    oldList.length !== newList.length ||
    oldSelectedTemplateId !== newSelectedTemplateId ||
    !isEqual(oldList, newList)
  ) {
    const styleId = get(setting, 'calendarSetting.styleId');
    // 获取过滤好的模板列表.
    newList = getFilterTemplateList(that, newList, pagination, setting, pageEnabled);

    newList = filterTemplateListByStyle(newList, styles, styleId);

    if (newList.length) {
      const templateThumbnailPrefx = baseUrls.layoutTemplateServerBaseUrl;
      const size = get(setting, 'spec.size');
      const productType = get(setting, 'spec.product');
      const orientation = get(setting, 'spec.orientation');
      const designSize = productType !== productTypes.LC && orientation !== 'Portrait'
        ? size.split('X')[1] + 'X' + size.split('X')[0]
        : size;
      newList = newList.map((item) => {
        const templateUrl = template(TEMPLATE_SRC)({
          templateThumbnailPrefx,
          size: designSize,
          guid: item.guid
        });

        return merge({}, item, {
          templateUrl
        });
      });
    }

    // 更新新的layout图片的大小.
    setNewImageSizeInState(that, newList);

    that.setState({
      templateList: newList
    });
  }
};

export const didMount = (that) => {
  let newList = get(that.props, 'data.template.list');

  // page切换时.
  const page = fromJS(get(that.props, 'data.page'));

  const elements = page ? page.get('elements') : fromJS({})

  const selectedTemplateId = page
    ? page.getIn(['template', 'tplGuid'])
    : -1;

  const pageEnabled = page && page.get('enabled');

  const pagination = get(that.props, 'data.pagination');
  const setting = get(that.props, 'data.setting');
  const styles = get(that.props, 'data.styles');
  const baseUrls = get(that.props, 'data.baseUrls');

  if (newList.length) {
    const styleId = get(setting, 'calendarSetting.styleId');
    // 获取过滤好的模板列表.
    newList = getFilterTemplateList(that, newList, pagination, setting, pageEnabled);

    newList = filterTemplateListByStyle(newList, styles, styleId);

    if (newList.length) {
      const templateThumbnailPrefx = baseUrls.layoutTemplateServerBaseUrl;
      const size = get(setting, 'spec.size');
      const productType = get(setting, 'spec.product');
      const designSize = productType === productTypes.LC
        ? size
        : size.split('X')[1] + 'X' + size.split('X')[0];
      newList = newList.map((item) => {
        const templateUrl = template(TEMPLATE_SRC)({
          templateThumbnailPrefx,
          size: designSize,
          guid: item.guid
        });

        return merge({}, item, {
          templateUrl
        });
      });
    }

    // 更新新的layout图片的大小.
    setNewImageSizeInState(that, newList);

    that.setState({
      templateList: newList
    });
  }
};
