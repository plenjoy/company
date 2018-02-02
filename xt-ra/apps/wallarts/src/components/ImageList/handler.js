import { merge, get } from 'lodash';
import { setTransferData, setTransferDragNode } from '../../../../common/utils/drag';
import { elementTypes, dragTypes } from '../../constants/strings';
import { IMAGE_SRC } from '../../constants/apiUrl';
import { combine } from '../../../../common/utils/url';
import securityString from '../../../../common/utils/securityString';

let timer = null;

export const convertImageData = (images, uploadBaseUrl) => {
  const twoDimenArr = [];
  const numInRow = 3;

  if (images) {
    const newImages = images.map((v) => {
      const value = v;
      value.src = v.encImgId ? combine(uploadBaseUrl, IMAGE_SRC, {
        qaulityLevel: 0,
        puid: v.encImgId,
        rendersize: 'fit350',
        ...securityString
      }) : null;

      return value;
    });

    // 转成2维数组, 每行3个.
    let tempArr = [];

    newImages.forEach((t) => {
      if (tempArr.length === numInRow) {
        twoDimenArr.push(tempArr);
        tempArr = [];
      }

      tempArr.push(t);
    });

    if (tempArr.length) {
      twoDimenArr.push(tempArr);
      tempArr = [];
    }
  }

  return twoDimenArr;
};

export const onOverImageItem = (that, imageObj) => {
  clearTimeout(timer);

  const imageUrl = imageObj.src;
  const { guid } = imageObj;
  const { imageList } = that.refs;

  const container = document.querySelector(`[data-guid="${guid}"]`);

  const containerPosition = container.getBoundingClientRect();
  const winHeight = window.innerHeight;
  const orientation = imageObj.orientation || 0;

  const isSwitched = Math.abs((orientation / 90) % 2) === 1;
  const w = isSwitched ? imageObj.height : imageObj.width;
  const h = isSwitched ? imageObj.width : imageObj.height;
  const scaleInMagnifier = reCalsScale(w, h);

  // 如果图片框稍微全部显示在可视区域，为避免bug，不做放大处理。
  if (containerPosition.top + containerPosition.height > winHeight + 10) {
    return;
  }
  const x = containerPosition.left + containerPosition.width + 15;
  let y = containerPosition.top + containerPosition.height / 2;
  let marginTop = 0;

  // 解决底部部分显示不了问题
  if (y + (scaleInMagnifier.height + 50) / 2 > winHeight) {
    marginTop = y + (scaleInMagnifier.height + 50) / 2 - winHeight;
    y -= marginTop;
  }

  timer = setTimeout(() => {
    that.setState({
      magnifierParams: {
        isMagnifierShow: true,
        imageUrl,
        name: imageObj.name,
        pixel: `${imageObj.width} x ${imageObj.height} px`,
        width: scaleInMagnifier.width,
        height: scaleInMagnifier.height,
        orientation: imageObj.orientation || 0,
        offset: {
          x,
          y,
          marginTop
        }
      }
    });
  }, that.state.magnifierShowTime);
};

export const onOutImageItem = (that) => {
  clearTimeout(timer);
  that.setState({
    magnifierParams: {
      isMagnifierShow: false,
      imageUrl: '',
      name: '',
      pixel: '',
      offset: {
        x: 0,
        y: 0
      }
    }
  });
};

export const toggleImageItemSelected = (that, id, event) => {
  const e = event || window.event;
  let ids = merge([], that.state.selectedImageIds);
  const index = ids.indexOf(id);

  // 如果按住了ctrl或mac的command, 需要支持多选.
  if (e.ctrlKey || e.metaKey) {
    if (index >= 0) {
      ids.splice(index, 1);
    } else {
      ids.push(id);
    }
  } else {
    // 永远选中一个.
    if (index === -1) {
      ids = [id];
    }
  }

  that.setState({
    selectedImageIds: ids
  });

  stopEvent(event);
};

export const onImageListDown = (that) => {
  clearImageIds(that);
};

