import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import { merge } from 'lodash';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import { guid } from '../../../../common/utils/math';

import Element from '../Element';

import { drawImage } from './handler/events';
import './index.scss';

class SpineTextElementThumbnail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImgLoading: false,
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
    const { element, containerOffset, ratio, page } = data;
     // spineTexed 定位的时候需要计算出血
    const spineWidth = page.get('width') * ratio.workspace;

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
        zIndex: element.get('dep') + 2000,
        width: computed.get('width'),
        height: computed.get('height'),
        left: (spineWidth - computed.get('width')) / 2,
        top: computed.get('top')
      },
      handlerStyle,
      handlerData: element,
      element,
      containerOffset
    };


    const { isImgLoading } = this.state;


    let imgBorderStyle = {};

    if (hasText && isSelected) {
      imgBorderStyle = merge({}, handlerStyle);
    }

    return (
      <Element data={elementData} actions={elementActions}>
        <XLoading isShown={isImgLoading} />
        {
          hasText
          ? <canvas className="absolute" id={this.state.canvasId} />
          : null
        }
      </Element>
    );
  }
}

SpineTextElementThumbnail.propTypes = {
  actions: PropTypes.shape({
    boundProjectActions: PropTypes.object.isRequired
  }).isRequired,
  data: PropTypes.shape({
    element: PropTypes.instanceOf(Immutable.Map).isRequired
  }).isRequired,
};

export default SpineTextElementThumbnail;
