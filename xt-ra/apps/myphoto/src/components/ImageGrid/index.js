import React from 'react';
import {observer} from 'mobx-react';
import {observable, computed, reaction, autorun} from 'mobx';
import './style.scss';
import LoadingImage from './assets/img/images.svg';

@observer
class ImageGrid extends React.Component {
  render() {
    const { image,  togglePreviewModal } = this.props;
    const activeClass = image.isSelected ? ' active' : '';
    const imageContainerStyle = image.orientation ?{transform: `rotate(${image.orientation}deg)`}:{}
    return (
      <div className='ImageGrid' ref={container => this.container = container}>
        <div
          className={`ImageGrid__cover ${activeClass}`}
          onClick={image.toggleSelect}
          onDoubleClick={() => {togglePreviewModal(image)}}
        >
          <div className='ImageGrid__imageContainer' style={imageContainerStyle} >
            <img className={`ImageGrid__image${image.isLoaded ? ' show' : ''}`} src={image.thumbnailUrl} onLoad={image.loadComplete} draggable="false" />
            {
              !image.isLoaded
                ? <img className='ImageGrid__loading' src={LoadingImage} draggable="false" />
                : null
            }
          </div>
        </div>
        <p className='ImageGrid__name' title={image.name}>{image.shortName}</p>
      </div>
    )
  }

  componentDidMount() {
    this.props.image.setContainer(this.container);
  }
}

ImageGrid.propTypes = {
  image: React.PropTypes.object
};

export default ImageGrid
