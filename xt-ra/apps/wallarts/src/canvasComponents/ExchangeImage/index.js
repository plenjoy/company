import React, { Component, PropTypes } from 'react';
import { Image } from 'react-konva';
import { translate } from 'react-translate';
import ico from './icon.png';

import { shapeType } from '../../constants/strings';

import './index.scss';

class ExchangeImage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      imageObj: null,
      isShowIcon: true
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
    const { imageObj, isShowIcon } = this.state;

    const imageObject = isShowIcon ? imageObj : null;

    const imageProps = {
      ref: node => this.imageNode = node,
      image: imageObject,
      x: 15,
      y: 15,
      width: 35,
      id: shapeType.Icon,
      height: 35,
      draggable: true,
      onDragStart: (e) => {
        actions.onExchangeDragStart(e);
        this.setState({
          isShowIcon: false
        });
      },
      onDragMove: (e) => {
        actions.onExchangeDragMove(e);
         this.onMouseOut();
      },
      onDragEnd: (e) => {
        actions.onExchangeDragEnd(e);
      },
      onMouseDown: (e) => {
        actions.onMouseDown(e);
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
