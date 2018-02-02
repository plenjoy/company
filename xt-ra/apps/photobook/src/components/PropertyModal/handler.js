import React from 'react';
import { merge, get, pick, forEach, isEqual, set } from 'lodash';
import SliderChange from '../SliderChange';
import {
  MIN_BORDER_SIZE,
  MAX_BORDER_SIZE,
  MIN_BORDER_OPACITY,
  MAX_BORDER_OPACITY,
  gradientTypes,
  mapGradients,
  gradientKeepFields,
  mapGradientOptions,
  filterEffectMap } from '../../contants/strings';
  import { convertObjIn } from '../../../../common/utils/typeConverter';

  import { getCropOptions, getCropLRByOptions, getCropOptionsByLR } from '../../utils/crop';

  import { toFixed, isDecimal } from '../../../../common/utils/math';

// 最小宽高
const MIN_PHOTO_HEIGHT = 180;
const MIN_PHOTO_WIDTH = 180;

// 缩略图最大宽高
const THUMB_WIDTH = 150;
const THUMB_HEIGHT = 150;

export const toggleLockDimension = (that, event) => {
  that.setState({
    lockDimension: !that.state.lockDimension
  });
  event.preventDefault();
  event.stopPropagation();
};

export const opacityChange = (that, opacity) => {
  that.setState({
    element: merge({}, that.state.element, {
      style: merge({}, that.state.element.style, {
        opacity
      })
    }),
    isImgLoading: false
  });
};

export const brightnessChange = (that, brightness) => {
  that.setState({
    element: merge({}, that.state.element, {
      style: merge({}, that.state.element.style, {
        brightness
      })
    }),
    isImgLoading: false
  });
};

export const contrastChange = (that, contrast) => {
  that.setState({
    element: merge({}, that.state.element, {
      style: merge({}, that.state.element.style, {
        contrast
      })
    }),
    isImgLoading: false
  });
};

export const saturationChange = (that, saturation) => {
  that.setState({
    element: merge({}, that.state.element, {
      style: merge({}, that.state.element.style, {
        saturation
      })
    }),
    isImgLoading: false
  });
};

export const widthInput = (that, event) => {
  const { propertyModal } = that.props;
  const { element } = that.state;
  const { encImgId, imgRot } = element;
  const r = propertyModal.ratio;
  let options;
  let width = parseFloat(event.target.value);
  if (width < MIN_PHOTO_WIDTH) {
    width = MIN_PHOTO_WIDTH;
  }
  width *= r;
  const image = that.getImage(encImgId);
  if (that.state.lockDimension) {
    const ratio = width / that.state.element.width;
    const height = that.state.element.height * ratio;
    options = getCropOptions(image.get('width'), image.get('height'), width, height, imgRot);
    that.setState({
      element: merge({}, that.state.element, {
        width: width / r,
        height: height / r,
        cropLUX: options.cropLUX,
        cropLUY: options.cropLUY,
        cropRLX: options.cropRLX,
        cropRLY: options.cropRLY,
        computed: merge({}, that.state.element.computed, {
          width,
          height
        })
      })
    });
  } else {
    options = getCropOptions(image.get('width'), image.get('height'), width, that.state.element.computed.height, imgRot);
    that.setState({
      element: merge({}, that.state.element, {
        width: width / r,
        cropLUX: options.cropLUX,
        cropLUY: options.cropLUY,
        cropRLX: options.cropRLX,
        cropRLY: options.cropRLY,
        computed: merge({}, that.state.element.computed, {
          width
        })
      })
    });
  }
};

export const heightInput = (that, event) => {
  const { propertyModal } = that.props;
  const { element } = that.state;
  const { encImgId, imgRot } = element;
  const r = propertyModal.ratio;
  let options;
  let height = parseFloat(event.target.value);
  if (height <= MIN_PHOTO_HEIGHT) {
    height = MIN_PHOTO_HEIGHT;
  }
  height *= r;
  const image = that.getImage(encImgId);
  if (that.state.lockDimension) {
    const ratio = height / that.state.element.height;
    const width = that.state.element.width * ratio;
    options = getCropOptions(image.get('width'), image.get('height'), width, height, imgRot);
    that.setState({
      element: merge({}, that.state.element, {
        width: width / r,
        height: height / r,
        cropLUX: options.cropLUX,
        cropLUY: options.cropLUY,
        cropRLX: options.cropRLX,
        cropRLY: options.cropRLY,
        computed: merge({}, that.state.element.computed, {
          width,
          height
        })
      })
    });
  } else {
    options = getCropOptions(image.get('width'), image.get('height'), that.state.element.computed.width, height, imgRot);
    that.setState({
      element: merge({}, that.state.element, {
        height: height / r,
        cropLUX: options.cropLUX,
        cropLUY: options.cropLUY,
        cropRLX: options.cropRLX,
        cropRLY: options.cropRLY,
        computed: merge({}, that.state.element.computed, {
          height
        })
      })
    });
  }
};

export const xInput = (that, event) => {
  const x = parseFloat(event.target.value);
  if (x !== that.state.element.x) {
    that.setState({
      element: merge({}, that.state.element, {
        x
      })
    });
  }
};

export const yInput = (that, event) => {
  const y = parseFloat(event.target.value);
  if (that.state.element.y !== y) {
    that.setState({
      element: merge({}, that.state.element, {
        y
      })
    });
  }
};

export const handlePropertyModalClose = (that) => {
  const { closePropertyModal } = that.props;
  closePropertyModal();
};

export const handleCancelClick = (that) => {
  that.handlePropertyModalClose();
};

