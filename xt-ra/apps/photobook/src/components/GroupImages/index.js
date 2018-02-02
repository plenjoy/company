import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import SortOptions from '../SortOptions';
import './index.scss';

import * as handler from './handler';

class GroupImages extends Component {
  constructor(props) {
    super(props);
    const { t } = props;
    const groupOptions = props.groupOptions;
    const currentOption = props.currentOption;

    this.state = {
      currentOption,
      groupOptions,
      OptionsStatus: false
    };

    this.hideOptions = () => handler.hideOptions(this);
    this.showOptions = () => handler.showOptions(this);
    this.handleOptionChange = option =>
      handler.handleOptionChange(this, option);
  }

  render() {
    const { t, isShow } = this.props;
    const { OptionsStatus, groupOptions, currentOption } = this.state;
    const hideClass = classNames('upload-hide group-by', {
      hide: !isShow
    });

    return (
      <div className={hideClass} draggable="false">
        <div className="t-left" tabIndex="1" onBlur={this.hideOptions}>
          <span className="group-by" onClick={this.showOptions}>
            <label>{t('GROUP_BY')}</label>
            <div className="triangle-down" />
          </span>
          {OptionsStatus ? (
            <SortOptions
              optionValue={currentOption}
              onChanged={this.handleOptionChange}
              hideOptions={this.hideOptions}
              options={groupOptions}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default translate('GroupImages')(GroupImages);
