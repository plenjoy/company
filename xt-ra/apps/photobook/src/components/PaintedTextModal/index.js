import React, { Component, PropTypes } from 'react';

import { template, merge } from 'lodash';
import {
  elementTypes,
  paintedTextFontsFilterArray,
  DEFAULT_FONT_FAMILY_ID,
  DEFAULT_FONT_WEIGHT_ID,
  pageTypes,
  defaultSpineTextLength
} from '../../contants/strings';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';
import XBasicColorPicker from '../../../../common/ZNOComponents/XBasicColorPicker';
import { toDecode, isEncode, toEncode } from '../../../../common/utils/encode';
import FontUrl from '../../components/FontUrl';

import { getPxByPt, getPtByPx } from '../../../../common/utils/math';
import { TEXT_SRC, GET_FONT_THUMBNAIL } from '../../contants/apiUrl';

import './index.scss';

const MIN_FONT_SIZE = 4;
const MAX_FONT_SIZE = 120;

class PaintedTextEditModal extends Component {
  constructor(props) {
    super(props);

    const alignOptionList = [
      {
        value: 'left',
        title: 'Align Text Left'
      },
      {
        value: 'center',
        title: 'Center Text'
      },
      {
        value: 'right',
        title: 'Align Text Right'
      }
    ];

    const verticalAlignOptionList = [
      {
        value: 'top',
        title: 'Vertical Align Text Top'
      },
      {
        value: 'middle',
        title: 'Middle Text'
      },
      {
        value: 'bottom',
        title: 'Vertical Align Text Bottom'
      }
    ];

    this.state = {
      alignOptionList,
      verticalAlignOptionList,
      previewTextImageSrc: null,
      previewTextImageBlobSrc: null,
      timer: null,
      lastRequestTime: null,
      isShowIllegalCharTip: false,
      isShowTextNotFit: false,
      hideTipTimer: null,
      lastAppearIllegalCharTime: null,
      showCharsTip: false
    };

    this.onTextAreaChange = this.onTextAreaChange.bind(this);

    this.onFontNameChange = this.onFontNameChange.bind(this);
    this.onFontWeightChange = this.onFontWeightChange.bind(this);
    this.onFontColorChange = this.onFontColorChange.bind(this);

    this.onSliderChange = this.onSliderChange.bind(this);
    this.onSizeInputChange = this.onSizeInputChange.bind(this);
    this.onSizeInputBlur = this.onSizeInputBlur.bind(this);

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
    if (
      this.props.isShown !== nextProps.isShown ||
      this.state.fontWeight !== nextState.fontWeight ||
      this.state.fontName !== nextState.fontName ||
      this.state.fontColor !== nextState.fontColor ||
      this.state.inputText !== nextState.inputText ||
      this.state.inputSize !== nextState.inputSize
    ) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const oldIsShown = prevProps.isShown;
    const newIsShown = this.props.isShown;
    if (oldIsShown !== newIsShown && newIsShown) {
      const { inputText } = this.refs;
      inputText.focus();
      if (inputText.setSelectionRange) {
        inputText.setSelectionRange(
          inputText.value.length,
          inputText.value.length
        );
      }
    }
  }

