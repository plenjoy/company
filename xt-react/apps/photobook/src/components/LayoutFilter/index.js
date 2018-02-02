import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import * as handler from './handler.js';
import { filterOptions } from '../../contants/strings';

import './index.scss';

class LayoutFilter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { nums, onSelectFilter, currentFilterTag, className, t, capability } = this.props;
    const { TOP, MY, TEXT } = filterOptions;
    const filterClass = classNames(className, {
      'layout-filter': true
    });

    return (
      <div className={filterClass}>
        <a
          href="javascript:void(0)"
          className={currentFilterTag === TOP ? 'selected' : ''}
          onClick={onSelectFilter.bind(this, TOP)}
        >
          {t('TOP_PICK')}
        </a>
        {
          nums
          ? nums.map((item, key) => {
            return (
              <a
                href="javascript:void(0)"
                key={key}
                className={currentFilterTag === item ? 'selected' : ''}
                onClick={onSelectFilter.bind(this, item)}
              >
                {item}
              </a>
            );
          })
          : null
        }
        <a
          href="javascript:void(0)"
          className={currentFilterTag === TEXT ? 'selected' : ''}
          onClick={onSelectFilter.bind(this, TEXT)}
        >
          {t('FILTER_TEXT')}
        </a>
        {
          capability.get('canShowMyLayouts') ?
           (
             <a
               href="javascript:void(0)"
               className={currentFilterTag === MY ? 'selected' : ''}
               onClick={onSelectFilter.bind(this, MY)}
             >
               {t('MY_LAYOUTS')}
             </a>
           ) : null
        }

      </div>
    );
  }
}

LayoutFilter.proptype = {

};

export default translate('SideBar')(LayoutFilter);
