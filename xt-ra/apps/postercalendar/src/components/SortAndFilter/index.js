import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import SortOptions from '../sortOptions';
import './index.scss';


class SortAndFilter extends Component {
  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      sortOptions: [
        {
          label: t('DATE_TOKEN_O_T_N'),
          value: '>,shotTime'
        },
        {
          label: t('DATE_TOKEN_N_T_O'),
          value: '<,shotTime'
        },
        {
          label: t('UPLOAD_TIME_O_T_N'),
          value: '>,uploadTime'
        },
        {
          label: t('UPLOAD_TIME_N_T_O'),
          value: '<,uploadTime'
        },
        {
          label: t('TITLE_A_Z'),
          value: '>,name'
        },
        {
          label: t('TITLE_Z_A'),
          value: '<,name'
        },
      ],
      sortValue: {
        label: t('UPLOAD_TIME_N_T_O'),
        value: 'upload-time-new-to-old'
      },
      OptionsStatus: false
    };
    this.hideOptions = this.hideOptions.bind(this);
    this.showOptions = this.showOptions.bind(this);
  }

  handleOptionChange(option) {
    this.setState({ sortValue: option });

    const { onSorted } = this.props;
    onSorted({ value: option.value });
  }

  handleHideUsedToggle(event) {
    const { onToggleHideUsed } = this.props;
    const isChecked = event.target.checked;
    onToggleHideUsed(isChecked);
  }
  hideOptions() {
    this.setState({
      OptionsStatus: false
    });
  }
  showOptions() {
    this.setState({
      OptionsStatus: true
    });
  }
  render() {
    const { t, isShow } = this.props;
    const { OptionsStatus } = this.state;
    const hideClass = classNames('upload-hide', {
      hide: !isShow
    });

    return (
      <div className={hideClass}>
        <div
          className="t-left"
          tabIndex="1"
          onBlur={this.hideOptions}
        >
          <span
            className="sort-by"
            onClick={this.showOptions}
          >
            <label>{ t('SORT_BY') }</label>
            <div className="triangle-down" />
          </span>
          {
            OptionsStatus ?
            (
              <SortOptions
                optionValue={this.state.sortValue}
                onChanged={this.handleOptionChange.bind(this)}
                hideOptions={this.hideOptions}
                options={this.state.sortOptions}
              />
            ) : null
          }
        </div>
        <div className="t-right">
          <input type="checkbox" id="hideUsed" onChange={this.handleHideUsedToggle.bind(this)} />
          <label htmlFor="hideUsed" className="hide-used">
            { t('HIDE_USED') }
          </label>
        </div>
      </div>

    );
  }
}


export default translate('SortAndFilter')(SortAndFilter);
