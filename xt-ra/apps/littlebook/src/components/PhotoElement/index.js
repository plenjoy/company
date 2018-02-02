import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { merge } from 'lodash';
import classNames from 'classnames';

// 导入组件
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XWarnTip from '../../../../common/ZNOComponents/XWarnTip';
import Element from '../Element';

import { RESIZE_LIMIT } from '../../contants/strings';

// 导入处理函数
import * as events from './handler/events';
import * as dragHandler from './handler/dragHandler';

import './index.scss';

class PhotoElement extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    const { element } = data;
    // 处理函数
    this.onDragOver = event => dragHandler.handleDragOver(this, event);
    this.onDragLeave = event => dragHandler.handleDragLeave(this, event);
    this.onDragEnter = event => dragHandler.handleDragEnter(this, event);
    this.onDragEnd = event => dragHandler.handleDragEnd(this, event);
    this.onDrop = event => dragHandler.onDrop(this, event);
    this.imgError = this.imgError.bind(this);

    // 内部state
    this.state = {
      isImgLoading: false,
      isHover: false,
      isDragTemplate: false,
      src: element ? element.getIn(['computed', 'imgUrl']) : null
    };

    this.hideLoading = () => {
      this.setState({
        isImgLoading: false
      });
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      Immutable.is(this.props.data.element, nextProps.data.element) &&
      this.state.isImgLoading === nextState.isImgLoading &&
      this.state.img === nextState.img &&
      this.state.src === nextState.src &&
      this.state.isHover === nextState.isHover
    ) {
      return false;
    }

    return true;
  }

  imgError() {
    const { boundTrackerActions } = this.props.actions;
    boundTrackerActions.addTracker('AutoRenderFailed');
  }

  componentWillReceiveProps(nextProps) {
    events.componentWillReceiveProps(this, nextProps);
  }

  render() {
    const { t, actions, data } = this.props;
    const { isHover, isDragTemplate } = this.state;
    const { element, ratio, page, isPreview, isCover, size } = data;
    const pageWidth = page.get('width') * ratio.workspace;
    const pageHeight = page.get('height') * ratio.workspace;
    const bleedLeft = page.getIn(['bleed', 'left']) * ratio.workspace;
    const bleedTop = page.getIn(['bleed', 'top']) * ratio.workspace;
    const computed = element.get('computed');
    const imgUrl = element.getIn(['computed', 'imgUrl']);
    const scale = element.getIn(['computed', 'scale']);

    const left = computed.get('left');
    const top = computed.get('top');
    const width = computed.get('width');
    const height = computed.get('height');

    let sheetSizeWithoutBleed = size.renderInnerSheetSizeWithoutBleed;
    if (isCover) {
      sheetSizeWithoutBleed = size.renderCoverSheetSizeWithoutBleed;
    }

    const { isImgLoading, src } = this.state;

    const containerStyle = {
      zIndex: element.get('dep') + 100,
      width,
      height,
      left,
      top,
      transform: `rotateZ(${element.get('rot')}deg)`
    };
    const handlerStyle = {
      position: 'absolute',
      width: `${computed.get('width')}px`,
      height: `${computed.get('height')}px`,
      top: 0,
      left: 0
    };

    const hasImage = Boolean(imgUrl);
    const isSelected = element.get('isSelected');

    // 边框.
    const imgStyle = merge(
      {},
      {
        display: hasImage ? 'block' : 'none',
        border: computed.get('border') ? `${computed.get('border')}` : 'none'
      }
    );

    // element
    const elementActions = merge({}, actions, {
      handleDrop: this.onDrop,
      handleDragOver: this.onDragOver,
      handleDragEnter: this.onDragEnter,
      handleDragLeave: this.onDragLeave,
      handleDragEnd: this.onDragEnd
    });

    const elementData = merge({}, data, {
      className: classNames('photo-element', {
        preview: isPreview,
        'has-image': hasImage,
        selected: isSelected,
        // 图片地址存在但是下载图片失败.
        'error-image': hasImage && !src,
        hover: isHover
      }),
      style: containerStyle,
      handlerStyle
    });

    const hoverBoxClass = classNames('box', {
      hover: isHover
    });

    let hoverBoxStyle = merge({}, handlerStyle);

    if (isDragTemplate) {
      hoverBoxStyle = merge({}, hoverBoxStyle, {
        left:
          computed.get('left') > bleedLeft
            ? `-${computed.get('left') - bleedLeft}px`
            : `${bleedLeft}px`,
        top:
          computed.get('top') > bleedTop
            ? `-${computed.get('top') - bleedTop}px`
            : `${bleedTop}px`,
        width: `${sheetSizeWithoutBleed.width}px`,
        height: `${sheetSizeWithoutBleed.height}px`
      });
    }

    const warnTipProps = {
      isShown: scale > RESIZE_LIMIT,
      title: t('BEYOND_SIZE_TIP', { n: scale, m: RESIZE_LIMIT }),
      style: {
        left: `${bleedLeft + 8}px`,
        bottom: `${bleedTop + 8}px`
      }
    };

    return (
      <Element actions={elementActions} data={elementData}>
        <XLoading isShown={isImgLoading} />
        <div className={hoverBoxClass} style={hoverBoxStyle} />
        {src
          ? <img
            onError={this.imgError}
            className="photo-img"
            src={src}
            style={imgStyle}
          />
          : isPreview
            ? null
            : <span className="empty-tip" data-html2canvas-ignore="true">
              {t('DRAG_IMAGE_HERE')}
            </span>}

        {isPreview ? null : <XWarnTip {...warnTipProps} />}
      </Element>
    );
  }
}

PhotoElement.propTypes = {};

export default translate('PhotoElement')(PhotoElement);
