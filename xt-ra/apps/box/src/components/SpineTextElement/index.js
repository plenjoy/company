import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import { merge, get, isEqual } from 'lodash';
import { guid } from '../../../common/utils/math';

import fetchTextBlobAndInfo from '../../utils/fetchTextBlobAndInfo';
import XLoading from '../../../common/ZNOComponents/XLoading';
import XWarnTip from '../../../common/ZNOComponents/XWarnTip';
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
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTextRemove = this.handleTextRemove.bind(this);
    this.handleTextEdit = this.handleTextEdit.bind(this);
    this.handleDblClick = this.handleDblClick.bind(this);
  }

  componentDidMount() {
    drawImage(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;

    const oldImgUrl = get(oldElement, 'computed.imgUrl');
    const newImgUrl = get(newElement, 'computed.imgUrl');

    if (oldImgUrl !== newImgUrl) {
      if (get(newElement, 'text')) {
        drawImage(this, nextProps);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;

    if (!isEqual(oldElement, newElement)) {
      return true;
    }

    return false;
  }

  handleDblClick() {
    const { actions, data } = this.props;
    const { handleDblClick } = actions;
    const { element } = data;
    handleDblClick && handleDblClick(element);
  }

  handleMouseDown(event) {
    const { actions, data } = this.props;
    const { handleMouseDown } = actions;
    const { element } = data;
    const { id } = element;
    const ev = event || window.event;
    handleMouseDown && handleMouseDown(id, ev);
  }

  handleTextRemove() {
    const { actions, data } = this.props;
    const { handleTextRemove } = actions;
    const { element } = data;
    const { id } = element;
    handleTextRemove && handleTextRemove(id);
  }

  handleTextEdit() {
    const { actions, data } = this.props;
    const { editTextWithoutJustify } = actions;
    const { element } = data;
    editTextWithoutJustify && editTextWithoutJustify(element);
  }


  render() {
    const { data, actions } = this.props;
    const { element, containerOffset, isPreview } = data;

    const computed = get(element, 'computed');
    const handlerStyle = {
      position: 'absolute',
      width: `${get(computed, 'width')}px`,
      height: `${get(computed, 'height')}px`,
      top: 0,
      left: 0
    };
    const elementActions = merge({}, actions, {
      handleMouseDown: this.handleMouseDown,
      handleDblClick: this.handleDblClick
    });


    const hasText = Boolean(get(element, 'text'));
    const isSelected = get(element, 'isSelect');
    const elementAttrs = {
      title: 'Double click to edit text'
    };
    if (!hasText) {
      elementAttrs['data-html2canvas-ignore'] = true;
    }

    const elementData = {
      className: classNames('spinetext-element', {
        'has-text': hasText,
        selected: isSelected
      }),
      style: {
        zIndex: get(element, 'dep') + 100,
        width: get(computed, 'width'),
        height: get(computed, 'height'),
        left: get(computed, 'left'),
        top: get(computed, 'top'),
        // transform: `rotateZ(${element.get('rot')}deg)`
      },
      handlerStyle,
      handlerData: element,
      element,
      containerOffset,
      elementAttrs
    };


    const { isImgLoading, imageSrc } = this.state;

    let imgBorderStyle = {};

    if (hasText && isSelected) {
      imgBorderStyle = merge({}, handlerStyle);
    }

    return (
      <Element data={elementData} actions={elementActions}>
        <div className="img-border" style={imgBorderStyle} data-html2canvas-ignore="true" />
        {
          hasText
          ? <canvas className="absolute" id={this.state.canvasId}></canvas>
          : null
        }
        <div className="ActionBar" data-html2canvas-ignore="true" >
          <div className="ActionBar_edit" onClick={this.handleTextEdit}>
            <a title="Edit Text"></a>
          </div>
          <div className="ActionBar_clear" onClick={this.handleTextRemove}>
            <a title="Remove Text Frame"></a>
          </div>
        </div>
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
