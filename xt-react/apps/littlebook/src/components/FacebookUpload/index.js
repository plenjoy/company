import { get } from 'lodash';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { is, fromJS } from 'immutable';
import * as handler from './handler';
import * as style from './style';
import './index.scss';
import OAuth from '../../../../common/utils/OAuth';
import OneImage from '../OneImage';
import selected from './icon/selected.svg';
import selectHover from './icon/choose-hover.svg';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import emptybook from './icon/emptybook.jpg';
import { leastUploadImagesCount } from '../../../../common/utils/strings';
import SortAndFilter from '../SortAndFilter';
import { translate } from 'react-translate';

class FacebookUpload extends Component {
  constructor(props) {
    super(props);
    const { t } = props;
    const sortOptions = handler.getSortOptions(t);
    const currentOption = sortOptions[1];
    this.state = {
      currentTap: 'albumsTap',
      currentAlbumImgs: [],
      selectPhotos: this.props.data.oAuth.selectPhotos,
      allPhotosIsDown: false,
      isMounted: true,
      shiftKey: false,
      startIndex: 0,
      endIndex: 0,
      SessionOut: false,
      albumTitle:null,
      selectedAll:false,
      sortOptions,
      currentOption
    };
    this.setCurrentTap = this.setCurrentTap.bind(this);
    this.onSelected = id => handler.onSelected(this, id);
    this.selectAll = () => handler.selectAll(this);
    this.moveAllPhotoToAddImages = this.moveAllPhotoToAddImages.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.photoSelect = this.photoSelect.bind(this);
    this.selectAllIsComplete =(nextState)=>handler.selectAllIsComplete(this,nextState);
    this.onSorted = param => handler.onSorted(this, param);
    this.getCheckBoxImgStyle = style.getCheckBoxImgStyle.bind(this);
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
  }

  componentDidUpdate(){
    const selectedPhotosDOM = this.selectedPhotosDOM
    if(selectedPhotosDOM && selectedPhotosDOM.lastChild){
        selectedPhotosDOM.lastChild.scrollIntoView();
    }
  }

  componentWillUpdate(nextProps, nextState) {
      let { selectPhotos,currentTap } = this.state;
      let nextSelectPhotos = nextState.selectPhotos || selectPhotos;
      currentTap =nextState.currentTap || currentTap
      //如果当前 是Album 不计算是否选择全部 否者会报错
      if(!is(selectPhotos,nextSelectPhotos) && currentTap != 'albumsTap'){
        this.selectAllIsComplete(nextState)
      }

  }

  async albumsClick(id,albumTitle) {
    // 数据存储 currentAlbumImgs[albumsId:[img]]
    // 数据每次请求插入100张 可能存在在切换Album的时候 还存在继续push数据 导致数据错误 所以每次要清空，
    // 为了不让数据push进另外一个Album 所以设计了 albumsId对应，即使getAlbumImages 函数还在运行 因为闭包数据还会push打上一个albumsId里面
    let { currentAlbumImgs, currentOption } = this.state;
    const { onClosed, login } = this.props.actions;
    this.setCurrentTap('imgsTap');
    // 清空上一个album的数据
    currentAlbumImgs = [];
    currentAlbumImgs[id] = [];
    this.setState({
      currentAlbumImgs,
      allPhotosIsDown: false,
      isMounted: true,
      hasValue: false,
      albumsId: id,
      startIndex: 0,
      endIndex: 0,
      albumTitle,
    });
    try {
      await OAuth.getAlbumImages(id, (img) => {
        // 回调叠加数据
        const { currentAlbumImgs, isMounted } = this.state;
        if (isMounted) {
          currentAlbumImgs[id] = currentAlbumImgs[id].concat(img);
          this.setState({
            currentAlbumImgs,
            hasValue: true
          });
          this.onSorted(currentOption);
        }
      });
      this.selectAllIsComplete(this.state)
    } catch (error) {
      // session 退出
      if (error.code == 190) {
        // onClosed();
        this.setState({
          SessionOut: true
        });
      }
    }
    // 每个album下面图片全部加载完毕
    this.setState({
      allPhotosIsDown: true
    });
  }