  initData(element) {
    const { fontList, bookSetting, baseUrl, currentPage } = this.props;
    const fontSetting = bookSetting.get('font');
    let avaiableFontList = fontList.filter(font => !font.deprecated);

    const paintedTextFonts = [];
    let eachFont;

    let paintedTextFontsWigth = [];
    // 如果为spinetext 不显示CharsTip
    if (element && element.get('type') === elementTypes.text) {
      this.setState({ showCharsTip: true });
    } else {
      this.setState({ showCharsTip: false });
    }

    // 如果为paint 的spineText 过滤字体
    if (element && element.get('type') === elementTypes.paintedText) {
      paintedTextFontsFilterArray.forEach(v => {
        eachFont = avaiableFontList.find(value => value.displayName === v.font);

        const newFont = merge({}, eachFont);

        // 找到的 eachFont 在 通过 paintedTextFontsFilterArray里面的 weight 过滤fontweigh
        if (newFont.name) {
          paintedTextFontsWigth = [];

          v.weight.forEach(val => {
            const newFontWigth = newFont.font.find(
              eachFontValue => eachFontValue.displayName === val
            );
            newFontWigth && paintedTextFontsWigth.push(newFontWigth);
          });

          newFont.font = paintedTextFontsWigth;
        }

        newFont.name && paintedTextFonts.push(newFont);
      });
      avaiableFontList = paintedTextFonts;
    }

    const { alignOptionList, verticalAlignOptionList } = this.state;

    let fontFamilyId = fontSetting.get('fontFamilyId');
    let fontId = fontSetting.get('fontId');
    let fontSize = fontSetting.get('fontSize');
    let fontColor = fontSetting.get('color');
    let align = alignOptionList[0].value;
    let verticalAlign = verticalAlignOptionList[0].value;
    let inputText = '';

    if (element) {
      const fontFamily = toDecode(element.get('fontFamily'));

      fontList.forEach(family => {
        family.font.forEach(font => {
          if (
            font.fontFace === fontFamily &&
            fontFamilyId === fontSetting.get('fontFamilyId')
          ) {
            fontFamilyId = family.id;
            fontId = font.id;
          }
        });
      });

      const fontSizePercent = element.get('fontSize');

      fontSize = Math.round(
        getPtByPx(fontSizePercent * currentPage.get('height'))
      );
      fontColor = element.get('fontColor');
      align = element.get('textAlign');
      verticalAlign = element.get('textVAlign') || verticalAlign;

      inputText = element.get('text') ? toDecode(element.get('text')) : '';

      const oldElement = this.props.element;
      if (oldElement && oldElement.get('id') !== element.get('id')) {
        this.setState({
          isShowTextNotFit: false
        });
      }
    }

    let selectedFont = avaiableFontList.find(font => {
      return font.id === fontFamilyId;
    });

    // 如果没有找到, 就使用默认的字体.
    if (!selectedFont) {
      selectedFont = avaiableFontList.find(font => {
        return font.id === DEFAULT_FONT_FAMILY_ID;
      });

      fontFamilyId = DEFAULT_FONT_FAMILY_ID;
      fontId = DEFAULT_FONT_WEIGHT_ID;
    }

    const theFontList = !selectedFont.deprecated ? avaiableFontList : fontList;
    const fontOptionList = theFontList.map(font => {
      return {
        disabled: font.deprecated,
        title: font.displayName,
        label: font.displayName,
        value: font.id,
        fontThumbnailUrl: template(GET_FONT_THUMBNAIL)({
          baseUrl,
          fontName: font.name
        })
      };
    });

    const fontWeightOptionList = selectedFont.font.map(o => {
      const displayName = o.displayName.replace(/\s*\d+/, '');
      return {
        disabled: selectedFont.deprecated,
        title: displayName,
        label: displayName,
        value: o.id
      };
    });

    this.setState({
      avaiableFontList,
      fontName: fontFamilyId,
      fontWeight: fontId,
      timer: null,
      lastRequestTime: null,
      inputSize: fontSize,
      fontSize,
      fontColor,
      align,
      verticalAlign,
      inputText,
      fontOptionList,
      fontWeightOptionList
    });
  }

