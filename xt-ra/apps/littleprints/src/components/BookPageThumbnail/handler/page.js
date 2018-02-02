import Immutable from 'immutable';
import { elementTypes } from '../../../constants/strings';
import Element from '../../../utils/entries/element';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';
import { get, merge } from 'lodash';
import securityString from '../../../../../common/utils/securityString';

function convertElements(that, elements, ratio) {
  let outList = Immutable.List();

  const { elementArray } = that.state;

  elements.forEach((element) => {
    const computed = that.computedElementOptions(element, ratio);

    const stateElement = elementArray.find((o) => {
      return o.get('id') === element.get('id');
    });

    outList = outList.push(
      element.merge({ computed }, {
        // 不需要控制按钮.
        isSelected: false
      })
    );
  });

  return outList;
}

export const onEditImage = (that, element) => {
  const { data, actions } = that.props;
  const { boundImageEditModalActions, boundProjectActions } = actions;
  const { images, ratio } = data;

  const {
    computed,
    encImgId,
    imgRot,
    imageid,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY
  } = element.toJS();

  const eWidth = computed.width;
  const eHeight = computed.height;

  const imageDetail = images.get(encImgId);
  if(!imageDetail) return;
  const { width, height, name } = imageDetail.toJS();

  boundImageEditModalActions.showImageEditModal({
    imageEditApiTemplate: computed.corpApiTemplate,
    encImgId,
    imageId: encImgId ? 0 : imageid,
    rotation: imgRot,
    imageWidth: width,
    imageHeight: height,
    imageName: name,
    elementWidth: eWidth / ratio.workspace,
    elementHeight: eHeight / ratio.workspace,
    crop: {
      cropLUX,
      cropLUY,
      cropRLX,
      cropRLY
    },
    securityString,
    onDoneClick: (encImgId, crop, rotate) => {
      boundProjectActions.updateElement(
        merge({}, crop, { imgRot: rotate, id: element.get('id') })
      );
    }
  });
};

export const onRemoveImage = (that, element) => {
  const { data, actions } = that.props;
  const { page } = data;

  const { boundProjectActions, boundTrackerActions } = actions;
  if (element.get('type') === elementTypes.photo) {
    if (element.get('encImgId')) {
      boundTrackerActions.addTracker('ClickDeleteImage,AllPages');
      boundProjectActions.updateElement({
        id: element.get('id'),
        style: {
          opacity: 100,
          effectId: 0
        },
        border: {
          color: '#FFFFFF',
          size: 0,
          opacity: 100
        },
        encImgId: '',
        imageid: '',
        cropLUX: 0,
        cropLUY: 0,
        cropRLX: 0,
        cropRLY: 0,
        imgRot: 0
      });
    } else {
      boundProjectActions
        .deleteElement(element.get('id'), page.get('id'))
        .then(() => {
          // that.doAutoLayout();
        });
    }
  } else {
    boundProjectActions.deleteElement(element.get('id'), page.get('id'));
  }
};

export const onEditText = (that, element) => {
  const { actions, data } = that.props;
  const { boundTextEditModalActions, boundPaginationActions } = actions;
  const { allPageSheetIndex, page, index } = data;
  const pageId = page.get('id');
  boundPaginationActions.switchSheet(allPageSheetIndex).then(() => {
    boundPaginationActions.switchPage(index, pageId).then(() => {
      boundTextEditModalActions.showTextEditModal({ element });
    });
  });
};

export const componentWillMount = (that) => {
  const { page, ratio } = that.props.data;
  that.setState({
    elementArray: convertElements(that, page.get('elements'), ratio.workspace)
  });
};

export const componentWillReceiveProps = (that, nextProps) => {
  const oldElements = that.props.data.page.get('elements');
  const newElements = nextProps.data.page.get('elements');

  const oldRatio = that.props.data.ratio.workspace;
  const newRatio = nextProps.data.ratio.workspace;

  const oldSize = that.props.data.settings.spec.size;
  const newSize = nextProps.data.settings;

  if (!Immutable.is(oldElements, newElements) || oldRatio !== newRatio
      || oldSize !== newSize
    ) {
    const newElementArray = convertElements(that, newElements, newRatio);

    that.setState({
      elementArray: newElementArray
    });
  }
};
