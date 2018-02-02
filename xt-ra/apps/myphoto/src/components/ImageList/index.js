import React from 'react';
import {observer} from 'mobx-react';

import './style.scss';
import ImageGrid from '../ImageGrid';
import AppStore from '../../stores/AppStore';

@observer
class ImageList extends React.Component {
  constructor(props) {
    super(props);

    const { images, imageCountInLine } =this.props;
    const imagesLength = images.length;
    const isShowMoreRender = imagesLength > imageCountInLine;

    this.state = {
      isShowMoreRender
    };

    this.onShowMoreClick = this.onShowMoreClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { images, imageCountInLine } =this.props;
    const newImageCountInLine = nextProps.imageCountInLine;
    if (imageCountInLine !== newImageCountInLine) {
      if( images.length <= newImageCountInLine ) {
        this.setState({
          isShowMoreRender: false
        });
      }
    }
  }

  onShowMoreClick() {
    const { images } = this.props;
    this.setState({
      isShowMoreRender: false
    });
  }

  componentDidUpdate() {
    AppStore.resetAllImagesPosition();
  }

  render() {
    const { images, togglePreviewModal } = this.props;
    return (
      <div className='ImageList'>
        {images.map((image, index) => (
          (index > this.props.imageCountInLine -2) && this.state.isShowMoreRender
            ? null
            : <ImageGrid key={index} image={image} togglePreviewModal={togglePreviewModal} />
        ))}
        {
          this.state.isShowMoreRender
            ? (
                <div
                  className="ShowMore"
                  onClick={this.onShowMoreClick}
                >
                  <span className="ShowMore__text">See More </span><span className="ShowMore__icon">&nbsp;&rsaquo;</span>
                </div>
              )
            : null
        }

      </div>
    )
  }
}

ImageList.propTypes = {
  images: React.PropTypes.object
};

export default ImageList;
