import { template, merge, isEqual, get } from 'lodash';
import React from 'react';
import { setTransferData } from '../../../../common/utils/drag';
import StickerItem from '../StickerItem';
import XDrag from '../../../../common/ZNOComponents/XDrag/';
import XButton from '../../../../common/ZNOComponents/XButton';
import { THEME_STICKER_SRC } from '../../contants/apiUrl';
import { elementTypes, dragTypes } from '../../contants/strings';
import XTextLoading from '../../../../common/ZNOComponents/XTextLoading';
import { is, fromJS } from 'immutable';
import LazyLoad from 'react-lazy-load';

export const receiveProps = (that, nextProps) => {
  const oldThemestickerList = that.props.data.themestickerList;
  const newThemestickerList = nextProps.data.themestickerList;
  const newStickerList = newThemestickerList.list;

  if (!is(fromJS(oldThemestickerList), fromJS(newThemestickerList))) {
    that.setState({
      themestickerList: newStickerList
    });
  }
};

export const willMount = that => {
  const themestickerList = get(that.props, 'data.themestickerList.list');
  that.setState({
    themestickerList
  });
};

export const selectSticker = (that, StickerId = '') => {
  const { themestickerList } = that.state;
  themestickerList.map(sticker => {
    if (sticker.stickerCode === StickerId) {
      sticker.selected = true;
    } else {
      sticker.selected = false;
    }
  });
  that.setState({
    themestickerList
  });
};

export const getStickerHTML = that => {
  const { data } = that.props;
  const { setImgLoading, isImgLoading, themestickerList } = that.state;
  const { baseUrls, setting, stickerUsedMap } = data;
  // const currentThemeType = get(data, 'currentThemeType');
  // const currentStickerList = themestickerList[currentThemeType];
  const { stickerList, pageSize, page } = that.state;
  const currentSize = pageSize * page;

  // 将layer放在前面
  // themestickerList.sort((s1, s2) => {
  //   return s2.stickerType === 2;
  // });

  return themestickerList.map((sticker, index) => {
    const { picPath, stickerCode, selected } = sticker;
    const stickerUrl = template(THEME_STICKER_SRC)({
      baseUrl: baseUrls.get('baseUrl'),
      stickerCode,
      size: 96
    });
    const stickerObj = merge({}, sticker, {
      stickerUrl,
      type: elementTypes.sticker
    });

    // const usedCount = stickerUsedMap.get(stickerCode) || 0;
    const usedCount = 0;
    return (
      <XDrag
        key={index}
        onDragStarted={that.onDragStarted.bind(that, stickerObj, index)}
      >
        <LazyLoad height={100} offset={0}>
          <StickerItem
            sticker={stickerObj}
            isSelected={selected}
            usedCount={usedCount}
            setImgLoading={that.setImgLoading}
            selectSticker={that.selectSticker}
          />
        </LazyLoad>
      </XDrag>
    );
  });
};

export const onDragStarted = (that, stickerObj, index, event) => {
  // 取消选中
  that.selectSticker();
  __app.dragType = dragTypes.sticker;
  setTransferData(event, stickerObj);
};
