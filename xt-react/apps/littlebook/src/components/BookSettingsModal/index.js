import React, { Component, PropTypes } from 'react';
import { template } from 'lodash';
import { translate } from 'react-translate';
import { GET_FONT_THUMBNAIL } from '../../contants/apiUrl';
import {
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  MIN_BORDER_SIZE,
  MAX_BORDER_SIZE,
  MIN_BORDER_OPACITY,
  MAX_BORDER_OPACITY
} from '../../contants/strings';
import CheckBox from 'rc-checkbox';

import XSelect from '../../../../common/ZNOComponents/XSelect';
import XSlider from '../../../../common/ZNOComponents/XSlider';
import XModal from '../../../../common/ZNOComponents/XModal';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';
import XButton from '../../../../common/ZNOComponents/XButton';
import FontUrl from '../../components/FontUrl';

import './index.scss';

class BookSettingsModal extends Component {
  constructor(props) {
    super(props);

    const { fontList, bookSetting, baseUrl, t } = this.props;
    const avaiableFontList = fontList.filter(font => !font.deprecated);

    const fontOptionList = avaiableFontList.map((font) => {
      return {
        title: font.displayName,
        label: font.displayName,
        value: font.id,
        fontThumbnailUrl: template(GET_FONT_THUMBNAIL)({
          baseUrl,
          fontName: font.name
        })
      };
    });


    const layoutOptionList = [
      {
        value: true,
        label: t('TOGGLE_ON')
      },
      {
        value: false,
        label: t('TOGGLE_OFF')
      }
    ];

    const fontSetting = bookSetting.get('font');
    const borderSetting = bookSetting.get('border');

    this.state = {
      // border
      defaultBorderColor: borderSetting.get('color'),
      defaultBorderSize: borderSetting.get('size'),
      defaultBorderOpacity: borderSetting.get('opacity'),
      inputBorderSize: borderSetting.get('size'),
      inputBorderOpacity: borderSetting.get('opacity'),

      // 开关.
      isApplyBorderFrame: bookSetting.get('applyBorderFrame'),
      isApplyBackground: bookSetting.get('applyBackground'),
      isApplyFont: bookSetting.get('applyFont'),

      defaultBgColor: bookSetting.getIn(['background', 'color']),
      defaultFontSize: fontSetting.get('fontSize'),
      defaultFontColor: fontSetting.get('color'),
      defaultFontName: fontSetting.get('fontFamilyId'),
      defaultFontWeight: fontSetting.get('fontId'),
      defaultLayout: bookSetting.get('autoLayout'),
      inputSize: fontSetting.get('fontSize'),
      fontOptionList,
      layoutOptionList
    };

    this.onSliderChange = this.onSliderChange.bind(this);
    this.onSizeInputChange = this.onSizeInputChange.bind(this);
    this.onSizeInputBlur = this.onSizeInputBlur.bind(this);

    this.onFontNameChange = this.onFontNameChange.bind(this);
    this.onFontWeightChange = this.onFontWeightChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);

    this.onBgColorChange = this.onBgColorChange.bind(this);
    this.onFontColorChange = this.onFontColorChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    // border frame
    this.onSliderBorderSizeChange = this.onSliderBorderSizeChange.bind(this);
    this.onSliderBorderOpacityChange = this.onSliderBorderOpacityChange.bind(this);
    this.onBorderFrameColorChange = this.onBorderFrameColorChange.bind(this);
    this.onBorderSizeInputChange = this.onBorderSizeInputChange.bind(this);
    this.onBorderSizeInputBlur = this.onBorderSizeInputBlur.bind(this);
    this.onBorderOpacityInputChange = this.onBorderOpacityInputChange.bind(this);
    this.onBorderOpacityInputBlur = this.onBorderOpacityInputBlur.bind(this);

    // checkbox.
    this.onChangeBackgroundCheckbox = this.onChangeBackgroundCheckbox.bind(this);
    this.onChangeFontCheckbox = this.onChangeFontCheckbox.bind(this);
    this.onChangeBorderFrameCheckbox = this.onChangeBorderFrameCheckbox.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldIsShown = this.props.isShown;
    const newIsShown = nextProps.isShown;

