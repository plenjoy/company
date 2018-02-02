import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import XModal from '../../../../common/ZNOComponents/XModal';

import { getSize } from '../../../../common/utils/helper';

import './style.scss';
import loadingImg from './images.svg';
import previousNormalSrc from './icons/Left-Normal.svg';
import previousHoverSrc from './icons/Left-Hover&Pressed.svg';
import nextNormalSrc from './icons/Right-Normal.svg';
import nextHoverSrc from './icons/Right-Hover&Pressed.svg';


@observer
class PreviewPhotoModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      isImgLoaded : false,
      resizeTime: 0
    }

    this.hideLoadingImg = this.hideLoadingImg.bind(this);
    this.handleResize = this.handleResize.bind(this);

  }

  componentDidMount(){
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps){
    const nextPhotoUrl = nextProps.previewPhotoInfo.url;
    const currentPhotoUrl = this.props.previewPhotoInfo.url;
    if(nextPhotoUrl != currentPhotoUrl){
      this.setState({
        isImgLoaded : false
      });
    }
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({
      resizeTime: this.state.resizeTime + 1
    });
  }

  hideLoadingImg() {
    this.setState({
      isImgLoaded : true
    });
  }

  render(){
    const isShown = true;
    const { togglePreviewModal, previewPhotoInfo, changePreviewPhoto } = this.props;
    const { previewUrl, index, isLastImage, name, height, width, isSelected } = previewPhotoInfo;
    const previousButtonClass = classNames('previous-botton', { 'disabled':index ===0 });
    const nextBottonClass = classNames('next-botton', { 'disabled': isLastImage });
    const previewPhotoContainerClass = classNames('preview-photo-container', { 'isSelected': false });
    const loadingModalClass = classNames('loading-modal', { 'isSelected': isSelected });

    const pageHeight = getSize().height;
    const pageWidth = getSize().width;
    const contentTop = pageHeight < 770 ? 0 : (pageHeight - 770) / 2;
    const contentLeft = pageWidth < 840 ? 0 : (pageWidth - 840) / 2;
    const contentStyle = {
      top: `${contentTop}px`,
      left: `${contentLeft}px`
    };

    return (
      <XModal
        className="preview-photo-modal"
        onClosed={togglePreviewModal}
        opened={isShown}
        closeByBackDropClick={true}
        contentStyle={contentStyle}
      >
        <h2 className="preview-photo-title" >Preview Photo</h2>
        <p className="preview-photo-info">{name}<span>{`(${width}x${height})`}</span></p>
        <div className={previewPhotoContainerClass}>
          <a className={previousButtonClass} onClick={() => {changePreviewPhoto(-1)}}></a>
          <a className={nextBottonClass} onClick={() => {changePreviewPhoto(1)}}></a>
          <div className="preview-photo-stage">
            <img src={previewUrl} onLoad={this.hideLoadingImg}/>
            {
              this.state.isImgLoaded
              ? null
              : (
                <div className={loadingModalClass}>
                  <img src={loadingImg} />
                </div>
              )
            }
          </div>
        </div>
      </XModal>
    );
  }
}

export default PreviewPhotoModal;
