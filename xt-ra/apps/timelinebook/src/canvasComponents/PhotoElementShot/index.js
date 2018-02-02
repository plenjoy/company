import React, { Component, PropTypes } from 'react';
import { fetchImage } from '../../../../common/utils/image';
import { is } from 'immutable';
import { get } from 'lodash';
import { Group, Image } from 'react-konva';


class PhotoElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imgObj: null
    };

    this.loadPhotoImage = this.loadPhotoImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldElement = get(this.props.data, 'element');
    const newElement = get(nextProps.data, 'element');

    if (!is(oldElement, newElement)) {
      this.loadPhotoImage(nextProps);
    }
  }

  componentWillMount() {
    this.loadPhotoImage(this.props);
  }

  loadPhotoImage(nextProps) {
    const { data } = nextProps;

    const {
      element
    } = data;

    const imageUrl = element ? element.getIn(['computedSize', 'photoSize', 'url']) : '';

    if (imageUrl) {
      fetchImage(imageUrl).then((imgObj) => {
        this.setState({
          imgObj
        });
      });
    }
  }

  render() {
    const { t, data, actions } = this.props;

    const { imgObj } = this.state;

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
      y: photoSize.get('y'),
      x: photoSize.get('x'),
      width: photoSize.get('width'),
      height: photoSize.get('height'),
      image: imgObj
    };

    return (
      <Group {...groupProps}>
        <Image {...photoProps} />
      </Group>
    );
  }
}

PhotoElement.propTypes = {};

export default PhotoElement;
