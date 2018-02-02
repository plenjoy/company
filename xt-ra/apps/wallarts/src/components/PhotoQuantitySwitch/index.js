import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';

import split from './split.svg';
import splitS from './split-s.svg';
import standard from './standard.svg';
import standardS from './standard-s.svg';
import { enumPhotoQuantity } from '../../constants/strings';

import './index.scss';

class PhotoQuantitySwitch extends Component {
  constructor(props) {
    super(props);
  }


  changeSetting(photoQuantity) {
    const { actions } = this.props;
    const { boundProjectActions } = actions;
    boundProjectActions.changeProjectSetting({
      photoQuantity
    });
  }

  render() {
    const { data, t } = this.props;
    const { settings } = data;
    const currentPhotoQuantity = settings.get('photoQuantity');
    const label1Class = classNames('label', {
      active: currentPhotoQuantity === enumPhotoQuantity.one
    });
    const label2Class = classNames('label', {
      active: currentPhotoQuantity === enumPhotoQuantity.three
    });
    return (
      <ul className="photo-quantity-switch">
        <li><a href="javascript:void(0);" onClick={this.changeSetting.bind(this, enumPhotoQuantity.one)}>
          {
            currentPhotoQuantity === enumPhotoQuantity.one ?
              <img src={standard} /> : <img src={standardS} />
          }
          <div className={label1Class}>{t('STANDARD')}</div>
        </a></li>
        <li><a href="javascript:void(0);" onClick={this.changeSetting.bind(this, enumPhotoQuantity.three)}>
          {
            currentPhotoQuantity === enumPhotoQuantity.three ?
              <img src={split} /> : <img src={splitS} />
          }
          <div className={label2Class}>{t('SPLIT')}</div>
        </a></li>
      </ul>
    );
  }
}

export default translate('PhotoQuantitySwitch')(PhotoQuantitySwitch);
