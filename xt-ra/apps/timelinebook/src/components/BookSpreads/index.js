import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import classNames from 'classnames';
import * as main from './handle/main';
import loadingSrc from './assets/loading.svg';
import XWayPoint from '../../../../common/ZNOComponents/XWayPoint';

import './index.scss';

class BookSpreads extends Component {
  constructor(props) {
    super(props);

    this.getBookSpread = main.getBookSpread.bind(this);
    this.spreadDOM = null;
  }

  render() {
    const { t, data, actions } = this.props;
    const {
      env,
      selectedVolume,
      materials,
      summary,
      isViewRending
    } = data;

    const {
      boundProjectsActions,
      boundPhotoArrayActions,
      boundViewPropertiesActions,
      boundTrackerActions
    } = actions;

    const computedSpreadRows = selectedVolume && selectedVolume.get('computedPages') || [];

    const bookSpreadLoadingClass = classNames('book-spread-loading', {
      hide: !isViewRending
    });

    return (
      <div className="book-spreads" ref={target => this.spreadDOM = target}>
        {computedSpreadRows.map((computedSpreadRow, rowIdx) => (

          <XWayPoint key={rowIdx} container={this.spreadDOM}>
            <div className='book-spread-row'>

              {computedSpreadRow.map((computedPage, spreadId) => {
                const isCover = computedPage.getIn(['computed', 'isCover']);
                // 此处用不用guid会更快
                // const spreadId = computedPage.getIn(['computed', 'guid']);
                const spreadData = { env, computedPage, isCover, materials, summary };
                const spreadActions = { boundProjectsActions, boundPhotoArrayActions, boundViewPropertiesActions,boundTrackerActions };

                return this.getBookSpread(spreadData, spreadActions, spreadId);
              })}

              <div className="clearfix"></div>
            </div>
          </XWayPoint>
        ))}

        <div className={bookSpreadLoadingClass}>
          <img src={loadingSrc} />
        </div>
      </div>
    );
  }
}

BookSpreads.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('BookSpreads')(BookSpreads);
