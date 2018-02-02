import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import { merge } from 'lodash';

import fetchTextBlobAndInfo from '../../utils/fetchTextBlobAndInfo';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XWarnTip from '../../../../common/ZNOComponents/XWarnTip';
import * as Events from './handler/events';
import Element from '../Element';

import './index.scss';

class TextElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImgLoading: false,
      isShowTextNotFit: false,
      imageBlobSrc: null
    };

    this.handleDragOver = event => Events.handleDragOver(this, event);
    this.onDrop = event => Events.onDrop(this, event);
  }


  componentWillMount() {
    const { element } = this.props.data;
    const imgUrl = element.getIn(['computed', 'imgUrl']);

    if (element.get('text')) {
      this.getPreviewTextBlobAndTextInfo(
        imgUrl, element.get('width'), element.get('height')
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;

    const oldImgUrl = oldElement.getIn(['computed', 'imgUrl']);
    const newImgUrl = newElement.getIn(['computed', 'imgUrl']);

    if (oldImgUrl !== newImgUrl) {
      if (newElement.get('text')) {
      this.getPreviewTextBlobAndTextInfo(
        newImgUrl, newElement.get('width'), newElement.get('height')
      );
      } else {
        this.setState({
          isShowTextNotFit: false
        });
    }
  }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;

    const oldIsImgLoading = this.state.isImgLoading;
    const newIsImgLoading = nextState.isImgLoading;

    if (!Immutable.is(oldElement, newElement) ||
      oldIsImgLoading !== newIsImgLoading ||
      this.state.imageBlobSrc !== nextState.imageBlobSrc) {
      return true;
    }

    return false;
  }

  getPreviewTextBlobAndTextInfo(
    previewTextImageSrc, elementWidth, elementHeight) {
    this.setState({
      isImgLoading: true
    });
    fetchTextBlobAndInfo(
      previewTextImageSrc, elementWidth, elementHeight
    ).then(({ isShowTextNotFit, blobUrl }) => {
      this.setState({
        isShowTextNotFit,
        imageBlobSrc: blobUrl,
        isImgLoading: false
      });
    }).catch((error) => {
      this.setState({
        isImgLoading: false
      });
    });
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
    const elementActions = merge(actions, {
      handleDrop: this.onDrop,
      handleDragOver: this.handleDragOver
    });

    const hasText = Boolean(element.get('text'));
    const isSelected = element.get('isSelected');

    const elementData = {
      className: classNames('text-element', {
        'has-text': hasText,
        selected: isSelected
      }),
      style: {
        zIndex: element.get('dep') + 100,
        width: computed.get('width'),
        height: computed.get('height'),
        left: computed.get('left'),
        top: computed.get('top'),
        transform: `rotateZ(${element.get('rot')}deg)`
      },
      handlerStyle,
      handlerData: element,
      element,
      containerOffset
    };


    const { isImgLoading, imageBlobSrc, isShowTextNotFit } = this.state;

    const warnTipProps = {
      isShown: isShowTextNotFit,
      title: 'Text does not fit'
    };

    let imgBorderStyle = {};

    if (hasText && isSelected) {
      imgBorderStyle = merge({}, handlerStyle);
    }

    return (
      <Element data={elementData} actions={elementActions}>
        <XLoading isShown={isImgLoading} />
        <div className="img-border" style={imgBorderStyle} />
        {
          hasText
          ? (
            <img
              className="text-img"
              alt=""
              src={imageBlobSrc}
              data-html2canvas-manual-ignore="true"
            />
          )
          : null
        }
      </Element>
    );
  }
}

TextElement.propTypes = {
  actions: PropTypes.shape({
    boundProjectActions: PropTypes.object.isRequired
  }).isRequired,
  data: PropTypes.shape({
    element: PropTypes.instanceOf(Immutable.Map).isRequired
  }).isRequired,
};

export default TextElement;