export const onDragStarted = (that, id, event) => {
  const { selectedImageIds } = that.state;
  // 如果开始拖拽的元素不在选择的图片列表中，则清空列表，并将当前图片加入
  if (selectedImageIds.indexOf(id) === -1) {
    selectedImageIds.length = 0;
    selectedImageIds.push(id);
  }
  const { uploadedImages } = that.props;
  __app.dragType = dragTypes.photo;
  clearTimeout(timer);
  that.setState({
    magnifierParams: {
      isMagnifierShow: false,
      imageUrl: '',
      offset: {
        x: 0,
        y: 0
      }
    }
  });

  const imagesNeedTransfer = [];

  // 拖动多张图片.
  if (selectedImageIds && selectedImageIds.length) {
    uploadedImages.map((item) => {
      if (selectedImageIds.indexOf(item.guid) >= 0 || item.id === id) {
        imagesNeedTransfer.push({
          encImgId: item.encImgId,
          imageid: item.id,
          width: item.width,
          height: item.height,
          orientation: item.orientation || 0,
          type: elementTypes.photo
        });
      }
    });
  } else {
    // 拖动单张图片.
    const dragImage = uploadedImages.find((o) => {
      return o.guid === id;
    });

    if (dragImage) {
      imagesNeedTransfer.push({
        encImgId: dragImage.encImgId,
        imageid: dragImage.id,
        width: dragImage.width,
        height: dragImage.height,
        type: elementTypes.photo
      });
    }
  }

  const imgNode = document.querySelector(`#img-${get(uploadedImages[0], 'id')}`);

  setTransferData(event, imagesNeedTransfer);
  setTransferDragNode(event, imgNode);

  that.setState({
    selectedImageIds: []
  });
};

export const deleteImage = (that, imageObj) => {
  const { boundProjectActions } = that.props;
  if (imageObj.encImgId) {
    boundProjectActions.deleteProjectImage(imageObj.encImgId);
  }
};

export const onSelect = (that, selectionBox) => {
  if (selectionBox.p1 && selectionBox.p2) {
    selectElements(that, selectionBox.p1, selectionBox.p2);
  }
};


export const onSelectStop = (that, selectionBox) => {
  if (selectionBox.p1 && selectionBox.p2) {
    selectElements(that, selectionBox.p1, selectionBox.p2);
  }
};

const selectElements = (that, p1, p2) => {
  const selectElementIds = [];
  const elementsArray = Array.prototype.slice.call(document.querySelectorAll('.preview-image'), 0);
  const tempP1 = {
    x: p1.x < p2.x ? p1.x : p2.x,
    y: p1.y < p2.y ? p1.y : p2.y
  };

  const tempP2 = {
    x: p2.x > p1.x ? p2.x : p1.x,
    y: p2.y > p1.y ? p2.y : p1.y
  };

  const selectedElementArray = elementsArray.map((element) => {
    const container = element.parentNode.parentNode;
    const position = {
      x: container.offsetLeft,
      y: container.offsetTop
    };
    const position2 = {
      x: container.offsetLeft + element.offsetWidth,
      y: container.offsetTop + element.offsetHeight
    };

    if (tempP1.y < position2.y && tempP2.y > position.y &&
      tempP1.x < position2.x && tempP2.x > position.x) {
      const guid = container.getAttribute('data-guid');
      selectElementIds.push(guid);
    }
  });
  if (selectElementIds.length) {
    that.setState({
      selectedImageIds: selectElementIds
    });
  }
};

const stopEvent = (event) => {
  const e = event || window.event;
  e.stopPropagation();
};

const clearImageIds = (that) => {
  that.setState({
    selectedImageIds: []
  });
};


const reCalsScale = (width, height) => {
  const MAX_WIDTH = 400;
  const MAX_HEIGHT = 400;
  const ratio = width / height;
  if (width >= height) {
    const rWidth = MAX_WIDTH;
    return {
      width: rWidth,
      height: rWidth / ratio
    };
  }
  const rHeight = MAX_HEIGHT;
  return {
    width: rHeight * ratio,
    height: rHeight
  };
};
