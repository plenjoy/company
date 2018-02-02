  export const downloadOrDownloading = (that, id) => {
    const { oAuth, allImages, uploadingImages } = that.props.data;
    return allImages.find(photo => photo.get('thirdpartyImageId') == id) || uploadingImages.find(photo => photo.thirdpartyImageId == id);
  };
