import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import { merge } from 'lodash';
import Element from '../Element';
import './index.scss';

class TextElementThumbnail extends Component {
  constructor(props) {
    super(props);

    this.onLoad = this.onLoad.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;

    if (!Immutable.is(oldElement, newElement)) {
      return true;
    }

    return false;
  }

  onLoad(e) {
    // TODO: 添加加载动画.
  }

  render() {
    const { data, actions } = this.props;
    const { element } = data;
    const imageSrc = element.getIn(['computed', 'imgUrl']);

    const computed = element.get('computed');
    const hasText = Boolean(element.get('text'));
    const handlerStyle = {
      position: 'absolute',
      width: `${computed.get('width')}px`,
      height: `${computed.get('height')}px`,
      top: 0,
      left: 0
    };
    const elementData = {
      className: classNames('text-element-thumbnail', {
        'has-text': hasText,
        selected: element.get('isSelected')
      }),
      style: {
        zIndex: element.get('dep') + 100,
        width: computed.get('width'),
        height: computed.get('height'),
        left: computed.get('left'),
        top: computed.get('top'),
        transform: `rotate(${element.get('rot')}deg)`
      },
      handlerStyle,
      handlerData: element,
      element
    };

    let imgBorderStyle = {};

    if (hasText) {
      imgBorderStyle = merge({}, handlerStyle);
    }

    return (
      <Element data={elementData} actions={actions}>
        <div className="img-border" style={imgBorderStyle} />
        {
          hasText
          ? (
            <img
              className="text-img"
              alt=""
              src={imageSrc}
              onLoad={this.onLoad}
            />
          )
          : null
        }
      </Element>
    );
  }
}

TextElementThumbnail.propTypes = {
  actions: PropTypes.shape({
  }),
  data: PropTypes.shape({
    element: PropTypes.instanceOf(Immutable.Map).isRequired
  }).isRequired,
};

export default TextElementThumbnail;