  setcrop(containerWidth, containerHeight, imageWidth, imageHeight) {
    let drawWidth;
    let drawHeight;
    if (imageWidth < imageHeight) {
      drawWidth = containerWidth;
      drawHeight = imageHeight * containerHeight / imageWidth;
    } else {
      drawHeight = containerHeight;
      drawWidth = containerHeight * imageWidth / imageHeight;
    }
    return {
      height: `${drawHeight}px`,
      width: `${drawWidth}px`,
      left: `${(containerWidth - drawWidth) / 2}px`,
      top: `${(containerHeight - drawHeight) / 2}px`
    };
  }

  setCurrentTap(type) {
    this.setState({
      currentTap: type
    });
    if (type === 'albumsTap') {
      this.setState({
        currentAlbumImgs: [],
        allPhotosIsDown: false,
        isMounted: false
      });
    }
  }

  renderAlbum() {
    const { albums, oAuth } = this.props.data;

    if (albums.size == 0 && albums !== null) {
      return <div className="notice-text"><img src={emptybook} /><span>Empty Album </span></div>;
    }

    const lists = albums && albums.map((item, index) => {
      const imageWidth = item.getIn(['cover_photo', 'thumbnail', 'width']);
      const imageHeight = item.getIn(['cover_photo', 'thumbnail', 'height']);
      const styleobj = this.setcrop(120, 120, imageWidth, imageHeight);
      return (
        <div className="item" title={item.get('name')} onClick={() => this.albumsClick(item.get('id'),item.get('name'))} key={item.get('id')}>
          <div className="img-box">
            <img src={item.getIn(['cover_photo', 'thumbnail', 'url'])} style={styleobj} />
          </div>
          <div className='effect'/>
          <div className ='number'>{item.get('count')}</div>
          <div className="title">{item.get('name')}</div>
        </div>
      );
    });
    return lists;
  }

  renderPhotos() {
    const { downloadOrDownloading } = this.props.actions;
    const { currentAlbumImgs, albumsId, hasValue } = this.state;
    if (!hasValue) {
      return <XLoading isShown={!hasValue} />;
    } else if (currentAlbumImgs[albumsId].length == 0 && hasValue) {
      return <div className="notice-text">The folder is empty</div>;
    }
    const lists = currentAlbumImgs && currentAlbumImgs[albumsId].map((item) => {
      const isSelect = this.onSelected(item.id);
      const isVideo = get(item,'_originalData.gphoto$videostatus')
      const isDownloadOrDownloading = downloadOrDownloading(item.id);
      const oneImageData = { item, isSelect, isDownloadOrDownloading,isVideo};
      const oneImageActions = { photoSelect: this.photoSelect };
      return (
        <OneImage data={oneImageData} actions={oneImageActions} key={item.id} />
      );
    });
    return lists;
  }

