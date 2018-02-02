export const onSelected = (that, id) => {
  const { oAuth } = that.props.data;
  let { selectPhotos } = that.state;
  selectPhotos = selectPhotos || oAuth.selectPhotos;
  return selectPhotos.find(photo => photo.get('id') == id);
};

export const selectAll = that => {
  const { boundOAuthActions, downloadOrDownloading } = that.props.actions;
  const { allImage, selectedAll } = that.state;
  that.setState({
    selectedAll: !selectedAll
  });
  const shouleSelectedImgs = [];
  if (!selectedAll) {
    allImage.forEach(img => {
      // 如果图片已经被下载 就不能被全选
      if (!downloadOrDownloading(img.id)) {
        shouleSelectedImgs.push(img);
      }
    });
    boundOAuthActions.setSelectAddPhotos(shouleSelectedImgs);
  } else {
    //删除当前全部照片
    boundOAuthActions.deleteSelectPhotos(allImage);
  }
};
