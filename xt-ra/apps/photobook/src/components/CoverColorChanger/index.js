import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

class CoverColorChanger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedColorIndex: this.props.initColorIndex || 0
    };

    this.selectColor = this.selectColor.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initColorIndex !== nextProps.initColorIndex) {
      this.setState({
        selectedColorIndex: nextProps.initColorIndex
      });
    }
  }

  selectColor(index) {
    this.setState({
      selectedColorIndex: index
    });

    const { onColorChange, colorOptionList } = this.props;
    onColorChange(colorOptionList[index]);
  }

  render() {
    const { colorOptionList, colorImgMap, coverColorChangerStyle } = this.props;
    const { selectedColorIndex } = this.state;

    const className = classNames('cover-color-changer', this.props.className);

    return colorOptionList && colorImgMap ? (
      <div className={className} style={coverColorChangerStyle}>
        {colorOptionList.map((colorOption, index) => {
          const theImgUrl = colorImgMap[colorOption.id];
          const colorControlClass = classNames('color-control', {
            selected: index === selectedColorIndex
          });

          const colorIconStyle = {
            background: `url(${theImgUrl}) center no-repeat`
          };

          return (
            <div
              className={colorControlClass}
              title={colorOption.name}
              onClick={this.selectColor.bind(this, index)}
            >
              <span className="color-icon" style={colorIconStyle} />
            </div>
          );
        })}
      </div>
    ) : null;
  }
}

CoverColorChanger.propTypes = {
  colorOptionList: PropTypes.array.isRequired,
  colorImgMap: PropTypes.object.isRequired,
  onColorChange: PropTypes.func.isRequired,
  initColorIndex: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default CoverColorChanger;
