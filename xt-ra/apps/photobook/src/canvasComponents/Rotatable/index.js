import React, { Component, PropTypes } from 'react';

import { Image, Group, Text, Rect } from 'react-konva';

import rotateIcon from './icon-rotate.svg';

import { shapeType } from '../../contants/strings';

class Rotatable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      imageObj: null
    };

    this.mouseUp = this.mouseUp.bind(this);
  }

  componentWillMount() {
    const imageObj = new window.Image();

    imageObj.onload = () => {
      this.setState({ imageObj });
    };

    imageObj.src = rotateIcon;
  }

  componentDidMount() {
    const { imageNode } = this.refs;
    const { actions } = this.props;
    imageNode.on('mousedown', (e) => {
      actions.onRotateStart(e);
      document.addEventListener('mousemove', actions.onRotate);

      this.isRotating = true;

      e.evt.stopPropagation();
    });
    document.addEventListener('mouseup', this.mouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.mouseUp);
  }


  mouseUp(e) {
    const { actions } = this.props;
    actions.onRotateStop(e);
    document.removeEventListener('mousemove', actions.onRotate);

    this.isRotating = false;
    this.forceUpdate();
  }

  render() {
    const { x, y, width, degree } = this.props;

    const { imageObj } = this.state;

    const imageProps = {
      ref: 'imageNode',
      image: imageObj,
      id: shapeType.Icon,
      x: (x + (width / 2)) - 12,
      y: y - 38,
      width: 24,
      height: 24
    };

    const degreeLabelGroupProps = {
      x: (x + (width / 2)) + 40,
      y: y - 35,
      rotation: -degree,
    };

    const rectProps = {
      x: 0,
      y: 0,
      width: 45,
      height: 22,
      fill: '#000',
      cornerRadius: 4
    };

    const textProps = {
      ref: 'textNode',
      x: 0,
      y: 0,
      width: 45,
      text: `${degree}°`,
      fontSize: 12,
      fontFamily: 'Gotham SSm A',
      fill: '#fff',
      padding: 5,
      align: 'center'
    };

    const rotatableGroupProps = {
      ref: 'rotatableGroupNode'
    };

    return (
      <Group {...rotatableGroupProps}>
        <Image {...imageProps} />

        {
          this.isRotating
          ? (
            <Group {...degreeLabelGroupProps}>
              <Rect {...rectProps} />
              <Text {...textProps} />
            </Group>
          )
          : null
        }
      </Group>
    );
  }
}

Rotatable.propTypes = {
  actions: PropTypes.shape({
    onRotate: PropTypes.func.isRequired,
    onRotateStart: PropTypes.func.isRequired,
    onRotateStop: PropTypes.func.isRequired
  }).isRequired,
  degree: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};


export default Rotatable;
