import React, { Component, PropTypes } from 'react';
import OptionItem from '../OptionItem';
import './index.scss';
import { resetSettingHandler, getProjectAvailableOptions } from './handler';

class OptionList extends Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  /**
   * Option点击触发changeProjectSetting
   * @param {*} type 
   * @param {*} value 
   */
  onClick(type, value) {
    const { boundProjectActions, setting } = this.props;

    if(setting[type] !== value) {
      boundProjectActions.changeProjectSetting(
        Object.assign({}, setting, {[type]: value})
      );
    }
  }

  render() {

    const {
      setting,
      allOptionMap,
      variableArray,
      configurableOptionArray
    } = this.props;

    // 获取Option可选项列表
    const optionMaps = getProjectAvailableOptions(
      resetSettingHandler(setting),
      configurableOptionArray,
      allOptionMap,
      variableArray
    );

    return (
      <div className="OptionList">
        {optionMaps.map(({title, options, showHr, type}, mIndex) => {

          if(options.some(option => option.id === 'none') && options.length === 1) return null;

          return (
            <div className={`OptionType${showHr ? ' showHr' : ''}`} key={mIndex}>
              <div className="OptionType__title">{title}</div>

              {options.map((option, oIndex) =>
                <OptionItem
                  type={type}
                  key={oIndex}
                  id={option.id}
                  title={option.name || option.title}
                  onClick={this.onClick}
                  isSelected={option.isSelected}
                  thumbnailUrl={option.thumbnailUrl}
                />
              )}

            </div>
          )
        }
        )}
      </div>
    );
  }
}

OptionList.propTypes = {};

export default OptionList;
