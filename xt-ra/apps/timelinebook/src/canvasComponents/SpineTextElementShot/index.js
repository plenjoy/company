import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import { Group, Image } from 'react-konva';
import { fetchImage } from '../../../../common/utils/image';
import logo from './assets/logo.png';
import { is } from 'immutable';


class SpineTextElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spineDateObj: null,
      spineUsernameObj: null,
      logoObj: null
    };

    this.loadPhotoImage = this.loadPhotoImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldElement = get(this.props, 'element');
    const newElement = get(nextProps, 'element');

    if (!is(oldElement, newElement)) {
      this.loadPhotoImage(nextProps);
    }
  }

  componentWillMount() {
    this.loadPhotoImage(this.props);

    const logoObj = new window.Image();
    logoObj.onload = () => {
      this.setState({
        logoObj
      });
    }
    logoObj.src = logo;
  }

  loadPhotoImage(nextProps) {
    const { data } = nextProps;

    const {
      element
    } = data;

    const spineUsernameUrl = element ? element.getIn(['computedSize', 'spineUsernameUrl']) : '';
    const spineDateUrl = element ? element.getIn(['computedSize', 'spineDateUrl']) : '';

    if (spineUsernameUrl) {
      fetchImage(spineUsernameUrl).then((spineUsernameObj) => {
        this.setState({
          spineUsernameObj
        });
      });
    }

    if (spineDateUrl) {
      fetchImage(spineDateUrl).then((spineDateObj) => {
        this.setState({
          spineDateObj
        });
      });
    }
  }

  render() {
    const { t, data, actions } = this.props;

    const { spineDateObj, spineUsernameObj, logoObj } = this.state;

    const {
      element
    } = data;

    const computedSize = element.get('computedSize');
    const photoSize = computedSize.get('photoSize');

    const groupProps = {
      x: computedSize.get('y'),
      y: computedSize.get('x'),
      offset: {
        x: 0,
        y: computedSize.get('height') / 2
      },
      rotation: 90,
      width: computedSize.get('width'),
      height: computedSize.get('height')
    };

    const spineLogoProps = {
      x: 0,
      y: 0,
      width: computedSize.get('spineLogoSize'),
      height: computedSize.get('spineLogoSize'),
      image: logoObj
    };

    const spineUsernameProps = {
      x: computedSize.get('spineLogoSize') + computedSize.get('spineLogoTextDistance'),
      y: 0,
      width: spineUsernameObj ? spineUsernameObj.width : 0,
      height: spineUsernameObj ? spineUsernameObj.height : 0,
      image: spineUsernameObj
    };

    const spineDateProps = {
      x: computedSize.get('width') - (spineDateObj ? spineDateObj.width : 0),
      y: 0,
      width: spineDateObj ? spineDateObj.width : 0,
      height: spineDateObj ? spineDateObj.height : 0,
      image: spineDateObj
    };

    return (
      <Group {...groupProps}>
        <Image {...spineLogoProps} />
        <Image {...spineDateProps} />
        <Image {...spineUsernameProps} />
      </Group>
    );
  }
}

SpineTextElement.propTypes = {};

export default SpineTextElement;
