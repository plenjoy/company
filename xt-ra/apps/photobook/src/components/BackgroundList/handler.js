import { template, merge, isEqual, get } from 'lodash';
import React from 'react';
import { is, fromJS } from 'immutable';
import { setTransferData } from '../../../../common/utils/drag';
import BackgroundItem from '../BackgroundItem';
import XDrag from '../../../../common/ZNOComponents/XDrag/';
import XButton from '../../../../common/ZNOComponents/XButton';
import { THEME_STICKER_SRC, BACKGROUND_SRC } from '../../contants/apiUrl';
import { elementTypes, dragTypes } from '../../contants/strings';
import XTextLoading from '../../../../common/ZNOComponents/XTextLoading';

export const receiveProps = (that, nextProps) => {
  const oldBackgroundsList = that.props.data.backgrounds;
  const newBackgroundsList = nextProps.data.backgrounds;

  if (!is(oldBackgroundsList, newBackgroundsList)) {
    that.setState({
      backgroundsList: newBackgroundsList
    });
  }
};

export const willMount = (that) => {
  const backgrounds = that.props.data.backgrounds;
  that.setState({
    backgroundsList: backgrounds
  });
};

export const selectedBackgrounds = (that, selectedBackgroundsId) => {
  that.setState({
    selectedBackgroundsId
  });
};

export const getBackgroundsHTML = (that) => {
  const { data, actions } = that.props;
  const { setImgLoading, isImgLoading, selectedBackgroundsId } = that.state;
  const { baseUrls, setting, stickerUsedMap } = data;
  const { boundProjectActions,boundTrackerActions } = actions;
  const { backgroundsList } = that.state;

  const allbackgroundsList = backgroundsList.unshift({
    isDefaultBackground: true,
    code: 'defaultBackground'
  }).toJS();

  return allbackgroundsList.map((background, index) => {
    const { code, suffix } = background;
    const backgroundUrl = template(BACKGROUND_SRC)({
      calendarBaseUrl: baseUrls.get('calendarBaseUrl'),
      backgroundCode: code,
      size: 96,
      suffix: suffix || 'jpg'
    });
    const backgroundsObj = merge({}, background, {
      backgroundUrl,
      type: elementTypes.background
    });

    const usedCount = 0;
    const selected = (selectedBackgroundsId === code);
    const backgroundProps = {
      background: backgroundsObj,
      isSelected: selected,
      usedCount,
      setImgLoading: that.setImgLoading,
      applyBackground: boundProjectActions.applyBackground,
      applyDefaultBackground: boundProjectActions.applyDefaultBackground,
      selectedBackgrounds: that.selectedBackgrounds,
      boundTrackerActions
    };
    return (
      <XDrag
        key={code}
        onDragStarted={that.onDragStarted.bind(that, backgroundsObj, index)}
      >
        <XTextLoading isShown={isImgLoading} />
        <BackgroundItem {...backgroundProps} />
      </XDrag>
    );
  });
};

export const onDragStarted = (that, backgroundsObj, index, event) => {
  // 取消选中
  that.selectedBackgrounds('');
  __app.dragType = dragTypes.background;
  setTransferData(event, backgroundsObj);
};