  photoSelect(item) {

    const { boundOAuthActions, downloadOrDownloading } = this.props.actions;
    const { oAuth } = this.props.data;
    const { shiftKey, currentAlbumImgs, startIndex, endIndex, albumsId,currentTap} = this.state;
    const { selectPhotos } = oAuth;
    const isFind = selectPhotos.find(photo => (photo.get('id') == item.id));

    if(currentTap == 'albumsTap'){
       boundOAuthActions.deleteSelectPhotos([item]);
      return ;
    }
    if (shiftKey) {
       // 第2次选择或者多次选择。
      const endIndex = currentAlbumImgs[albumsId].findIndex(img => img.id == item.id);
      let selecArray = [];
      const shouleSelectedImgs = [];
      // 可能存在取左边的内容
      if (startIndex > endIndex) {
        selecArray = currentAlbumImgs[albumsId].slice(endIndex, startIndex);
      } else {
        selecArray = currentAlbumImgs[albumsId].slice(startIndex, endIndex + 1);
      }
      selecArray.forEach((img) => {
        const isVideo = get(img, '_originalData.gphoto$videostatus');
        if (isVideo) {
          return;
        }
       // 如果图片已经被下载 就不能被选中
        if (!downloadOrDownloading(img.id)) {
          shouleSelectedImgs.push(img);
        }
      });
      boundOAuthActions.setSelectAddPhotos(shouleSelectedImgs);
    } else {
       // 第一次按下的位置
      const startIndex = currentAlbumImgs[albumsId] && currentAlbumImgs[albumsId].findIndex(img => img.id == item.id);
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

  moveAllPhotoToAddImages() {
    const { boundOAuthActions, closeModal, addTracker } = this.props.actions;
    const { oAuth } = this.props.data;
    const { selectPhotos } = oAuth;
    boundOAuthActions.moveAllPhotoToAddImages(selectPhotos);
    addTracker(`NumberOfPhotos,${selectPhotos.count()},${OAuth.authType}`);
    closeModal();
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
  reLogin() {
    const { onClosed, login } = this.props.actions;
    onClosed();
    login(OAuth.authType);
    this.setState({
      SessionOut: false
    });
  }

  render() {
    const { albums, oAuth,title,autoUpgradeModalSize} = this.props.data;
    const { downloadOrDownloading } = this.props.actions;
    const { currentTap, selectPhotos, allPhotosIsDown, SessionOut,albumTitle,selectedAll, sortOptions, currentOption } = this.state;
    const selectPhotosCount = selectPhotos.size;
    const hasAlbums = albums && albums.size;
    const { boxImageSrc, boxImageClass, boxTitleClass } = this.getCheckBoxImgStyle();
    const facebookPhotosStyle={width:`${autoUpgradeModalSize.width}px`,height:`${autoUpgradeModalSize.height}px`}
    //200 是头部42+ 底部高150
    const middleContentStyle ={height:`${autoUpgradeModalSize.height -192}px` }
    const bottomContestStyle ={width:`${autoUpgradeModalSize.width +80}px`}
    //父级有
    const noSelectStyle ={width:`${autoUpgradeModalSize.width +80 -7}px`,'textAlign':'center'}
    return (
      <div className="facebookPhotos" style={facebookPhotosStyle}>
        { SessionOut ?
          (<div className="session-out">
            <div className="text">
              <span>Your session has timed out. </span><br />
              <span>You must log in again to continue.</span>
            </div>
            <div className="log-buttom" onClick={() => this.reLogin()}><span>Log in</span></div>
          </div>
          ) :
        (
          <div>
            <div className="head">
              <div className="left">
                {
            (currentTap == 'albumsTap') ? (<span className="active">{title}</span>) :
             (<span>
              <span className="albums-tap albums-tap-hover" onClick={() => this.setCurrentTap('albumsTap')}>{title}</span>
              <span className="active"> > {albumTitle}</span>
              </span>)
            }
              </div>

            {/*
              (currentTap == 'imgsTap' && allPhotosIsDown) ?
              (
                <div className="select-all" onClick={this.selectAll}>
                    <img className={boxImageClass} src={boxImageSrc}/>
                  <span className={boxTitleClass}>Select All</span>
                </div>
              ) : null
            */}

            {/*
              <SortAndFilter
                onSorted={this.onSorted}
                isShow={currentTap == 'imgsTap' && allPhotosIsDown}
                sortOptions={sortOptions}
                currentOption={currentOption}
              />
            */}

            </div>

            {currentTap == 'albumsTap' ?
          (<div className="albums" style={middleContentStyle}>
            {
              this.renderAlbum()
            }
          </div>
          ) : (
            <div className="imgs" style={middleContentStyle}>
              {
               this.renderPhotos()
              }
            </div>
          )
        }
        {
        selectPhotosCount !== 0 ?
        (<div className="upload-wrap" style={bottomContestStyle}>
          <div className="count">{selectPhotosCount} Selected ({leastUploadImagesCount} Needed)</div>
          <div className="upload" onClick={this.moveAllPhotoToAddImages} >Upload Selected</div>
        </div>
        ) : <div className="upload-wrap"  style={bottomContestStyle} />
       }

            <div className="selected-photos" style={bottomContestStyle}>
              <div className="item-wrap" ref={dom => this.selectedPhotosDOM = dom} >
                { selectPhotosCount !== 0 ?
              (
                selectPhotos && selectPhotos.map((item, index) => {
                  const imageWidth = item.getIn(['thumbnail', 'width']);
                  const imageHeight = item.getIn(['thumbnail', 'height']);
                  // const styleobj = this.setcrop(86, 86, imageWidth, imageHeight);
                  return (
                    <div className="item" onClick={() => this.photoSelect(item.toJS())} key={index}>
                      <div className="img-box">
                        <img className="each-photo"  src={item.getIn(['thumbnail', 'url'])} />
                        <img className="selectedHover-icon" src={selected} />
                      </div>
                    </div>
                  );
                })
              ) : (hasAlbums ? <span className="no-select" style={noSelectStyle}> 0 photo selected</span> : null)

             }
              </div>
            </div>
          </div>)
      }

      </div>
    );
  }
}


export default translate('FacebookUpload')(FacebookUpload);