  onFontNameChange(selectedOption) {
    const { fontList } = this.props;
    const { avaiableFontList } = this.state;

    const selectedFont = avaiableFontList.find(font => {
      return font.id === selectedOption.value;
    });

    const fontWeightOptionList = selectedFont.font.map(o => {
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

  onSliderChange(fontSize) {
    this.setState({
      fontSize,
      inputSize: fontSize
    });
  }

  onSizeInputChange(e) {
    const inputValue = e.target.value;

    this.setState({
      inputSize: inputValue
    });
  }

  onSizeInputBlur(e) {
    const inputValue = +e.target.value;

    let fontSize = inputValue;
    if (inputValue > MAX_FONT_SIZE) {
      fontSize = MAX_FONT_SIZE;
    } else if (inputValue < MIN_FONT_SIZE) {
      fontSize = MIN_FONT_SIZE;
    }

    this.setState({
      inputSize: fontSize,
      fontSize
    });
  }

  onFontColorChange(color) {
    this.setState({
      fontColor: color.hex
    });
  }

  onTextAreaChange(e) {
    const rLegalKeys = /[^\u000d\u000a\u0020-\u007e]*/g;
    const inputString = e.target.value;
    const filteredInputString = inputString.replace(rLegalKeys, '');

    // 当用户输入的内容全部为空白字符时
    if (/^\s*$/.test(inputString)) {
      this.setState({
        inputText: inputString
      });
      return;
    }
    this.setState({
      inputText: filteredInputString
    });
  }

  getFontObj(fontWeight) {
    const { fontList } = this.props;
    let fontObj = null;
    fontList.forEach(fontFamily => {
      fontFamily.font.forEach(font => {
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
      align,
      verticalAlign,
      inputText
    } = this.state;

    const {
      updateElement,
      closePaintedTextModal,
      currentPage,
      element,
      allContainers
    } = this.props;
    const coverSpin = allContainers.find(
      v => v.get('type') === pageTypes.spine
    );
    const coverSpinId = coverSpin && coverSpin.get('id');

    const fontObj = this.getFontObj(fontWeight);

    const text = inputText || '';

    updateElement(
      {
        fontSize: getPxByPt(fontSize) / currentPage.get('height'),
        fontColor,
        text: toEncode(text),
        id: element.get('id'),
        textAlign: align,
        textVAlign: verticalAlign,
        fontWeight: fontObj.weight,
        fontFamily: toEncode(fontObj.fontFace)
      },
      coverSpinId
    );

    // 清空输入框.
    this.setState({
      inputText: ''
    });

    closePaintedTextModal();
  }

  onAlignChange(align) {
    this.setState({ align });
  }

  onVerticalAlignChange(verticalAlign) {
    this.setState({ verticalAlign });
  }

  render() {
    const {
      fontOptionList,
      fontWeightOptionList,
      fontName,
      fontWeight,
      fontColor,
      inputText,
      showCharsTip
    } = this.state;
    const { isShown, closePaintedTextModal, setting } = this.props;

    const needResetColor = isShown;

    const needBasicColorPickerLeather = ['rusticGreen', 'rusticBrown'];

    const useBasicColorPicker =
      needBasicColorPickerLeather.indexOf(setting.leatherColor) !== -1;

    return (
      <XModal
        className="text-edit-modal"
        onClosed={closePaintedTextModal}
        opened={isShown}
      >
        <h2 className="modal-title">Edit Text</h2>

        <div className="modal-content">
          <div className="option-container">
            <div className="option-item">
              <div className="select-container font-name">
                {isShown ? (
                  <XSelect
                    className="font"
                    options={fontOptionList}
                    searchable={false}
                    onChanged={this.onFontNameChange}
                    value={fontName}
                    optionComponent={FontUrl}
                  />
                ) : null}
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

            {useBasicColorPicker ? (
              <XBasicColorPicker
                initHexString={fontColor}
                colors={['#000000', '#FFFFFF']}
                onColorChange={this.onFontColorChange}
              />
            ) : (
              <XColorPicker
                needResetColor={needResetColor}
                initHexString={fontColor}
                onColorChange={this.onFontColorChange}
              />
            )}
          </div>

          <div className="text-box">
            {showCharsTip ? (
              <p className="illegal-chars-tip">
                {
                  <span>
                    {`Text should be less than ${defaultSpineTextLength} characters, extra character will be removed`}
                  </span>
                }
              </p>
            ) : null}

            <input
              className="text-box"
              placeholder="Type here..."
              onInput={this.onTextAreaChange}
              maxLength={99}
              value={inputText}
              ref="inputText"
            />
          </div>

          <p className="button-container">
            <XButton
              onClicked={this.onSubmit}
              disabled={!inputText || !inputText.trim().length}
            >
              Done
            </XButton>
          </p>
        </div>
      </XModal>
    );
  }
}

export default PaintedTextEditModal;
