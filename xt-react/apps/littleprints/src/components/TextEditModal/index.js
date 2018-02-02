import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';

import { template, cloneDeep, merge } from 'lodash';
import {
  elementTypes,
  paintedTextFontsFilterArray,
  DEFAULT_FONT_FAMILY_ID,
  DEFAULT_FONT_WEIGHT_ID,
  defaultFontSetting
} from '../../constants/strings';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import XSlider from '../../../../common/ZNOComponents/XSlider';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';
import { toDecode, isEncode, toEncode } from '../../../../common/utils/encode';
import FontUrl from '../../components/FontUrl';

import TextPreviewBox from '../TextPreviewBox';

import { getPxByPt, getPtByPx } from '../../../../common/utils/math';
import { hexString2Number } from '../../../../common/utils/colorConverter';
import { TEXT_SRC, GET_FONT_THUMBNAIL } from '../../constants/apiUrl';
import fetchTextBlobAndInfo from '../../utils/fetchTextBlobAndInfo';
import { getFontSizeInPt } from '../../utils/fontSize';

import './index.scss';

const MIN_FONT_SIZE = 4;
const MAX_FONT_SIZE = 120;

class TextEditModal extends Component {
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
      lastAppearIllegalCharTime: null
    };

    this.onTextAreaChange = this.onTextAreaChange.bind(this);

    this.onFontNameChange = this.onFontNameChange.bind(this);
    this.onFontWeightChange = this.onFontWeightChange.bind(this);
    this.onFontColorChange = this.onFontColorChange.bind(this);

    this.onSliderChange = this.onSliderChange.bind(this);
    this.onSizeInputChange = this.onSizeInputChange.bind(this);
    this.onSizeInputBlur = this.onSizeInputBlur.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.updatePreviewTextSrc = this.updatePreviewTextSrc.bind(this);
    this.delayUpdatePreviewTextSrc = this.delayUpdatePreviewTextSrc.bind(this);
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
      this.state.fontName !== nextState.fontName ||
      this.state.fontWeight !== nextState.fontWeight ||
      this.state.align !== nextState.align ||
      this.state.verticalAlign !== nextState.verticalAlign ||
      this.state.fontSize !== nextState.fontSize ||
      this.state.fontColor !== nextState.fontColor ||
      this.state.inputText !== nextState.inputText ||
      this.state.inputSize !== nextState.inputSize ||
      this.state.previewTextImageSrc !== nextState.previewTextImageSrc ||
      this.state.previewTextImageBlobSrc !==
        nextState.previewTextImageBlobSrc ||
      this.state.isShowIllegalCharTip !== nextState.isShowIllegalCharTip ||
      this.state.isShowTextNotFit !== nextState.isShowTextNotFit
    ) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const oldFontWeight = prevState.fontWeight;
    const newFontWeight = this.state.fontWeight;

    if (oldFontWeight !== newFontWeight) {
      this.updatePreviewTextSrc();
    }

    const oldFontSize = prevState.fontSize;
    const newFontSize = this.state.fontSize;
    if (oldFontSize !== newFontSize) {
      this.delayUpdatePreviewTextSrc();
    }

    const oldFontColor = prevState.fontColor;
    const newFontColor = this.state.fontColor;
    if (oldFontColor !== newFontColor) {
      this.delayUpdatePreviewTextSrc();
    }

    const oldInputText = prevState.inputText;
    const newInputText = this.state.inputText;
    if (oldInputText !== newInputText) {
      this.delayUpdatePreviewTextSrc();
    }

    const oldAlign = prevState.align;
    const newAlign = this.state.align;
    if (oldAlign !== newAlign) {
      this.updatePreviewTextSrc();
    }

    const oldVerticalAlign = prevState.verticalAlign;
    const newVerticalAlign = this.state.verticalAlign;
    if (oldVerticalAlign !== newVerticalAlign) {
      this.updatePreviewTextSrc();
    }

    const oldPreviewTextSrc = prevState.previewTextImageSrc;
    const newPreviewTextSrc = this.state.previewTextImageSrc;
    if (oldPreviewTextSrc !== newPreviewTextSrc) {
      this.getPreviewTextBlobAndTextInfo(newPreviewTextSrc, this.props.element);
    }

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
    const { fontList, baseUrl, currentPage } = this.props;
    const fontSetting = Immutable.fromJS(defaultFontSetting);
    let avaiableFontList = fontList.filter(font => !font.deprecated);

    const paintedTextFonts = [];
    let eachFont;

    let paintedTextFontsWigth = [];

    // 如果为spineText 过滤字体
    if (element && element.get('type') === elementTypes.paintedText) {
      paintedTextFontsFilterArray.forEach((v) => {
        eachFont = avaiableFontList.find(value => value.displayName === v.font);

        const newFont = merge({}, eachFont);

        // 找到的 eachFont 在 通过 paintedTextFontsFilterArray里面的 weight 过滤fontweigh
        if (newFont.name) {
          paintedTextFontsWigth = [];

          v.weight.forEach((val) => {
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
    let previewTextImageSrc = null;

    if (element) {
      const fontFamily = toDecode(element.get('fontFamily'));
      fontList.forEach((family) => {
        family.font.forEach((font) => {
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

      fontSize = getFontSizeInPt(fontSizePercent * currentPage.get('height'));
      fontColor = element.get('fontColor');
      align = element.get('textAlign');
      verticalAlign = element.get('textVAlign') || verticalAlign;
      inputText = element.get('text') ? toDecode(element.get('text')) : '';

      previewTextImageSrc = this.getPreviewTextImageSrc(
        inputText,
        fontSize,
        fontColor,
        fontFamily,
        align,
        verticalAlign,
        element
      );

      this.getPreviewTextBlobAndTextInfo(previewTextImageSrc, element);
      this.setState({
        isShowTextNotFit: false
      });
    }

    let selectedFont = avaiableFontList.find((font) => {
      return font.id === fontFamilyId;
    });

    // 如果没有找到, 就使用默认的字体.
    if (!selectedFont) {
      selectedFont = avaiableFontList.find((font) => {
        return font.id === DEFAULT_FONT_FAMILY_ID;
      });

      fontFamilyId = DEFAULT_FONT_FAMILY_ID;
      fontId = DEFAULT_FONT_WEIGHT_ID;
    }

    const theFontList = !selectedFont.deprecated ? avaiableFontList : fontList;
    const fontOptionList = theFontList.map((font) => {
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
      avaiableFontList,
      fontName: fontFamilyId,
      fontWeight: fontId,
      timer: null,
      lastRequestTime: null,
      inputSize: fontSize,
      previewTextImageSrc,
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

    const { hideTipInterval } = this.props;
    const { hideTipTimer, lastAppearIllegalCharTime } = this.state;

    // 当用户输入的内容全部为空白字符时
    if (/^\s*$/.test(inputString)) {
      this.setState({
        inputText: inputString
      });
      return;
    }

    if (filteredInputString !== inputString) {
      if (
        !lastAppearIllegalCharTime ||
        Date.now() - lastAppearIllegalCharTime < hideTipInterval
      ) {
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
    let fontObj = null;
    fontList.forEach((fontFamily) => {
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
      align,
      verticalAlign,
      inputText
    } = this.state;

    const { updateElement, closeTextEditModal, element } = this.props;

    const fontObj = this.getFontObj(fontWeight);

    const text = inputText || '';

    if (text || true) {
      updateElement({
        fontSize: getPxByPt(fontSize),
        fontColor,
        text: toEncode(text),
        id: element.get('id'),
        textAlign: align,
        textVAlign: verticalAlign,
        fontWeight: fontObj.weight,
        fontFamily: toEncode(fontObj.fontFace)
      });

      this.setState({
        inputText: ''
      });

      closeTextEditModal();
    }
  }

  getPreviewTextImageSrc(
    text,
    fontSize,
    fontColor,
    fontFamily,
    textAlign,
    verticalTextAlign,
    element
  ) {
    const { baseUrl, ratio } = this.props;

    const inputText = text || '';

    if (inputText) {
      const computed = element.get('computed');

      const originalFontSize = getPxByPt(fontSize);

      return template(TEXT_SRC)({
        text: toEncode(inputText),
        fontSize: originalFontSize,
        fontColor: hexString2Number(fontColor),
        fontFamily: toEncode(fontFamily),
        width: element.get('width'),
        height: element.get('height'),
        originalWidth: element.get('width'),
        originalHeight: element.get('height'),
        originalFontSize,
        baseUrl,
        textAlign,
        verticalTextAlign,
        ratio
      });
    }

    return '';
  }

  updatePreviewTextSrc() {
    const {
      fontWeight,
      fontSize,
      fontColor,
      align,
      verticalAlign,
      inputText
    } = this.state;

    if (!inputText) {
      this.setState({
        previewTextImageSrc: null
      });
      return;
    }

    const fontObj = this.getFontObj(fontWeight);

    this.setState({
      previewTextImageSrc: this.getPreviewTextImageSrc(
        inputText,
        fontSize,
        fontColor,
        fontObj.fontFace,
        align,
        verticalAlign,
        this.props.element
      )
    });
  }

  getPreviewTextBlobAndTextInfo(previewTextImageSrc, element) {
    if (!previewTextImageSrc) {
      this.setState({
        previewTextImageBlobSrc: null,
        isShowTextNotFit: false
      });
      return;
    }

    const elementWdith = element.get('width');
    const elementHeight = element.get('height');
    fetchTextBlobAndInfo(previewTextImageSrc, elementWdith, elementHeight)
      .then(({ isShowTextNotFit, blobUrl }) => {
        this.setState({
          previewTextImageBlobSrc: blobUrl,
          isShowTextNotFit
        });
      })
      .catch((error) => {
        this.setState({
          previewTextImageBlobSrc: null,
          isShowTextNotFit: false
        });
      });
  }

  delayUpdatePreviewTextSrc() {
    const { requestInterval } = this.props;
    const { lastRequestTime, timer } = this.state;
    if (!lastRequestTime || Date.now() - lastRequestTime < requestInterval) {
      window.clearTimeout(timer);
      const newTimer = window.setTimeout(
        this.updatePreviewTextSrc,
        requestInterval
      );
      this.setState({
        timer: newTimer
      });
    } else {
      this.setState({
        lastRequestTime: Date.now()
      });
    }
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
      alignOptionList,
      verticalAlignOptionList,
      fontName,
      fontWeight,
      fontSize,
      fontColor,
      inputSize,
      inputText,
      align,
      verticalAlign,
      previewTextImageBlobSrc,
      isShowIllegalCharTip,
      isShowTextNotFit
    } = this.state;

    let backgroundColor = '#ffffff';
    if (fontColor && fontColor.toLowerCase() === '#ffffff') {
      backgroundColor = '#7B7B7B';
    }

    const { isShown, closeTextEditModal } = this.props;

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
                {isShown
                  ? <XSelect
                    className="font"
                    options={fontOptionList}
                    searchable={false}
                    onChanged={this.onFontNameChange}
                    value={fontName}
                    optionComponent={FontUrl}
                  />
                  : null}
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
            <div className="option-item">
              <div className="size-container">
                <input
                  type="number"
                  className="size-input"
                  value={inputSize}
                  min={MIN_FONT_SIZE}
                  max={MAX_FONT_SIZE}
                  onChange={this.onSizeInputChange}
                  onBlur={this.onSizeInputBlur}
                />

                <div className="slider-container">
                  <XSlider
                    value={fontSize}
                    min={MIN_FONT_SIZE}
                    max={MAX_FONT_SIZE}
                    step={1}
                    handleSliderChange={this.onSliderChange}
                    vertical
                  />
                </div>
              </div>
            </div>

            <XColorPicker
              needResetColor={needResetColor}
              initHexString={fontColor}
              onColorChange={this.onFontColorChange}
            />

            <div className="divider" />
            <div className="align-container">
              <div className="horizonal-group">
                {alignOptionList.map((alignOption, index) => {
                  const alignClass = `align-${alignOption.value}`;
                  const alignOptionStyle = classNames('icon', alignClass, {
                    selected: alignOption.value === align
                  });
                  return (
                    <button
                      key={index}
                      type="button"
                      className={alignOptionStyle}
                      title={alignOption.title}
                      onClick={this.onAlignChange.bind(this, alignOption.value)}
                    />
                  );
                })}
              </div>
              <div className="divider" />
              <div className="vertical-group">
                {verticalAlignOptionList.map((verticalAlignOption, index) => {
                  const alignClass = `align-${verticalAlignOption.value}`;
                  const alignOptionStyle = classNames('icon', alignClass, {
                    selected: verticalAlignOption.value === verticalAlign
                  });
                  return (
                    <button
                      key={index}
                      type="button"
                      className={alignOptionStyle}
                      title={verticalAlignOption.title}
                      onClick={this.onVerticalAlignChange.bind(
                        this,
                        verticalAlignOption.value
                      )}
                    />
                  );
                })}
              </div>
            </div>
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
              {isShowTextNotFit ? <span>Text does not fit</span> : null}
              {isShowIllegalCharTip
                ? <span>Invalid characters removed</span>
                : null}
            </p>
          </div>

          <p className="button-container">
            <XButton
              onClicked={this.onSubmit}
              disabled={false && (!inputText || !inputText.length)}
            >
              Done
            </XButton>
          </p>

          <TextPreviewBox
            imageSrc={previewTextImageBlobSrc}
            backgroundColor={backgroundColor}
          />
        </div>
      </XModal>
    );
  }
}

TextEditModal.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  fontList: PropTypes.array.isRequired,
  isShown: PropTypes.bool.isRequired,
  closeTextEditModal: PropTypes.func.isRequired,
  updateElement: PropTypes.func.isRequired,
  element: PropTypes.instanceOf(Immutable.Map),
  currentPage: PropTypes.instanceOf(Immutable.Map),
  ratio: PropTypes.number.isRequired,
  requestInterval: PropTypes.number,
  hideTipInterval: PropTypes.number
};

TextEditModal.defaultProps = {
  requestInterval: 1000,
  hideTipInterval: 2000
};

export default TextEditModal;
