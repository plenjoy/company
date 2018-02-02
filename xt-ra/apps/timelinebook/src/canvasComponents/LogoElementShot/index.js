import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import { Group, Image } from 'react-konva';
import logo from './assets/logo.png';


class LogoElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logoObj: null
    };
  }

  componentDidMount() {
    const logoObj = new window.Image();
    logoObj.onload = () => {
      this.setState({
        logoObj
      });
    }
    logoObj.src = logo;
  }

  render() {
    const {data } = this.props;
    const { logoObj } = this.state;
    const {
      element
    } = data;

    const computedSize = element.get('computedSize');
    const photoSize = computedSize.get('photoSize');

    const groupProps = {
      y: computedSize.get('y'),
      x: computedSize.get('x'),
      width: computedSize.get('width'),
      height: computedSize.get('height')
    };

    const photoProps = {
      y: 0,
      x: 0,
      width: computedSize.get('width'),
      height: computedSize.get('width') / (logoObj ? logoObj.width / logoObj.height : 1),
      image: logoObj
    };

    return (
      <Group {...groupProps}>
        <Image {...photoProps} />
      </Group>
    );
  }
}

LogoElement.propTypes = {};

export default LogoElement;
