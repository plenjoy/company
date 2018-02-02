import React from 'react';
import { fromJS, is } from 'immutable';
import { hashHistory } from 'react-router';
import {
  computedItemCountdAndWidthInRow,
  convertToTwoDimenArr,
  getImgRatioFromProjectSize
} from '../../../../../common/utils/helper';

import { minWidthOfTheme } from '../../../contants/strings';

import ThemeItem from '../../ThemeItem';
import emptyThemlist from '../icon/emptyimage.svg'
let timer;

export const onClickTheme = (that, theme) => {
  const { actions } = that.props;
  const {
    boundThemeOverlayModalActions,
    boundThemeActions,
    boundTrackerActions
  } = actions;
  boundTrackerActions.addTracker(
    `ClickBookTheme,${theme.get('themeTitle')},${theme.get('guid')},${theme.get('typeCode')}`
  );
  boundThemeOverlayModalActions.showThemeOverlayModal({
    theme,
    onApplyClick: (theme) => {
      that.applyTheme(theme);
    }
  });
};

export const getThemeHtml = (that) => {
  const { data } = that.props;
  const { themeSummary,project} = data;
  const applyBookThemeId = project.property.get('applyBookThemeId');
  const { itemWidth, itemCount, itemMargin } = that.state;
  const html = [];
  const themes = fromJS(convertToTwoDimenArr(data.themes, itemCount));

  if (themes && themes.size) {
    themes.forEach((themeGroup) => {
      if (themeGroup.size) {
        const rows = [];
        themeGroup.forEach((theme) => {
          const size = theme.get('size');
          const imgRatio = getImgRatioFromProjectSize(size);
          const style = {
            width: `${itemWidth}px`,
            height: `${itemWidth * imgRatio}px`
          };
          const isActived =
            applyBookThemeId && applyBookThemeId === theme.get('guid');
          rows.push(
            <ThemeItem
              key={theme.get('guid')}
              style={style}
              theme={theme}
              isActived={isActived}
              onClicked={that.onClickTheme}
            />
          );
        });

        if (rows.length) {
          const style = {
            width: `${itemWidth * itemCount + itemMargin * (itemCount - 1)}px`
          };
          html.push(
            <div className="row" style={style}>
              {rows}
            </div>
          );
        }
      }
    });
  }else{
    html.push(
       <div className='empty-theme'>
        <img src={emptyThemlist} />
        <div className='text'> No Available Theme.</div>
       </div>
      )
  }

  return html;
};

export const onResize = (that) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    const { width, count } = computedItemCountdAndWidthInRow(
      that.node.clientWidth,
      30,
      30,
      minWidthOfTheme,
      27
    );

    that.setState({
      itemWidth: width,
      itemCount: count
    });
  }, 300);
};

export const applyTheme = (that, theme) => {
  const { actions, data } = that.props;
  const { boundTrackerActions, boundThemeActions } = actions;
  const { hasAddedElements } = data;
  const {
    boundProjectActions,
    boundThemeOverlayModalActions,
    boundNotificationActions,
    boundConfirmModalActions,
    boundPaginationActions,
    boundTogglePanelActions,
    setLoading
  } = actions;
  boundThemeOverlayModalActions.hideThemeOverlayModal();
  const applyTheme = () => {
    setLoading(true);
    boundTrackerActions.addTracker(
      `ClickApplyAndContinue,${theme.get('themeTitle')},${theme.get('guid')},${theme.get(
        'typeCode'
      )}`
    );
    boundProjectActions.applyTheme(theme).then(
      () => {
        setLoading(false);
        // 跳转到封面
        boundPaginationActions.switchSheet(0);

        // 跳转到editpage
        hashHistory.push('/editpage');

        boundTogglePanelActions.changePanelTab(1);
      },
      () => {
        boundNotificationActions.addNotification({
          message:
            'An unexpected error occurred, please check your network and try again',
          level: 'error',
          autoDismiss: 0
        });
        setLoading(false);
      }
    );
  };
  if (hasAddedElements) {
    boundConfirmModalActions.showConfirm({
      okButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      confirmMessage:
        'This operation will initialize your book layout, would you like to continue?',
      onOkClick: () => {
        applyTheme();
        boundThemeActions.choseThemeItem(theme.get('guid'));
      },
      onCancelClick: () => {
        boundTrackerActions.addTracker(
          `ClickApplyAndCancel,${theme.get('themeTitle')},${theme.get('guid')},${theme.get(
            'typeCode'
          )}`
        );
      }
    });
  } else {
    applyTheme();
  }
};
