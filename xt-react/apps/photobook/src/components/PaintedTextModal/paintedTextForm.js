import React, { Component, PropTypes } from 'react';
import { forEach, template } from 'lodash';
import classNames from 'classnames';

import { GET_FONT_THUMBNAIL } from '../../contants/apiUrl';

import XSelect from '../../../../common/ZNOComponents/XSelect';
import XSlider from '../../../../common/ZNOComponents/XSlider';
import XColorPicker from '../../../../common/ZNOComponents/XColorPicker';
import FontUrl from '../../components/FontUrl';

import './paintedTextForm.scss';

const MIN_FONT_SIZE = 4;
const MAX_FONT_SIZE = 120;

class PaintedTextForm extends Component {
  constructor(props) {
    super(props);

    const { fontList, baseUrl } = this.props;

    const fontOptionList = fontList.map((font) => {
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

    const firstFont = fontList[0];
    const fontWeightOptionList = firstFont.font.map((o) => {
      const displayName = o.displayName.replace(/\s*\d+/, '');
      return {
        title: displayName,
        label: displayName,
        value: o.id
      };
    });

    const alignOptionList = [
      {
        value: 'left',
        label: 'Left'
      },
      {
        value: 'center',
        label: 'Center'
      },
      {
        value: 'right',
        label: 'Right'
      }
    ];

    this.state = {
      fontOptionList,
      fontWeightOptionList,
      alignOptionList
    };

    this.onTextAreaChange = this.onTextAreaChange.bind(this);

    this.onFontNameChange = this.onFontNameChange.bind(this);
    this.onFontWeightChange = this.onFontWeightChange.bind(this);
    this.onFontColorChange = this.onFontColorChange.bind(this);

    this.onSliderChange = this.onSliderChange.bind(this);
    this.onSizeInputChange = this.onSizeInputChange.bind(this);

    this.onAlignChange = this.onAlignChange.bind(this);

    this.saveUserInput = this.saveUserInput.bind(this);
  }

  componentWillMount() {
    const {
      fontOptionList,
      fontWeightOptionList,
      alignOptionList
    } = this.state;

    this.saveUserInput({
      fontName: fontOptionList[0].value,
      fontWeight: fontWeightOptionList[0].value,
      align: alignOptionList[0].value,
      fontSize: MIN_FONT_SIZE
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
      fontWeightOptionList
    });

    this.saveUserInput({
      fontName: selectedOption.value,
      fontWeight: selectedFont.font[0].id,
    });
  }

  onFontWeightChange(selectedOption) {
    this.saveUserInput({
      fontWeight: selectedOption.value
    });
  }


  onSliderChange(fontSize) {
    this.saveUserInput({
      fontSize
    });
  }

  onSizeInputChange(e) {
    const inputValue = +e.target.value.trim();

    if (inputValue) {
      let fontSize = inputValue;
      if (inputValue > MAX_FONT_SIZE) {
        fontSize = MAX_FONT_SIZE;
      }

      if (inputValue < MIN_FONT_SIZE) {
        fontSize = MIN_FONT_SIZE;
      }

      this.saveUserInput({
        fontSize
      });
    }
  }

  onFontColorChange(color) {
    this.saveUserInput({
      fontColor: color.hex
    });
  }

  onAlignChange(selectedOption) {
    this.saveUserInput({
      align: selectedOption.value
    });
  }

  onTextAreaChange(e) {
    const inputString = e.target.value.trim();
    this.saveUserInput({
      inputText: inputString
    });
  }

  saveUserInput(data) {
    const { formData } = this.props;

    forEach(data, (v, k) => {
      formData[k] = v;
    });

    this.forceUpdate();
  }


  render() {
    const {
      fontOptionList,
      fontWeightOptionList,
      alignOptionList
    } = this.state;
    const { formData, hasFontSize, hasAlign, isShown } = this.props;

    const {
      fontName,
      fontWeight,
      fontSize,
      align
    } = formData;

    const paintedTextFormStyle = classNames('painted-text-form', {
      show: isShown
    });

    return (
      <div className={paintedTextFormStyle}>
        <textarea
          className="text-box"
          placeholder="Type here..."
          onInput={this.onTextAreaChange}
        />

        <div className="option-container">
          <div className="option-item">
            <span>Font:</span>
            <div className="select-container">
              <XSelect
                className="font"
                options={fontOptionList}
                searchable={false}
                onChanged={this.onFontNameChange}
                value={fontName}
                optionComponent={FontUrl}
              />
            </div>
            <div className="select-container">
              <XSelect
                className="font-weight"
                options={fontWeightOptionList}
                searchable={false}
                onChanged={this.onFontWeightChange}
                value={fontWeight}
              />
            </div>
          </div>
          {
            hasFontSize
            ? (
              <div className="option-item">
                <span>Size:</span>
                <div className="slider-container">
                  <XSlider
                    value={fontSize}
                    min={MIN_FONT_SIZE}
                    max={MAX_FONT_SIZE}
                    step={1}
                    handleSliderChange={this.onSliderChange}
                  />
                </div>
                <input
                  type="text"
                  className="size-input"
                  value={fontSize}
                  onChange={this.onSizeInputChange}
                />
              </div>
            )
            : null
          }
          <div className="option-item">
            <div className="item-left">
              <span>Color:</span>
              <XColorPicker
                onColorChange={this.onFontColorChange}
              />
            </div>
            {
              hasAlign
              ? (
                <div className="item-right">
                  <span>Align:</span>
                  <div className="select-container">
                    <XSelect
                      className="font"
                      options={alignOptionList}
                      searchable={false}
                      onChanged={this.onAlignChange}
                      value={align}
                    />
                  </div>
                </div>
              )
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}

PaintedTextForm.propTypes = {
  isShown: PropTypes.bool.isRequired,
  fontList: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired,
  hasFontSize: PropTypes.bool,
  hasAlign: PropTypes.bool
};

PaintedTextForm.defaultProps = {
  hasFontSize: true,
  hasAlign: true
};

export default PaintedTextForm;
