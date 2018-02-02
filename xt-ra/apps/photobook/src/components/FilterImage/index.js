import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import XRadio from '../../../../common/ZNOComponents/XRadio';

import './index.scss';

class FilterImage extends Component {
  constructor(props) {
    super(props);
  }

  handleChangeFilter(filterTag) {
    const { changeFilter } = this.props;
    changeFilter && changeFilter(filterTag);
  }

  render() {
    const { t, effectId } = this.props;
    return (
      <ul className="filter-img">
        <li>
          <XRadio
            checked={effectId === 0 ? true : false}
            text={t('NO_FILTER')}
            onClicked={this.handleChangeFilter.bind(this, 'no')}
          />
        </li>
        <li>
          <XRadio
            checked={effectId === 1 ? true : false}
            text={t('BLACK_WHITE')}
            onClicked={this.handleChangeFilter.bind(this, 'bw')}
          />
        </li>
        <li>
          <XRadio
            checked={effectId === 2 ? true : false}
            text={t('SEPIA')}
            onClicked={this.handleChangeFilter.bind(this, 'sepia')}
          />
        </li>

        {/* TODO: 后台出图模糊. 暂时先屏蔽.
          <li>
            <input type="radio"
                   name="filter"
                   id="f4"
                   checked={effectId===3?true:false}
                   onClick={this.handleChangeFilter.bind(this, 'mono')} />
            <label htmlFor="f4">{t('MONO_CHROME')}</label>
          </li>
          <li>
            <input type="radio"
                   name="filter"
                   id="f5"
                   checked={effectId===4?true:false}
                   onClick={this.handleChangeFilter.bind(this, 'paint')} />
            <label htmlFor="f5">{t("PAINT")}</label>
          </li>
          <li>
            <input type="radio"
                   name="filter"
                   id="f6"
                   checked={effectId===5?true:false}
                   onClick={this.handleChangeFilter.bind(this, 'spread')} />
            <label htmlFor="f6">{t('SPREAD')}</label>
          </li>
        */}
      </ul>
    );
  }
}

FilterImage.propTypes = {
  effectId: PropTypes.number,
  changeFilter: PropTypes.func
};

export default translate('FilterImage')(FilterImage);
