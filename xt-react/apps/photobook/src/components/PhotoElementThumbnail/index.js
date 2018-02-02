import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import classNames from 'classnames';

// 导入组件
import XTextLoading from '../../../../common/ZNOComponents/XTextLoading';
import { isSafari } from '../../../../common/utils/browser';
import Element from '../Element';

// 导入处理函数
import * as events from './handler/events';

import './index.scss';

class PhotoElementThumbnail extends Component {
  constructor(props) {
    super(props);

    // 内部state
    this.state = {
      isImgLoading: false,
      src: null,
      isShowActionBar: true,
      isShowHover: false
    };

    this.hideLoading = () => {
      this.setState({
        isImgLoading: false
      });
    };
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onImageError = this.onImageError.bind(this);

    this.handleMouseOver = (data, e) => events.handleMouseOver(this, data, e);
    this.handleMouseOut = (data, e) => events.handleMouseOut(this, data, e);
  }
  onImageError() {
    this.setState({
      isImgLoading: false
    });
  }

  onImageLoad() {
    this.setState({
      isImgLoading: false
    });
  }

  componentWillMount() {
    const { data } = this.props;
    const { element } = data;
    const computed = element.get('computed');
    const imgUrl = element.getIn(['computed', 'imgUrl']);

    if (imgUrl) {
      if (isSafari) {
        this.setState({
          isImgLoading: true,
          src: imgUrl
        });
      } else {
        events.lazyLoadingImage(this, imgUrl);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      Immutable.is(this.props.data.element, nextProps.data.element) &&
      this.props.data.isHover === nextProps.data.isHover &&
      this.state.isImgLoading === nextState.isImgLoading &&
      this.state.img === nextState.img &&
      this.state.src === nextState.src &&
      this.state.isShowHover === nextState.isShowHover
    ) {
      return false;
    }

    return true;
  }

  componentWillReceiveProps(nextProps) {
    const oldImgUrl = this.props.data.element.getIn(['computed', 'imgUrl']);
    const newImgUrl = nextProps.data.element.getIn(['computed', 'imgUrl']);
    if (oldImgUrl !== newImgUrl) {
      if (isSafari) {
        this.setState({
          src: newImgUrl,
          isImgLoading: true
        });
      } else {
        this.setState({
          src: null
        });
        events.lazyLoadingImage(this, newImgUrl);
      }
    }
  }

  render() {
    const { t, actions, data } = this.props;
    const { element, isHover } = data;
    const computed = element.get('computed');
    const imgUrl = element.getIn(['computed', 'imgUrl']);
    const shadow = element.getIn(['computed', 'shadow']);
    // element 容器的样式.
    const containerStyle = {
      zIndex: element.get('dep') + 2000,
      width: computed.get('width'),
      height: computed.get('height'),
      left: computed.get('left'),
      top: computed.get('top'),
      transform: `rotate(${element.get('rot')}deg)`
    };
    const handlerStyle = {
      position: 'absolute',
      width: `${computed.get('width')}px`,
      height: `${computed.get('height')}px`,
      top: 0,
      left: 0
    };
    const imgStyle = merge({}, handlerStyle, {
      display: imgUrl ? 'block' : 'none',
      border: computed.get('border') ? `${computed.get('border')}` : 'none',
      boxShadow: shadow
        ? `${shadow.get('shadowOffsetX')}px ${shadow.get(
            'shadowOffsetY'
          )}px ${shadow.get('shadowBlur')}px ${shadow.get('shadowColor')}`
        : 'none'
    });
    const layerImageStyle = {
      width: `${computed.get('width')}px`,
      height: `${computed.get('height')}px`
    };

    // element
    const elementActions = merge({}, actions, {
      handleMouseOver: this.handleMouseOver,
      handleMouseOut: this.handleMouseOut
    });

    const elementData = merge({}, data, {
      className: classNames('photo-element-thumbnail', {
        'has-image': !!imgUrl
      }),
      style: containerStyle,
      handlerStyle
    });

    const { isImgLoading, src } = this.state;

    const hoverBoxClass = classNames('box');
    let hoverBoxStyle = handlerStyle;

    if (this.state.isShowHover || isHover) {
      hoverBoxStyle = merge({}, hoverBoxStyle, {
        borderColor: '#4CC1FC',
        background: 'rgba(79,173,242,.3)'
      });
    }

    return (
      <Element actions={elementActions} data={elementData}>
        <div className="layer-image" style={layerImageStyle}>
          <XTextLoading isShown={isImgLoading} />
          <img
            className="photo-img"
            src={src}
            onLoad={this.onImageLoad}
            onError={this.onImageError}
            style={imgStyle}
          />
        </div>
        <div className={hoverBoxClass} style={hoverBoxStyle} />
      </Element>
    );
  }
}

PhotoElementThumbnail.propTypes = {};

export default translate('PhotoElement')(PhotoElementThumbnail);
