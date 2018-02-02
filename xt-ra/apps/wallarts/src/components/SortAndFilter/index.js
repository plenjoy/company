import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import SortOptions from '../sortOptions';
import './index.scss';

import * as handler from './handler';


class SortAndFilter extends Component {
  constructor(props) {
    super(props);
    const { t } = props;

    const sortOptions = props.sortOptions;
    const currentOption = props.currentOption;

    this.state = {
      sortOptions,
      currentOption,
      OptionsStatus: false
    };

    this.hideOptions = () => handler.hideOptions(this);
    this.showOptions = () => handler.showOptions(this);
    this.handleOptionChange = option => handler.handleOptionChange(this, option);
    this.handleHideUsedToggle = event => handler.handleHideUsedToggle(this, event);
  }
  componentDidMount(){
    //点击canvas容器关闭选择器
    window.addEventListener('click', (event) => {
      if(event.target.nodeName === 'CANVAS') {
        this.setState({
          OptionsStatus: false
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sortOptions && nextProps.sortOptions !== this.props.sortOptions) {
      this.setState({
        sortOptions: nextProps.sortOptions
      });
    }

    if (nextProps.currentOption && nextProps.currentOption !== this.props.currentOption) {
      this.setState({
        currentOption: nextProps.currentOption
      });
    }
  }

  render() {
    const { t, isShow } = this.props;
    const { OptionsStatus } = this.state;
    const hideClass = classNames('upload-hide', {
      hide: !isShow
    });

    return (
      <div className={hideClass} draggable="false">
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
                optionValue={this.state.currentOption}
                onChanged={this.handleOptionChange}
                hideOptions={this.hideOptions}
                options={this.state.sortOptions}
              />
            ) : null
          }
        </div>
        <div className="t-right">
          <input type="checkbox" id="hideUsed" onChange={this.handleHideUsedToggle} />
          <label htmlFor="hideUsed" className="hide-used">
            { t('HIDE_USED') }
          </label>
        </div>
      </div>
    );
  }
}


export default translate('SortAndFilter')(SortAndFilter);
