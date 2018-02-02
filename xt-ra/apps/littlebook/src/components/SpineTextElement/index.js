import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import { merge } from 'lodash';
import { guid } from '../../../../common/utils/math';

import fetchTextBlobAndInfo from '../../utils/fetchTextBlobAndInfo';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XWarnTip from '../../../../common/ZNOComponents/XWarnTip';
import Element from '../Element';

import { drawImage } from './handler/events';
import './index.scss';

class SpineTextElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImgLoading: false,
      image: null,
      canvasId: guid()
    };
  }

  componentDidMount() {
    drawImage(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;

    const oldImgUrl = oldElement.getIn(['computed', 'imgUrl']);
    const newImgUrl = newElement.getIn(['computed', 'imgUrl']);

    if (oldImgUrl !== newImgUrl) {
      if (newElement.get('text')) {
        drawImage(this, nextProps);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;

    if (!Immutable.is(oldElement, newElement) ||
      this.state.imageSrc !== nextState.imageSrc) {
      return true;
    }

    return false;
  }


  render() {
    const { data, actions } = this.props;
    const { element, containerOffset, isPreview } = data;

    const computed = element.get('computed');
    const handlerStyle = {
      position: 'absolute',
      width: `${computed.get('width')}px`,
      height: `${computed.get('height')}px`,
      top: 0,
      left: 0
    };
    const elementActions = merge({}, actions);

    const hasText = Boolean(element.get('text'));
    const isSelected = element.get('isSelected');

    const elementData = {
      className: classNames('spinetext-element', {
        'has-text': hasText,
        selected: isSelected
      }),
      style: {
        zIndex: element.get('dep') + 100,
        width: computed.get('width'),
        height: computed.get('height'),
        left: computed.get('left'),
        top: computed.get('top')
        // transform: `rotateZ(${element.get('rot')}deg)`
      },
      handlerStyle,
      handlerData: element,
      element,
      containerOffset
    };


    const { isImgLoading, imageSrc } = this.state;

    let imgBorderStyle = {};

    if (hasText && isSelected) {
      imgBorderStyle = merge({}, handlerStyle);
    }

    return (
      <Element data={elementData} actions={elementActions}>
        <div className="img-border" style={imgBorderStyle} />
        {
          hasText
          ? <canvas className="absolute" id={this.state.canvasId}></canvas>
          : null
        }
      </Element>
    );
  }
}

SpineTextElement.propTypes = {
  actions: PropTypes.shape({
    boundProjectActions: PropTypes.object.isRequired
  }).isRequired,
  data: PropTypes.shape({
    element: PropTypes.instanceOf(Immutable.Map).isRequired
  }).isRequired,
};

export default SpineTextElement;
