import React, { Component, PropTypes } from 'react';
import { Image } from 'react-konva';
import { translate } from 'react-translate';
import ico from './icon.svg';

import { shapeType } from '../../contants/strings';

import './index.scss';

class ExchangeImage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      imageObj: null
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  onMouseEnter() {
    const { t } = this.props;
    this.imageNode.getStage().content.title = t('DRAR_SWAP_TIP');
    this.imageNode.getStage().content.style.cursor = 'move';
  }

  onMouseOut() {
    this.imageNode && (this.imageNode.getStage().content.title = '');
    this.imageNode && (this.imageNode.getStage().content.style.cursor = 'default');
  }

  componentWillMount() {
    const imageObj = new window.Image();
    imageObj.src = ico;

    imageObj.onload = () => {
      this.setState({ imageObj });
    };
  }

  render() {
    const { actions } = this.props;
    const { imageObj } = this.state;
    const imageProps = {
      ref: node => this.imageNode = node,
      image: imageObj,
      x: 8,
      y: 8,
      width: 25,
      id: shapeType.Icon,
      height: 25,
      draggable: true,
      onDragStart: (e) => {
        actions.onDragStart(e);
      },
      onDragMove: (e) => {
        actions.onDragMove(e);
         this.onMouseOut();
      },
      onDragEnd: (e) => {
        actions.onDragEnd(e);
      },
      onMouseEnter: this.onMouseEnter,
      onMouseOut: this.onMouseOut

    };

    return (
      <Image {...imageProps} />
    );
  }
}

export default translate('ExchangeImage')(ExchangeImage);