export const handleDoneClick = (that) => {
  const { boundProjectActions, propertyModal } = that.props;
  const { onPropertyModalClosed } = propertyModal;
  const { element } = that.state;

  const gradient = get(element, 'style.gradient');

  const oldElement = propertyModal.element;
  const keepFields = gradientKeepFields.concat(mapGradientOptions[gradient.gradientType]);
  const newGradient = pick(gradient, keepFields);

  const newElement = that.checkModified(oldElement, element);

  let modifiedElement = merge({}, element, newElement);
  modifiedElement = set(modifiedElement, 'style.gradient', newGradient);

  delete modifiedElement.computed;

  boundProjectActions.updateElement(convertObjIn(modifiedElement)).then(() => {
    that.handlePropertyModalClose();
  });
  // 重绘element control
  onPropertyModalClosed();
};

export const getImage = (that, encImgId) => {
  const { allImages } = that.props;
  return allImages.find((image) => {
    return image.get('encImgId') === encImgId;
  });
};

export const handleTabChange = (that, index) => {
  that.setState({
    currentTabIndex: index
  });
};

export const changeFilter = (that, filterTag) => {
  const effectId = get(that.state, 'element.style.effectId');
  if (effectId !== filterEffectMap[filterTag]) {
    that.setState({
      element: merge({}, that.state.element, {
        style: merge({}, that.state.element.style, {
          effectId: filterEffectMap[filterTag]
        })
      }),
      isImgLoading: false
    });
  }
};

export const borderColorChange = (that, color) => {
  that.setState({
    element: merge({}, that.state.element, {
      border: merge({}, that.state.element.border, {
        color: color.hex
      })
    })
    // isImgLoading: false
  });
};

export const borderSizeChange = (that, borderSize) => {
  const { page } = that.props;
  const pageWidth = page.get('width');
  let opacity = get(that.state, 'element.border.opacity');
  if (borderSize > 0 && opacity === 0) {
    opacity = 100;
  }
  that.setState({
    element: merge({}, that.state.element, {
      border: merge({}, that.state.element.border, {
        size: Math.ceil(borderSize),
        opacity
      })
    }),
    borderSize
  });
};

export const borderOpacityChange = (that, opacity) => {
  that.setState({
    element: merge({}, that.state.element, {
      border: merge({}, that.state.element.border, {
        opacity
      })
    })
  });
};

export const checkModified = (oldElement, newElement) => {
  const ignoreKeys = ['id'];
  const modified = {
    id: get(newElement, 'id')
  };
  forEach(oldElement, (item, key) => {
    if (!isEqual(get(newElement, key), item)) {
      modified[key] = get(newElement, key);
    }
  });
  return modified;
};

export const getGradientHtml = (that) => {
  const gradient = get(that.state, 'element.style.gradient');
  const { t } = that.props;
  const { gradientType } = gradient;
  const html = [];
  const currentGradientInfo = mapGradients.find((g) => {
    return g.type === gradientType;
  });
  if (currentGradientInfo) {
    const { options } = currentGradientInfo;
    options.forEach((opt, index) => {
      const optionChange = (optionValue) => {
        that.gradientOptionChange(opt.key, optionValue);
      };
      const value = typeof gradient[opt.key] !== 'undefined' ? gradient[opt.key] : opt.defaultValue;
      const readonly = opt.step === 90;
      html.push(
        <SliderChange
          onChange={optionChange}
          label={`${t(opt.key)}:`}
          subfix=""
          min={opt.min}
          max={opt.max}
          total={opt.max - opt.min}
          step={opt.step}
          value={value}
          key={index}
          readonly={readonly}
          disabled={!gradient.gradientEnable}
        />
      );
    });
  }
  return html;
};

export const onImageLoaded = (that, event) => {
  that.hideLoading();

  let width = event.target.naturalWidth;
  let height = event.target.naturalHeight;

  if (width >= height) {
    if (width < THUMB_WIDTH) {
      height = (THUMB_WIDTH * height) / width;
      width = THUMB_WIDTH;
    }
  } else if (height < THUMB_HEIGHT) {
    width = (THUMB_HEIGHT * width) / height;
    height = THUMB_HEIGHT;
  }

  that.setState({
    thumbnail: { width, height }
  });
};

export const enableChange = (that, status) => {
  const { element } = that.state;
  const newElement = set(element, 'style.gradient.gradientEnable', status.checked);
  that.setState({
    element: newElement
  });
};

export const gradientTypesChange = (that, type) => {
  const { element } = that.state;
  const currentType = mapGradients.find((g) => {
    return g.type === type.value;
  });
  let newElement = merge({}, element);
  // 重置style
  newElement.style.gradient = {
    gradientEnable: get(element, 'style.gradient.gradientEnable')
  };
  newElement = set(newElement, 'style.gradient.gradientType', type.value);
  if (currentType) {
    currentType.options.forEach((item) => {
      newElement = set(newElement, `style.gradient.${item.key}`, item.defaultValue);
    });
  }
  that.setState({
    element: newElement
  });
};

export const gradientOptionChange = (that, optionKey, optionValue) => {
  const { element } = that.state;
  const newElement = set(element, `style.gradient.${optionKey}`, optionValue);
  that.setState({
    element: newElement
  });
};


export const shadowOptionChange = (that, optionKey, optionValue) => {
  const { element } = that.state;
  let value = optionValue;
  if (typeof optionValue.checked !== 'undefined') {
    value = optionValue.checked;
  } else if (optionValue.hex) {
    value = optionValue.hex;
  }
  const newElement = set(element, `style.shadow.${optionKey}`, value);
  that.setState({
    element: newElement
  });
}