    if (oldIsShown !== newIsShown && newIsShown) {
      const bookSetting = nextProps.bookSetting;
      const fontSetting = bookSetting.get('font');
      const borderSetting = bookSetting.get('border');

      const { fontList, baseUrl } = this.props;

      const selectedFont = fontList.find((font) => {
        return font.id === fontSetting.get('fontFamilyId');
      });

      if (selectedFont.deprecated) {
        const fontOptionList = fontList.map((font) => {
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

        this.setState({
          fontOptionList
        });
      }

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
        // border
        defaultBorderColor: borderSetting.get('color'),
        defaultBorderSize: borderSetting.get('size'),
        defaultBorderOpacity: borderSetting.get('opacity'),
        inputBorderSize: borderSetting.get('size'),
        inputBorderOpacity: borderSetting.get('opacity'),

        // 开关.
        isApplyBorderFrame: bookSetting.get('applyBorderFrame'),
        isApplyBackground: bookSetting.get('applyBackground'),
        isApplyFont: bookSetting.get('applyFont'),

        defaultBgColor: bookSetting.getIn(['background', 'color']),
        defaultFontSize: fontSetting.get('fontSize'),
        defaultFontColor: fontSetting.get('color'),
        defaultFontName: fontSetting.get('fontFamilyId'),
        defaultFontWeight: fontSetting.get('fontId'),
        defaultLayout: bookSetting.get('autoLayout'),
        inputSize: fontSetting.get('fontSize'),
        fontWeightOptionList
      });
    }
  }

  onSliderChange(fontSize) {
    this.setState({
      defaultFontSize: fontSize,
      inputSize: fontSize
    });
  }

  onSliderBorderSizeChange(borderSize) {
    this.setState({
      defaultBorderSize: borderSize,
      inputBorderSize: borderSize
    });
  }

  onSliderBorderOpacityChange(opacity) {
    this.setState({
      defaultBorderOpacity: opacity,
      inputBorderOpacity: opacity
    });
  }

  onSizeInputChange(e) {
    const inputValue = e.target.value.trim();

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
      defaultFontSize: fontSize
    });
  }

  onBorderSizeInputChange(e) {
    const inputValue = e.target.value.trim();

    this.setState({
      inputBorderSize: inputValue
    });
  }

  onBorderSizeInputBlur(e) {
    const inputValue = +e.target.value;

    let borderSize = inputValue;
    if (inputValue > MAX_BORDER_SIZE) {
      borderSize = MAX_BORDER_SIZE;
    } else if (inputValue < MIN_BORDER_SIZE) {
      borderSize = MIN_BORDER_SIZE;
    }

    this.setState({
      inputBorderSize: borderSize,
      defaultBorderSize: borderSize
    });
  }

  onBorderOpacityInputChange(e) {
    const inputValue = e.target.value.trim();

    this.setState({
      inputBorderOpacity: inputValue
    });
  }

  onBorderOpacityInputBlur(e) {
    const inputValue = +e.target.value;

    let opacity = inputValue;
    if (inputValue > MAX_BORDER_OPACITY) {
      opacity = MAX_BORDER_OPACITY;
    } else if (inputValue < MIN_BORDER_OPACITY) {
      opacity = MIN_BORDER_OPACITY;
    }

    this.setState({
      inputBorderOpacity: opacity,
      defaultBorderOpacity: opacity
    });
  }

  onFontNameChange(selectedOption) {
    const { fontList } = this.props;
    const selectedFont = fontList.filter((font) => {
      return font.id === selectedOption.value;
    })[0];

    const fontWeightOptionList = selectedFont.font.map((o) => {
      const displayName = o.displayName.replace(/\s*\d+/, '');
      return {
        title: displayName,
        label: displayName,
        value: o.id
      };
    });

    this.setState({
      defaultFontName: selectedOption.value,
      defaultFontWeight: selectedFont.font[0].id,
      fontWeightOptionList
    });
  }

  onFontWeightChange(selectedOption) {
    this.setState({
      defaultFontWeight: selectedOption.value
    });
  }

  onLayoutChange(selectedOption) {
    this.setState({
      defaultLayout: selectedOption.value
    });
  }

  onBgColorChange(color) {
    this.setState({
      defaultBgColor: color.hex
    });
  }

  onFontColorChange(color) {
    this.setState({
      defaultFontColor: color.hex
    });
  }

  onBorderFrameColorChange(color) {
    this.setState({
      defaultBorderColor: color.hex
    });
  }

  onSubmit() {
    const {
      changeBookSetting,
      closeBookSettingsModal,
      addNotification,
      fontList,
      t
    } = this.props;
    const {
      defaultBgColor,
      defaultFontName,
      defaultFontWeight,
      defaultFontSize,
      defaultFontColor,
      defaultLayout,

      // border
      defaultBorderColor,
      defaultBorderSize,
      defaultBorderOpacity,

      // 开关.
      isApplyBorderFrame,
      isApplyBackground,
      isApplyFont
    } = this.state;

    changeBookSetting({
      autoLayout: defaultLayout,

      // 开关
      applyBorderFrame: isApplyBorderFrame,
      applyBackground: isApplyBackground,
      applyFont: isApplyFont,

      background: {
        color: defaultBgColor
      },
      font: {
        color: defaultFontColor,
        fontSize: defaultFontSize,
        fontFamilyId: defaultFontName,
        fontId: defaultFontWeight
      },

      // border
      border: {
        color: defaultBorderColor,
        size: defaultBorderSize,
        opacity: defaultBorderOpacity
      }
    }, fontList);

    addNotification({
      message: t('SAVE_SETTING_SUCCESS'),
      level: 'success',
      autoDismiss: 2
    });

    closeBookSettingsModal();
  }

  onChangeBackgroundCheckbox(event) {
    this.setState({
      isApplyBackground: event.target.checked
    });
  }

  onChangeFontCheckbox(event) {
    this.setState({
      isApplyFont: event.target.checked
    });
  }

  onChangeBorderFrameCheckbox(event) {
    this.setState({
      isApplyBorderFrame: event.target.checked
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.isShown !== nextProps.isShown ||
      this.state.defaultBgColor !== nextState.defaultBgColor ||
      this.state.defaultFontName !== nextState.defaultFontName ||
      this.state.defaultFontWeight !== nextState.defaultFontWeight ||
      this.state.defaultFontSize !== nextState.defaultFontSize ||
      this.state.defaultFontColor !== nextState.defaultFontColor ||
      this.state.defaultLayout !== nextState.defaultLayout ||
      this.state.inputSize !== nextState.inputSize ||
      this.state.defaultBorderColor !== nextState.defaultBorderColor ||
      this.state.defaultBorderSize !== nextState.defaultBorderSize ||
      this.state.defaultBorderOpacity !== nextState.defaultBorderOpacity ||
      this.state.isApplyBorderFrame !== nextState.isApplyBorderFrame ||
      this.state.isApplyBackground !== nextState.isApplyBackground ||
      this.state.isApplyFont !== nextState.isApplyFont ||
      this.state.inputBorderSize !== nextState.inputBorderSize ||
      this.state.inputBorderOpacity !== nextState.inputBorderOpacity) {
      return true;
    }

    return false;
  }

  render() {
    const { closeBookSettingsModal, isShown, t } = this.props;

    const needResetColor = isShown;

    const {
      defaultBorderColor,
      defaultBorderSize,
      defaultBorderOpacity,
      inputBorderSize,
      inputBorderOpacity,

      // 开关.
      isApplyBorderFrame,
      isApplyBackground,
      isApplyFont,

      defaultBgColor,
      defaultFontColor,
      defaultFontName,
      defaultFontWeight,
      defaultFontSize,
      defaultLayout,

      inputSize,
      fontOptionList,
      fontWeightOptionList,
      layoutOptionList
    } = this.state;

    return (
      <XModal
        className="book-setting-modal"
        onClosed={closeBookSettingsModal}
        opened={isShown}
      >
        <h2 className="modal-title">{t('BOOK_SETTING')}</h2>

        {/* default background */}
        <div className="setting-panel">
          <h4 className="panel-title clearfix">
            <span>{t('DEFAULT_BACKGROUND')}</span>
            <label className="check-box-btn clearfix">
              <CheckBox
                className="check-box"
                checked={isApplyBackground}
                onChange={this.onChangeBackgroundCheckbox}
              />
              <span className="tip">{t('APPLY_TO_EXISTING')}</span>
            </label>
          </h4>
          <div className="setting-box">
            <div className="setting-item">
              <span>{t('COLOR')}:</span>
              <XColorPicker
                needResetColor={needResetColor}
                initHexString={defaultBgColor}
                onColorChange={this.onBgColorChange}
              />
            </div>
          </div>
        </div>

        {/* default font */}
        <div className="setting-panel">
          <h4 className="panel-title">
            <span>{t('DEFAULT_FONT')}</span>

            <label className="check-box-btn clearfix">
              <CheckBox
                className="check-box"
                checked={isApplyFont}
                onChange={this.onChangeFontCheckbox}
              />
              <span className="tip">{t('APPLY_TO_EXISTING')}</span>
            </label>
          </h4>
          <div className="setting-box">
            <div className="setting-item">
              <span>{t('FONT')}:</span>
              <div className="select-container">
                <XSelect
                  className="font"
                  options={fontOptionList}
                  searchable={false}
                  onChanged={this.onFontNameChange}
                  value={defaultFontName}
                  optionComponent={FontUrl}
                />
              </div>
              <div className="select-container">
                <XSelect
                  className="font-weight"
                  options={fontWeightOptionList}
                  searchable={false}
                  onChanged={this.onFontWeightChange}
                  value={defaultFontWeight}
                />
              </div>

            </div>
            <div className="setting-item">
              <span>{t('SIZE')}:</span>
              <div className="slider-container">
                <XSlider
                  value={defaultFontSize}
                  min={MIN_FONT_SIZE}
                  max={MAX_FONT_SIZE}
                  step={1}
                  handleSliderChange={this.onSliderChange}
                />
              </div>
              <input
                type="number"
                className="size-input"
                value={inputSize}
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                onChange={this.onSizeInputChange}
                onBlur={this.onSizeInputBlur}
              />
            </div>
            <div className="setting-item">
              <span>{t('COLOR')}:</span>
              <XColorPicker
                needResetColor={needResetColor}
                initHexString={defaultFontColor}
                onColorChange={this.onFontColorChange}
              />
            </div>
          </div>
        </div>

        {/* default border */}
        <div className="setting-panel">
          <h4 className="panel-title">
            <span>{t('DEFAULT_BORDER')}</span>

            <label className="check-box-btn clearfix">
              <CheckBox
                className="check-box"
                checked={isApplyBorderFrame}
                onChange={this.onChangeBorderFrameCheckbox}
              />
              <span className="tip">{t('APPLY_TO_EXISTING')}</span>
            </label>
          </h4>
          <div className="setting-box">
            <div className="setting-item">
              <span>{t('COLOR')}:</span>
              <XColorPicker
                needResetColor={needResetColor}
                initHexString={defaultBorderColor}
                onColorChange={this.onBorderFrameColorChange}
              />
            </div>

            <div className="setting-item">
              <span>{t('SIZE')}:</span>
              <div className="slider-container">
                <XSlider
                  value={defaultBorderSize}
                  min={MIN_BORDER_SIZE}
                  max={MAX_BORDER_SIZE}
                  step={1}
                  handleSliderChange={this.onSliderBorderSizeChange}
                />
              </div>
              <input
                type="number"
                className="size-input"
                value={inputBorderSize}
                min={MIN_BORDER_SIZE}
                max={MAX_BORDER_SIZE}
                onChange={this.onBorderSizeInputChange}
                onBlur={this.onBorderSizeInputBlur}
              />
            </div>

            <div className="setting-item">
              <span className="opacity">{t('OPACITY')}:</span>
              <div className="slider-container">
                <XSlider
                  value={defaultBorderOpacity}
                  min={MIN_BORDER_OPACITY}
                  max={MAX_BORDER_OPACITY}
                  step={1}
                  handleSliderChange={this.onSliderBorderOpacityChange}
                />
              </div>
              <input
                type="number"
                className="size-input"
                value={inputBorderOpacity}
                min={MIN_BORDER_OPACITY}
                max={MAX_BORDER_OPACITY}
                onChange={this.onBorderOpacityInputChange}
                onBlur={this.onBorderOpacityInputBlur}
              />
            </div>
          </div>
        </div>

        {/* default layout */}
        <div className="setting-panel">
          <h4 className="panel-title">{t('DEFAULT_LAYOUT')}</h4>
          <div className="setting-box">
            <div className="setting-item">
              <span>{t('AUTO_LAYOUT')}:</span>
              <div className="select-container">
                <XSelect
                  className="layout"
                  options={layoutOptionList}
                  searchable={false}
                  onChanged={this.onLayoutChange}
                  value={defaultLayout}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="button-container">
          <XButton
            width={160}
            className="white"
            onClicked={closeBookSettingsModal}
          >{t('CANCEL')}</XButton>
          <XButton
            width={160}
            onClicked={this.onSubmit}
          >{t('DONE')}</XButton>
        </p>
      </XModal>
    );
  }
}

BookSettingsModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  fontList: PropTypes.array.isRequired,
  bookSetting: PropTypes.object.isRequired,
  closeBookSettingsModal: PropTypes.func.isRequired,
  changeBookSetting: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired,
  addNotification: PropTypes.func.isRequired
};

export default translate('BookSettingsModal')(BookSettingsModal);
