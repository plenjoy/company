import { get, isEqual } from 'lodash';
import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';

import './index.scss';

class PageNumberIcon extends Component {
  constructor(props) {
    super(props);

    this.switchPage = (index) => {
      const { actions } = this.props;
      const { switchPage } = actions;
      switchPage && switchPage(index);
    };
  }

  render() {
    const { data, actions, children } = this.props;
    const { pagination, style, hasLeftPage, hasRightPage} = data;

    const leftPageClassName = classNames('page-item left-item', {
      'active': get(pagination, 'pageIndex') === 0,
      'disable': !hasLeftPage
    });

    // 如果没有左边页面的时候，右边的 pageIndex 处理成 0 。
    const rightPageIndex = hasLeftPage ? 1 : 0;

    const rightPageClassName = classNames('page-item right-item', {
      'active': get(pagination, 'pageIndex') === rightPageIndex,
      'disable': !hasRightPage
    });

    return (
      <div className="page-number-icon"  style={style}>
        <div
          onClick={this.switchPage.bind(this, 0)}
          className={leftPageClassName}
        >
        </div>
        <div
          onClick={this.switchPage.bind(this, rightPageIndex)}
          className={rightPageClassName} >
        </div>
      </div>
    );
  }
}

PageNumberIcon.propTypes = {
  // actions: PropTypes.shape({
  //   switchPage: PropTypes.func
  // }),
  // data: PropTypes.shape({
  //   pageNumber:{
  //     leftPage: PropTypes.shape({
  //       text: PropTypes.string,
  //       active: PropTypes.bool,
  //       disable: PropTypes.bool
  //     }),
  //     rightPage: PropTypes.shape({
  //       text: PropTypes.string,
  //       active: PropTypes.bool,
  //       disable: PropTypes.bool
  //     })
  //   }
  // })
};

PageNumberIcon.defaultProps = {
  actions: {
    switchPage: () => {}
  },
  data : {
    pageNumber: {
      leftPage: {
        text: 'Page 1',
        active: true,
        disable: false
      },
      rightPage: {
        text: 'Page 2',
        active: false,
        disable: false
      }
    }
  }
};

export default translate('PageNumber')(PageNumberIcon);
