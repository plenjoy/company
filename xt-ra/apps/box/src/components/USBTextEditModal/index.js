import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { get, template } from 'lodash';

import XModal from '../../../common/ZNOComponents/XModal';
import XButton from '../../../common/ZNOComponents/XButton';
import XSelect from '../../../common/ZNOComponents/XSelect';
import XSlider from '../../../common/ZNOComponents/XSlider';
import XColorPicker from '../../../common/ZNOComponents/XColorPicker';
import FontUrl from '../../components/FontUrl';
import * as handler from './handler';
import { elementTypes, defaultFontStyle } from '../../contants/strings';

import { getPxByPt, getPtByPx } from '../../../common/utils/math';
import { hexString2Number } from '../../../common/utils/colorConverter';
import { TEXT_SRC, GET_FONT_THUMBNAIL } from '../../contants/apiUrl';

import './index.scss';

const MIN_FONT_SIZE = 4;
const MAX_FONT_SIZE = 120;

class USBTextEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      lastRequestTime: null,
      isShowIllegalCharTip: false,
      isShowTooLongTextTip: false,
      hideTipTimer: null,
      hideTooLongTextTipTimer: null,
      lastAppearIllegalCharTime: null,
      lastAppearTooLongTextTime: false
    };

    this.onTextAreaChange = this.onTextAreaChange.bind(this);

    this.onFontNameChange = this.onFontNameChange.bind(this);
    this.onFontWeightChange = this.onFontWeightChange.bind(this);
    this.onFontColorChange = this.onFontColorChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.initData(this.props.element);
  }

  componentWillReceiveProps(nextProps) {
    const oldIsShown = this.props.isShown;
    const newIsShown = nextProps.isShown;

    if (oldIsShown !== newIsShown && newIsShown) {
      this.initData(nextProps.element);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.isShown !== nextProps.isShown ||
      this.state.fontName !== nextState.fontName ||
      this.state.fontWeight !== nextState.fontWeight ||
      this.state.fontSize !== nextState.fontSize ||
      this.state.fontColor !== nextState.fontColor ||
      this.state.inputText !== nextState.inputText ||
      this.state.isShowIllegalCharTip !== nextState.isShowIllegalCharTip ||
      this.state.isShowTooLongTextTip !== nextState.isShowTooLongTextTip) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const oldIsShown = prevProps.isShown;
    const newIsShown = this.props.isShown;
    if (oldIsShown !== newIsShown && newIsShown) {
      this.refs.inputText.focus();
    }
  }

  initData(element) {
    const { fontList, baseUrls, paginationSpread, pagination } = this.props;
    const { pages } = paginationSpread;
    const pageId = get(pagination, 'pageId');
    const currentPage = pages.find(p => p.id === pageId);

    const fontSetting = defaultFontStyle;
    const avaiableFontList = fontList.filter(font => !font.deprecated);

    let fontFamilyId = fontSetting.defaultFontFamilyId;
    let fontId = fontSetting.defaultFontId;
    let fontColor = fontSetting.defaultColor;
    let inputText = '';

    if (element) {
      avaiableFontList.forEach((fontFamily) => {
        fontFamily.font.forEach((font) => {
          if (font.fontFace === decodeURIComponent(element.fontFamily)) {
            fontFamilyId = fontFamily.id;
            fontId = font.id;
          }
        });
      });

      fontColor = element.fontColor;
      inputText = decodeURIComponent(element.text) || '';
    }

    const selectedFont = avaiableFontList.find((font) => {
      return font.id === fontFamilyId;
    });

    const theFontList = !selectedFont.deprecated ? avaiableFontList : fontList;
    const fontOptionList = theFontList.map((font) => {
      return {
        disabled: font.deprecated,
        title: font.displayName,
        label: font.displayName,
        value: font.id,
        fontThumbnailUrl: template(GET_FONT_THUMBNAIL)({
          baseUrl: baseUrls.baseUrl,
          fontName: font.name
        })
      };
    });

    const fontWeightOptionList = selectedFont.font.map((o) => {
      const displayName = o.displayName.replace(/\s*\d+/, '');
      return {
        disabled: selectedFont.deprecated,
        title: displayName,
        label: displayName,
        value: o.id
      };
    });

    this.setState({
      fontName: fontFamilyId,
      fontWeight: fontId,
      timer: null,
      lastRequestTime: null,
      fontColor,
      inputText,
      fontOptionList,
      fontWeightOptionList
    });
  }

  onFontNameChange(selectedOption) {
    const { fontList } = this.props;
    const avaiableFontList = fontList.filter(font => !font.deprecated);

    const selectedFont = avaiableFontList.find((font) => {
      return font.id === selectedOption.value;
    });

    const fontWeightOptionList = selectedFont.font.map((o) => {
      const displayName = o.displayName.replace(/\s*\d+/, '');
      return {
        title: displayName,
        label: displayName,
        value: o.id
      };
    });

    this.setState({
      fontName: selectedOption.value,
      fontWeight: selectedFont.font[0].id,
      fontWeightOptionList
    });
  }

  onFontWeightChange(selectedOption) {
    this.setState({
      fontWeight: selectedOption.value
    });
  }

  onFontColorChange(color) {
    this.setState({
      fontColor: color.hex
    });
  }

  onTextAreaChange(e) {
    const { hideTipInterval, element } = this.props;
    const { hideTipTimer, hideTooLongTextTipTimer, lastAppearIllegalCharTime, lastAppearTooLongTextTime } = this.state;

    // const rLegalKeys = /[^\u000d\u000a\u0020-\u007e]*/g;
    const rLegalKeys = /[^\u000d\u000a\u0020-\u007e]*[\r\n]*/g;
    const inputString = e.target.value;
    const filteredInputString = element.type === elementTypes.usbText
      ? inputString.replace(rLegalKeys, '').slice(0, 13).trimLeft()
      : inputString.replace(rLegalKeys, '').trimLeft();

    if (element.type === elementTypes.usbText && inputString.length > 13) {
      if (!lastAppearTooLongTextTime ||
      (Date.now() - lastAppearTooLongTextTime < hideTipInterval)) {
        window.clearTimeout(hideTooLongTextTipTimer);
        const newTimer = window.setTimeout(() => {
          this.setState({
            isShowTooLongTextTip: false
          });
        }, hideTipInterval);

        this.setState({
          hideTooLongTextTipTimer: newTimer
        });
      } else {
        this.setState({
          lastAppearTooLongTextTime: Date.now()
        });
      }
      this.setState({
        isShowTooLongTextTip: true
      });
    } else {
      this.setState({
        isShowTooLongTextTip: false
      });
    }

    if (filteredInputString !== inputString && inputString.length <= 13) {
      if (!lastAppearIllegalCharTime ||
      (Date.now() - lastAppearIllegalCharTime < hideTipInterval)) {
        window.clearTimeout(hideTipTimer);
        const newTimer = window.setTimeout(() => {
          this.setState({
            isShowIllegalCharTip: false
          });
        }, hideTipInterval);

        this.setState({
          hideTipTimer: newTimer
        });
      } else {
        this.setState({
          lastAppearIllegalCharTime: Date.now()
        });
      }
      this.setState({
        isShowIllegalCharTip: true
      });
    } else {
      this.setState({
        isShowIllegalCharTip: false
      });
    }

    this.setState({
      inputText: filteredInputString
    });
  }

  getFontObj(fontWeight) {
    const { fontList } = this.props;
    const avaiableFontList = fontList.filter(font => !font.deprecated);

    let fontObj = null;
    avaiableFontList.forEach((fontFamily) => {
      fontFamily.font.forEach((font) => {
        if (font.id === fontWeight) {
          fontObj = font;
        }
      });
    });

    return fontObj;
  }

  onSubmit() {
    const {
      fontWeight,
      fontSize,
      fontColor,
      inputText
    } = this.state;

    const {
      updateElement,
      closeTextEditModal,
      element
    } = this.props;

    const fontObj = this.getFontObj(fontWeight);

    const text = inputText.replace(/\s+$/g, '');

    updateElement({
      fontColor,
      text: encodeURIComponent(text),
      id: element.id,
      fontWeight: encodeURIComponent(fontObj.weight),
      fontFamily: encodeURIComponent(fontObj.fontFace)
    });

    closeTextEditModal();
  }

  render() {
    const {
      fontOptionList,
      fontWeightOptionList,
      fontName,
      fontWeight,
      fontSize,
      fontColor,
      inputSize,
      inputText,
      isShowTooLongTextTip,
      isShowIllegalCharTip
    } = this.state;

    const {
      isShown,
      closeTextEditModal
    } = this.props;

    const needResetColor = isShown;

    return (
      <XModal
        className="text-edit-modal"
        onClosed={closeTextEditModal}
        opened={isShown}
      >
        <h2 className="modal-title">Edit Text</h2>

        <div className="modal-content">
          <div className="option-container">
            <div className="option-item">
              <div className="select-container font-name">
                <XSelect
                  className="font"
                  options={fontOptionList}
                  searchable={false}
                  onChanged={this.onFontNameChange}
                  value={fontName}
                  optionComponent={FontUrl}
                />
              </div>
              <div className="select-container font-weight">
                <XSelect
                  className="font-weight"
                  options={fontWeightOptionList}
                  searchable={false}
                  onChanged={this.onFontWeightChange}
                  value={fontWeight}
                />
              </div>
            </div>
            <div className="divider" />

            <XColorPicker
              needResetColor={needResetColor}
              initHexString={fontColor}
              onColorChange={this.onFontColorChange}
            />
          </div>


          <div className="text-box">
            <textarea
              className="text-box"
              placeholder="Type here..."
              onInput={this.onTextAreaChange}
              value={inputText}
              ref="inputText"
            />

            <p className="illegal-char-tip">
              {
                isShowTooLongTextTip
                ? (
                  <span>
                    13 characters limited
                  </span>
                )
                : null
              }
              {
                isShowIllegalCharTip
                ? (
                  <span>
                    Invalid characters removed
                  </span>
                )
                : null
              }
            </p>
          </div>


          <p className="button-container">
            <XButton
              onClicked={this.onSubmit}
            >Done</XButton>
          </p>
        </div>
      </XModal>
    );
  }
}

USBTextEditModal.propTypes = {
};

USBTextEditModal.defaultProps = {
  requestInterval: 1000,
  hideTipInterval: 2000
};

export default USBTextEditModal;
