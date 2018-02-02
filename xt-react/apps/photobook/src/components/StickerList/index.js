import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { template, merge, isEqual, get } from 'lodash';
import Immutable, { List } from 'immutable';

import * as handler from './handler.js';

import XButton from '../../../../common/ZNOComponents/XButton';

import './index.scss';

class StickerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStickerId: '',
      numTemplate: {},
      themestickerList: [],
      isImgLoading: true
    };
    this.getMore = () => handler.getMore(this);
    this.onDragStarted = (stickerObj, index, event) =>
      handler.onDragStarted(this, stickerObj, index, event);
    this.receiveProps = nextProps => handler.receiveProps(this, nextProps);
    this.willMount = () => handler.willMount(this);
    this.getStickerHTML = () => handler.getStickerHTML(this);
    this.selectSticker = StickerId => handler.selectSticker(this, StickerId);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.setImgLoading = this.setImgLoading.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.receiveProps(nextProps);
  }

  setImgLoading() {
    this.setState({
      isImgLoading: false
    });
  }

  componentWillMount() {
    this.willMount();
  }
  onMouseDown() {
    // 清除被选中状态
    this.selectSticker();
  }
  render() {
    const { data, t } = this.props;
    const { currentThemeType } = data;
    const { themestickerList } = this.state;

    return (
      <div className="sticker-list" draggable="false">
        {themestickerList && themestickerList.length ? (
          this.getStickerHTML()
        ) : (
          <span className="no-stickers">{t('NO_STICKERS')}</span>
        )}
      </div>
    );
  }
}

StickerList.proptype = {};

export default translate('StickerList')(StickerList);
