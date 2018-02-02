import React, { Component, PropTypes } from 'react';
import { get, isEqual } from 'lodash';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import classNames from 'classnames';
import XDrag from '../../../../common/ZNOComponents/XDrag';
import './index.scss';

class PageNumber extends Component {
  constructor(props) {
    super(props);

    const { actions } = this.props;
    const { onDragStarted, onDragEnded, onMouseEnter, onMouseLeave } = actions;

    this.switchPage = (pageBtn, index) => {
      const { actions } = this.props;
      const { switchPage } = actions;
      const disable = pageBtn.get('disable');

      if (!disable) {
        switchPage && switchPage(index);
      }
    };

    // 拖拽事件.
    this.onDragStart = (sheetIndex, pageIndex, event) => {
      onDragStarted && onDragStarted(sheetIndex, pageIndex, event);
    };

    this.onDragEnd = (sheetIndex, pageIndex, event) => {
      onDragEnded && onDragEnded(sheetIndex, pageIndex, event);
    };

    this.onMouseEnter = (page, ev) => {
      onMouseEnter && onMouseEnter(page, ev);
    };
    this.onMouseLeave = (page, ev) => {
      onMouseLeave && onMouseLeave(page, ev);
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldPageNumber = get(this.props, 'data.pageNumber');
    const oldStyle = get(this.props, 'data.style');

    const newPageNumber = get(nextProps, 'data.pageNumber');
    const newStyle = get(nextProps, 'data.style');

    if (Immutable.is(oldPageNumber, newPageNumber) && isEqual(oldStyle, newStyle)) {
      return false;
    }

    return true;
  }

  render() {
    const { data, actions, children } = this.props;
    const {
      className,
      pages,
      pageNumber,
      style,
      pageItemStyle,
      isShowActive = true,
      isBlue = false
    } = data;

    const leftPage = pageNumber.get('leftPage');
    const rightPage = pageNumber.get('rightPage');

    const leftPageData = pages && pages.size ? pages.get(leftPage.get('index')) : null;
    const isLeftPageDraggable = leftPageData ? leftPageData.get('isPageDraggable') : false;

    const rightPageData = pages && pages.size ? pages.get(rightPage.get('index')) : null;
    const isRightPageDraggable = rightPageData ? rightPageData.get('isPageDraggable') : false;

    // 判断左右页是不是相同的页.
    const isFullPage = leftPage.get('index') === rightPage.get('index');
    const fullPageClassName = classNames('full-page-number clearfix', {
      active: isShowActive ? (leftPage.get('active') || rightPage.get('active')) : null,
      disable: isShowActive ? (leftPage.get('disable') || rightPage.get('disable')) : null,
      'keep-same': leftPage.get('keepSame')
    });

    const isLeftActive = isShowActive ? leftPage.get('active') : false;
    const isRightActive = isShowActive ? rightPage.get('active') : false;
    const pageNumberClassName = classNames('page-number', className);
    const leftPageClassName = classNames('page-item', {
      blue: isBlue,
      active: isLeftActive,
      'cursor-p': isLeftActive || isRightActive,
      disable: leftPage.get('disable'),
      left: isFullPage,
      'left-item': !isFullPage
    });
    const rightPageClassName = classNames('page-item', {
      blue: isBlue,
      active: isRightActive,
      'cursor-p': isLeftActive || isRightActive,
      disable: rightPage.get('disable'),
      right: isFullPage,
      'right-item': !isFullPage
    });

    const leftText = pageNumber.getIn(['leftPage', 'text']);
    const rightText = pageNumber.getIn(['rightPage', 'text']);

    // btn html.
    const leftPageHtml = (
      <div
        onClick={this.switchPage.bind(this, leftPage, 0)}
        className={leftPageClassName}
        onMouseEnter={this.onMouseEnter.bind(this, leftPage)}
        onMouseLeave={this.onMouseLeave.bind(this, leftPage)}
      >
        {leftText}
      </div>
    );
    const rightPageHtml = (
      <div
        onClick={this.switchPage.bind(this, rightPage, 1)}
        className={rightPageClassName}
        onMouseEnter={this.onMouseEnter.bind(this, rightPage)}
        onMouseLeave={this.onMouseLeave.bind(this, rightPage)}
      >
        {rightText}
      </div>
    );

    return (<div className={pageNumberClassName} style={style}>
      {
          isFullPage ? (
            isLeftPageDraggable ? (
              <XDrag
                onDragStarted={this.onDragStart.bind(this, leftPage.get('sheetIndex'), leftPage.get('index'))}
                onDragEnded={this.onDragEnd.bind(this, leftPage.get('sheetIndex'), leftPage.get('index'))}
              >
                <div className={fullPageClassName}>
                  {leftText ? leftPageHtml : null}
                  {rightText ? rightPageHtml : null}
                </div>
              </XDrag>
            )
            : (<div className={fullPageClassName}>
              {leftText ? leftPageHtml : null}
              {rightText ? rightPageHtml : null}
            </div>)
          ) : (<div>
            {
                  isLeftPageDraggable ? (
                    <XDrag
                      onDragStarted={this.onDragStart.bind(this, leftPage.get('sheetIndex'), leftPage.get('index'))}
                      onDragEnded={this.onDragEnd.bind(this, leftPage.get('sheetIndex'), leftPage.get('index'))}
                    >
                      {leftText ? leftPageHtml : null}
                    </XDrag>
                  )
                  : (leftText ? leftPageHtml : null)
                }

            {
                  isRightPageDraggable ? (
                    <XDrag
                      onDragStarted={this.onDragStart.bind(this, rightPage.get('sheetIndex'), rightPage.get('index'))}
                      onDragEnded={this.onDragEnd.bind(this, rightPage.get('sheetIndex'), rightPage.get('index'))}
                    >
                      {rightText ? rightPageHtml : null}
                    </XDrag>
                  )
                  : (rightText ? rightPageHtml : null)
                }
          </div>
            )
        }
    </div>);
  }
}

PageNumber.propTypes = {
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

PageNumber.defaultProps = {
  actions: {
    switchPage: () => {}
  },
  data: {
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

export default translate('PageNumber')(PageNumber);
