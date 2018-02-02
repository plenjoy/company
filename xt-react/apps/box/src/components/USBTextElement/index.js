import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import XLoading from '../../../common/ZNOComponents/XLoading';

import Element from '../Element';
import * as Events from './handler/events';
import fetchTextImage from '../../utils/fetchTextImage';
import { defaultFontStyle } from '../../contants/strings';
import { hexString2Number } from '../../../common/utils/colorConverter';

import './index.scss';
import textPlaceHolder_USB_Black from './AddPaintedText-Black.svg';
import textPlaceHolder_USB_Silver from './AddPaintedText-Silver.svg';

const TEXT_AREA_WIDTH = 160;
const TEXT_AREA_HEIGHT = 50;

class USBTextElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImgLoading: false,
      imageSrc: null
    };

    this.onImgLoad = this.onImgLoad.bind(this);
  }

  componentDidMount() {
    const {
      isPreview,
      element,
      urls
    } = this.props.data;

    if(isPreview) {
      return fetchTextImage(urls, {...element, fontColor: hexString2Number(element.fontColor)})
        .then((blob) => {
          this.setState({
            imageSrc: URL.createObjectURL(blob),
            isImgLoading: false
          });
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldElement = this.props.data.element;
    const newElement = nextProps.data.element;
    const urls = nextProps.data.urls;
    const oldSetting = this.props.data.setting;
    const newSetting = nextProps.data.setting;
    const { boundProjectActions } = nextProps.actions;

    const oldPage = this.props.data.page;
    const newPage = nextProps.data.page;

    if(oldSetting.usbColor !== newSetting.usbColor &&
      (newElement.fontColor === '#000000' || newElement.fontColor === '#FFFFFF')
      ) {

      let defaultColor = '#000000';

      if(newSetting.usbColor === 'usb_silver') {
        defaultColor = '#000000';
      } else if(newSetting.usbColor === 'usb_black') {
        defaultColor = '#FFFFFF';
      }

      boundProjectActions.updateElement({
        id: newElement.id,
        fontColor: defaultColor
      });
    }

    if(newElement.computed.width !== oldElement.computed.width ||
      newElement.computed.height !== oldElement.computed.height ||
      oldElement.text !== newElement.text ||
      oldElement.fontFamily !== newElement.fontFamily ||
      oldElement.fontWeight !== newElement.fontWeight ||
      oldElement.fontColor !== newElement.fontColor ||
      (this.state.imageSrc === null && !this.state.isImgLoading)
      ) {

      if(newElement.text) {
        this.setState({
          isImgLoading: true
        });

        return fetchTextImage(urls, {...newElement, fontColor: hexString2Number(newElement.fontColor)})
          .then((blob) => {
            this.setState({
              imageSrc: URL.createObjectURL(blob),
              isImgLoading: false
            });
          });
      }
    }
  }

  onClick() {
    const { actions, data } = this.props;
    const { editTextWithoutJustify } = actions;
    const { element } = data;

    editTextWithoutJustify(element, 'usbtexteditorShow');
  }

  getPlaceholder() {
    const { usbColor } = this.props.data.setting;
    switch(usbColor) {
      case 'usb_silver': {
        return <img className="USBTextElement__placeHolder" src={textPlaceHolder_USB_Silver} />;
      }
      case 'usb_black': {
        return <img className="USBTextElement__placeHolder" src={textPlaceHolder_USB_Black} />;
      }
    }
  }

  onImgLoad() {
    this.setState({
      isImgLoading: false
    });
  }

  render() {
    const { data, actions } = this.props;
    const { element, isPreview, urls, rate, paginationSpread: {backgroundSize}, page } = data;
    const { isImgLoading, imageSrc } = this.state;

    // 如果element未被初始化，就不渲染组件
    if(element.needInitialize) return null;

    // 由于出图page右边偏大，导致居中偏右，所以显示的时候需要稍微调整偏左
    const realImageWidth = backgroundSize.bgImageWidth - backgroundSize.paddingLeft - backgroundSize.paddingRight;
    const realPaddingRight = realImageWidth - backgroundSize.rPagePaddingLeft - page.width;
    const offsetLeft = realPaddingRight * rate - backgroundSize.rPagePaddingRight * rate;

    const realImageHeight = backgroundSize.bgImageHeight - backgroundSize.paddingTop - backgroundSize.paddingLeft;
    const realPaddingBottom = realImageHeight - backgroundSize.rPagePaddingTop - page.height;
    const offsetTop = realPaddingBottom * rate - backgroundSize.rPagePaddingTop * rate;

    const textBorderWidth = TEXT_AREA_WIDTH * backgroundSize.ratioX * rate;
    const textBorderHeight = TEXT_AREA_HEIGHT * backgroundSize.ratioY * rate;

    // 由于外边框变大，所以handler需要变大，并且相对于element进行偏移
    const handlerStyle = {
      position: 'absolute',
      width: `${textBorderWidth}px`,
      height: `${textBorderHeight}px`,
      top: `${(element.computed.height - textBorderHeight) / 2}px`,
      left: `${(element.computed.width - textBorderWidth) / 2}px`
    };

    const elementActions = {
      ...actions,
      handleClick: this.onClick.bind(this)
    };

    const elementData = {
      className: classNames('USBTextElement', 'text-element', {
        'has-text': Boolean(element.text)
      }),
      style: {
        zIndex: element.dep + 100,
        width: element.computed.width,
        height: element.computed.height + offsetTop / 2,
        left: element.computed.left + offsetLeft / 2,
        top: element.computed.top
      },
      handlerStyle,
      handlerData: element,
      element
    };

    const borderStyle = {
      width: textBorderWidth,
      height: textBorderHeight
    };

    return (
      <Element data={elementData} actions={elementActions}>
        <XLoading isShown={isImgLoading} />

        {
          elementData.element.text
          ? <img
              className="USBTextElement__image"
              src={imageSrc}
              onLoad={this.onImgLoad}
            />
          : this.getPlaceholder()
        }

        <div className="USBTextElement__border" style={borderStyle}></div>

      </Element>
    );
  }
}

USBTextElement.propTypes = {
};

export default USBTextElement;
