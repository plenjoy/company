import React, { Component, PropTypes } from 'react';
import { merge, template, mapValues, isEqual } from 'lodash';
import classnames from 'classnames';
import ReactCrop from '../XImageCrop/ReactCrop';

import { getDefaultCrop } from '../../utils/crop';
import { convertObjIn } from '../../utils/typeConverter';

import XModal from '../XModal';
import XButton from '../XButton';
import XLoading from '../XLoading';
import XImageCropCornerArea from '../XImageCropCornerArea';

import './index.scss';

const convertCropIn = (cropLUX, cropLUY, cropRLX, cropRLY) => {
  return mapValues(
    {
      x: cropLUX,
      y: cropLUY,
      width: cropRLX - cropLUX,
      height: cropRLY - cropLUY
    },
    o => o * 100
  );
};

const convertCropOut = (x, y, width, height) => {
  return mapValues(
    {
      cropLUX: x,
      cropLUY: y,
      cropRLX: width + x,
      cropRLY: height + y
    },
    o => o / 100
  );
};

const getCropParams = (
  imageWidth,
  imageHeight,
  elementWidth,
  elementHeight
) => {
  const cropObj = getDefaultCrop(
    imageWidth,
    imageHeight,
    elementWidth,
    elementHeight
  );
  return {
    x: cropObj.px * 100,
    y: cropObj.py * 100,
    width: cropObj.pw * 100,
    height: cropObj.ph * 100
  };
};

const getCropParamsReverse = (
  imageWidth,
  imageHeight,
  elementWidth,
  elementHeight
) => {
  return getCropParams(imageHeight, imageWidth, elementWidth, elementHeight);
};

class XImageEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imgSrc: '',
      rotate: 0,
      outCrop: null,
      initCrop: {},
      needInitCropOnRotate: false,
      isShowCropComponent: false,
      isLoaded: false,
      isLoadError: false
    };

    this.onCropChange = this.onCropChange.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onImageError = this.onImageError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldEncImgId = this.props.encImgId;
    const oldImgId = this.props.imageId;
    const oldRotation = this.props.rotation;

    const {
      imageEditApiTemplate,
      defaultImageEditParams,
      encImgId,
      imageId,
      rotation,
      crop,
      imageWidth,
      imageHeight,
      elementWidth,
      elementHeight,
      imgFlip = false,
      securityString = { timestamp: '', token: '', customerId: -1 }
    } = nextProps;

    const newImgSrc = template(imageEditApiTemplate)(
      merge({}, defaultImageEditParams, {
        encImgId,
        rotation: +rotation,
        imageId,
        imgFlip,
        ...securityString
      })
    );

    if (newImgSrc !== this.state.imgSrc) {
      this.setState({
        isShowCropComponent: false
      });
    }

    this.setState({
      imgSrc: newImgSrc,
      needInitCropOnRotate: false,
      rotate: +rotation
    });

    const oldCrop = this.props.crop;
    let newInitCrop = {
      aspect: elementWidth / elementHeight
    };
    if (crop) {
      newInitCrop = merge(
        {},
        newInitCrop,
        convertCropIn(crop.cropLUX, crop.cropLUY, crop.cropRLX, crop.cropRLY)
      );
    }
    this.setState({
      initCrop: newInitCrop,
      outCrop: newInitCrop
    });

    if (!nextProps.isShown && this.props.isShown !== nextProps.isShown) {
      this.setState({
        imgSrc: ''
      });
    }
  }

  onCropChange(crop, pixelCrop) {
    this.setState({
      outCrop: crop
    });
  }

  onImageLoaded(crop, image, pixelCrop) {
    const { needInitCropOnRotate } = this.state;
    if (needInitCropOnRotate) {
      const {
        imageWidth,
        imageHeight,
        elementWidth,
        elementHeight
      } = this.props;

      const { rotate } = this.state;

      const isPortrait = Math.abs(rotate) === 90;

      let cropParams = {};

      if (isPortrait) {
        cropParams = getCropParamsReverse(
          imageWidth,
          imageHeight,
          elementWidth,
          elementHeight
        );
      } else {
        cropParams = getCropParams(
          imageWidth,
          imageHeight,
          elementWidth,
          elementHeight
        );
      }

      const newInitCrop = convertObjIn(
        merge({}, cropParams, {
          aspect: elementWidth / elementHeight
        })
      );

      this.setState({
        outCrop: newInitCrop,
        initCrop: newInitCrop
      });
    } else {
      this.setState({
        outCrop: crop
      });
    }
    this.setState({
      isShowCropComponent: true,
      isLoaded: true
    });
  }

  onSubmit() {
    const { encImgId, onDoneClick } = this.props;
    const { outCrop, rotate } = this.state;

    const convertedCrop = convertCropOut(
      outCrop.x,
      outCrop.y,
      outCrop.width,
      outCrop.height
    );

    onDoneClick(encImgId, convertedCrop, rotate);
    this.onCancelClick();
  }

  onCancelClick() {
    const { onCancelClick } = this.props;

    this.setState({
      isLoaded: false,
      isLoadError: false
    });
    onCancelClick && onCancelClick();
  }

  // 图片加载失败 重置按钮
  onImageError() {
    this.setState({
      isLoadError: true,
      isShowCropComponent: true
    });
  }

  rotate(degree) {
    const {
      imageEditApiTemplate,
      defaultImageEditParams,
      encImgId,
      imageId,
      imgFlip = false,
      securityString = { timestamp: '', token: '', customerId: -1 },
      onRotateClick
    } = this.props;

    const { rotate } = this.state;

    let newRotate = 0;
    if (degree > 0) {
      if (rotate === 180) {
        newRotate = -90;
      } else {
        newRotate = rotate + degree;
      }
    } else if (rotate === -90) {
      newRotate = 180;
    } else {
      newRotate = rotate + degree;
    }

    const newImgSrc = template(imageEditApiTemplate)(
      merge({}, defaultImageEditParams, {
        imageId,
        encImgId: encodeURIComponent(encImgId),
        rotation: newRotate,
        imgFlip,
        ...securityString
      })
    );

    this.setState({
      imgSrc: newImgSrc,
      rotate: newRotate,
      needInitCropOnRotate: true,
      isShowCropComponent: false,
      isLoaded: false,
      isLoadError: false
    });

    typeof onRotateClick === 'function' && onRotateClick();
  }

  render() {
    const { isShown, imageName, imageCornerRatios } = this.props;

    const { imgSrc, initCrop, isShowCropComponent, outCrop } = this.state;
    const leftButton = classnames('left-button', {
      disable: !this.state.isLoaded
    });
    const rightButton = classnames('right-button', {
      disable: !this.state.isLoaded
    });
    return (
      <XModal
        className="image-edit-modal"
        opened={isShown}
        onClosed={this.onCancelClick}
      >
        <h3 className="modal-title">Set Image</h3>
        <div className="image-name">{imageName}</div>

        <div className="cropper-area">
          <XLoading isShown={!isShowCropComponent} />
          {isShown ? (
            <ReactCrop
              src={imgSrc}
              crop={initCrop}
              onChange={this.onCropChange}
              onImageLoaded={this.onImageLoaded}
              onImageError={this.onImageError}
              minWidth={10}
              minHeight={10}
              keepSelection
            >
              {imageCornerRatios ? (
                <XImageCropCornerArea
                  outCrop={outCrop}
                  imageCornerRatios={imageCornerRatios}
                />
              ) : null}
            </ReactCrop>
          ) : null}
        </div>

        <div className="rotate-controls">
          <div className="left-control">
            <button
              className={leftButton}
              onClick={this.rotate.bind(this, -90)}
            />
            <p className="description">-90&deg;</p>
          </div>
          <div className="right-control">
            <button
              className={rightButton}
              onClick={this.rotate.bind(this, 90)}
            />
            <p className="description">+90&deg;</p>
          </div>
        </div>

        <p className="modal-foot">
          <XButton onClicked={this.onSubmit} disabled={!this.state.isLoaded}>
            Done
          </XButton>
        </p>
      </XModal>
    );
  }
}

XImageEditModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  imageName: PropTypes.string.isRequired,
  imageEditApiTemplate: PropTypes.string.isRequired,
  encImgId: PropTypes.string.isRequired,
  onDoneClick: PropTypes.func.isRequired,
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  elementWidth: PropTypes.number.isRequired,
  elementHeight: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  crop: PropTypes.shape({
    cropLUX: PropTypes.number,
    cropLUY: PropTypes.number,
    cropRLX: PropTypes.number,
    cropRLY: PropTypes.number
  }).isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onRotateClick: PropTypes.func
};

XImageEditModal.defaultProps = {
  defaultImageEditParams: {
    px: 0,
    py: 0,
    pw: 1,
    ph: 1,
    width: 480,
    height: 310,
    rotation: 0
  },
  rotation: 0
};

export default XImageEditModal;
