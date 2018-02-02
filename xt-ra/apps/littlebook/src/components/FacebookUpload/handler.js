import { get } from 'lodash';

export const onSelected = (that, id) => {
  const { albums, oAuth } = that.props.data;
  let { selectPhotos } = that.state;
  selectPhotos = selectPhotos || oAuth.selectPhotos;
  return selectPhotos.find(photo => photo.get('id') == id);
};

export const selectAllIsComplete = (that, nextState) => {
  const { selectPhotos } = nextState;
  const { downloadOrDownloading } = that.props.actions;
  const { currentAlbumImgs, albumsId } = that.state;
  const isFilterCurrentAblumImgs = currentAlbumImgs[albumsId].filter(
    img =>
      !(
        downloadOrDownloading(img.id) ||
        get(img, '_originalData.gphoto$videostatus')
      )
  );

  let intersection = 0;
  selectPhotos.map(img => {
    const isFindInCur = isFilterCurrentAblumImgs.find(
      curImg => img.get('id') == curImg.id
    );
    if (isFindInCur && isFindInCur.id) {
      intersection++;
    }
  });
  if (intersection == isFilterCurrentAblumImgs.length) {
    that.setState({ selectedAll: true });
  } else {
    that.setState({ selectedAll: false });
  }
};

export const selectAll = that => {
  const { boundOAuthActions, downloadOrDownloading } = that.props.actions;
  const { currentAlbumImgs, selectedAll, albumsId } = that.state;
  const shouleSelectedImgs = [];
  if (!selectedAll) {
    currentAlbumImgs[albumsId].forEach(img => {
      const isVideo = get(img, '_originalData.gphoto$videostatus');
      if (isVideo) {
        return;
      }
      // 如果图片已经被下载 就不能被全选
      if (!downloadOrDownloading(img.id)) {
        shouleSelectedImgs.push(img);
      }
    });
    boundOAuthActions.setSelectAddPhotos(shouleSelectedImgs);
  } else {
    // 删除当前全部照片
    boundOAuthActions.deleteSelectPhotos(currentAlbumImgs[albumsId]);
  }
};

export const getSortOptions = (t) => {
  return [
    {
      label: t('DATE_TOKEN_O_T_N'),
      value: '>-taken_time'
    },
    {
      label: t('DATE_TOKEN_N_T_O'),
      value: '<-taken_time'
    }
  ];
};

export const onSorted = (that, param) => {
  const { actions } = that.props;
  const { currentAlbumImgs: albumsImgList } = that.state;
  const { boundTrackerActions } = actions;
  const newAlbumsImgList = {};

  // 用户点击 图片排序操作的 埋点  asc 升序， dsc 降序;
  const { value } = param;
  const valueArr = value.split('-');
  const diffTag = valueArr[0];
  const realValue = valueArr[1];
  const trackerMessage = diffTag === '<' ? `${realValue}Dsc` : `${realValue}Asc`;

  for(const albumId in albumsImgList) {
    const sortedAlbumImgs = albumsImgList[albumId].sort((imgA, imgB) => {
      return diffTag === '>' ? imgA[realValue] - imgB[realValue] : imgB[realValue] - imgA[realValue];
    });

    newAlbumsImgList[albumId] = sortedAlbumImgs;
  }

  const newState = {
    currentAlbumImgs: newAlbumsImgList,
    currentOption: param
  };

  that.setState(newState, /*() => boundTrackerActions.addTracker(`ChangeSort,${trackerMessage}`)*/);
};