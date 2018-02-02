import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import noImagesSrc from './assets/NO-IMAGES.png';
import XButton from '../../../../common/ZNOComponents/XButton';

import './index.scss';

class EmptyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  onBack() {
    const { actions } = this.props;
    const { boundOAuthPageActions, boundPhotoArrayActions } = actions;

    window.location.reload();
  }

  render() {
    const { t, actions } = this.props;

    return (
      <div className="empty-page">
        <img className="empty-page-image" src={noImagesSrc} />
        <div className="empty-page-text">{t('EMPTY_PAGE_TEXT')}</div>
        <XButton
          className="empty-page-back"
          width={200}
          height={30}
          onClicked={this.onBack.bind(this)}>
          {t('BACK')}</XButton>
      </div>
    );
  }
}

EmptyPage.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('EmptyPage')(EmptyPage);
