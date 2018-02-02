import { get } from 'lodash';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { is, fromJS } from 'immutable';
import * as handler from './handler';
import './index.scss';
import OAuth from '../../../../common/utils/OAuth';
import OneImage from '../OneImage';
import selected from './icon/selected.svg';
import selectHover from './icon/choose-hover.svg';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import { leastUploadImagesCount } from '../../../../common/utils/strings';
// import box from './icon/box.svg';
// import selectedBox from './icon/boxSelected.svg';

class InstagramUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectPhotos: this.props.data.oAuth.selectPhotos,
      allPhotosIsDown: false,
      isMounted: true,
      allImage: [],
      hasValue: false,
      shiftKey: false,
      startIndex: 0,
      endIndex: 0,
      selectedAll:false
    };
    this.onSelected = id => handler.onSelected(this, id);
    this.selectAll = () => handler.selectAll(this);
    this.moveAllPhotoToAddImages = this.moveAllPhotoToAddImages.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.photoSelect = this.photoSelect.bind(this);
    this.renderImg = this.renderImg.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!is(this.props.data.oAuth.selectPhotos, nextProps.data.oAuth.selectPhotos)) {
      this.setState({
        selectPhotos: nextProps.data.oAuth.selectPhotos
      });
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeydown, true);
    window.addEventListener('keyup', this.onKeyup, true);
  }
  componentWillUnmount() {
    this.setState({ isMounted: false });
    window.removeEventListener('keydown', this.onKeydown, true);
    window.removeEventListener('keyup', this.onKeyup, true);
    // OAuth.cancelRequest();
  }

   componentDidUpdate(){
    const selectedPhotosDOM = this.selectedPhotosDOM
    selectedPhotosDOM.lastChild.scrollIntoView();
  }

  moveAllPhotoToAddImages() {
    const { boundOAuthActions, closeModal,addTracker } = this.props.actions;
    const { oAuth } = this.props.data;
    const { selectPhotos } = oAuth;
    boundOAuthActions.moveAllPhotoToAddImages(selectPhotos);
    addTracker(`NumberOfPhotos,${selectPhotos.count()},Instagram`);
    closeModal();
  }

  async componentWillMount() {
    try {
      await OAuth.getAllImages((img) => {
        const { allImage, isMounted } = this.state;
        this.setState({
          allImage: allImage.concat(img),
          hasValue: true
        });
      });
    } catch (ex) {
      console.log(ex, '网络不稳定');
      this.setState({
        allPhotosIsDown: true,
        hasValue: true
      });
    }

    this.setState({
      allPhotosIsDown: true
    });
  }

  renderImg(allImage) {
    const { downloadOrDownloading } = this.props.actions;
    if(allImage.length === 0){
       return <div className="notice-text">The folder is empty</div>;
    }
    const imglist = allImage && allImage.map((item) => {
      const isSelect = this.onSelected(item.id);
      const isDownloadOrDownloading = downloadOrDownloading(item.id);
      const oneImageData = { item, isSelect, isDownloadOrDownloading };
      const oneImageActions = { photoSelect: this.photoSelect };

      return (
        <OneImage data={oneImageData} actions={oneImageActions} key={item.id} />
      );
    });
    return imglist
  }


  photoSelect(item) {
    const { boundOAuthActions, downloadOrDownloading } = this.props.actions;
    const { oAuth } = this.props.data;
    const { shiftKey, startIndex, endIndex, allImage } = this.state;
    const { selectPhotos } = oAuth;
    if (shiftKey) {
       // 第2次选择或者多次选择。
      const endIndex = allImage.findIndex(img => img.id == item.id);
      let selecArray = [];
      const shouleSelectedImgs = [];
      // 可能存在取左边的内容
      if (startIndex > endIndex) {
        selecArray = allImage.slice(endIndex, startIndex);
      } else {
        selecArray = allImage.slice(startIndex, endIndex + 1);
      }
      selecArray.forEach((img) => {
       // 如果图片已经被下载 就不能被选中
        if (!downloadOrDownloading(img.id)) {
          shouleSelectedImgs.push(img);
        }
      });
      boundOAuthActions.setSelectAddPhotos(shouleSelectedImgs);
    } else {
      // 是否在select列表里面找到就改为删除
      const isFind = selectPhotos.find(photo => (photo.get('id') == item.id));
        // 第一次按下的位置
      const startIndex = allImage.findIndex(img => img.id == item.id);
      this.setState({
        startIndex
      });
      if (!isFind) {
        boundOAuthActions.setSelectAddPhotos([item]);
      } else {
        boundOAuthActions.deleteSelectPhotos([item]);
      }
    }
  }

  onKeydown(e) {
    const { shiftKey } = this.state;
    if (e.keyCode == 16) {
      if (!shiftKey) {
        this.setState({
          shiftKey: true
        });
      }
    }
  }
  onKeyup(e) {
    if (e.keyCode == 16) {
      this.setState({
        shiftKey: false
      });
    }
  }


  render() {
    const { albums, oAuth,autoUpgradeModalSize} = this.props.data;
    const { downloadOrDownloading } = this.props.actions;
    const { allImage, selectPhotos, allPhotosIsDown, hasValue,selectedAll } = this.state;
    const selectPhotosCount = selectPhotos.size;
    const InstagramPhotosStyle={width:`${autoUpgradeModalSize.width}px`,height:`${autoUpgradeModalSize.height}px`}
    //200 是头部15+ 底部高150
    const middleContentStyle ={height:`${autoUpgradeModalSize.height -165}px` }
    const bottomContestStyle ={width:`${autoUpgradeModalSize.width +80}px`}
     //父级有7margin
    const noSelectStyle ={width:`${autoUpgradeModalSize.width +80 -7}px`,'textAlign':'center'}
    // const checkBoxImg = selectedAll ? selectedBox : box;
    return (
      <div className="instagramPhotos" style={InstagramPhotosStyle}>
        <div className="head">
          {/*
            (allPhotosIsDown) ?
            (
              <div className="select-all" onClick={this.selectAll}>
              <img src={checkBoxImg}/>
              <span>Selected All</span>
            </div>
            ) : null
          */}

        </div>

        <div className="imgs" style={middleContentStyle}>
          { !hasValue ? <XLoading isShown={!hasValue} /> : (this.renderImg(allImage))
          }
        </div>

        {
        selectPhotosCount != 0 ?
        (<div className="upload-wrap" style={bottomContestStyle}>
          <div className="count">{selectPhotosCount} Selected ({leastUploadImagesCount} Needed)</div>
          <div className="upload" onClick={this.moveAllPhotoToAddImages}>Upload Selected</div>
        </div>
        ) : <div className="upload-wrap" style={bottomContestStyle}/>
       }

        <div className="selected-photos" style={bottomContestStyle}>
          <div className="item-wrap" ref={dom => this.selectedPhotosDOM = dom} >
            { selectPhotosCount != 0 ?
              (
                selectPhotos && selectPhotos.map((item, index) => {
                  return (
                    <div className="item" onClick={() => this.photoSelect(item.toJS())} key={index}>
                      <div className="img-box">
                        <img className="each-photo" src={item.getIn(['thumbnail', 'url'])} />
                        <img className="selectedHover-icon" src={selected} />
                      </div>
                    </div>
                  );
                })
              ) : (<span className="no-select" style={noSelectStyle}> 0 Photo Selected</span>)
             }
          </div>
        </div>
      </div>
    );
  }
}


export default InstagramUpload;
