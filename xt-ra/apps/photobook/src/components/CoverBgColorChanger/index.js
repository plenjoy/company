import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import {
  coverBgColorAndFontColorArray,
  needChangeBgColorCover
} from '../../contants/strings';

import './index.scss';

class CoverBgColorChanger extends Component {
  selectColor(coverColorObj) {
    this.props.onBgColorChange(coverColorObj);
  }

  render() {
    const { cover, coverBgColorChangerStyle, selectedBgColor } = this.props;

    if (needChangeBgColorCover.indexOf(cover) === -1) return null;

    return (
      <div className="cover-bgcolor-changer" style={coverBgColorChangerStyle}>
        {coverBgColorAndFontColorArray.map((coverColorObj) => {
          const colorIconStyle = {
            backgroundColor: coverColorObj.bgColor
          };
          const colorControlClass = classNames('color-control', {
            selected:
              selectedBgColor &&
              coverColorObj.bgColor.toUpperCase() ===
                selectedBgColor.toUpperCase()
          });
          return (
            <div
              className={colorControlClass}
              onClick={this.selectColor.bind(this, coverColorObj)}
            >
              <span className="color-icon" style={colorIconStyle} />
            </div>
          );
        })}
      </div>
    );
  }
}

CoverBgColorChanger.propTypes = {
  cover: PropTypes.string.isRequired,
  coverBgColorChangerStyle: PropTypes.object.isRequired,
  onBgColorChange: PropTypes.func.isRequired,
  selectedBgColor: PropTypes.string.isRequired
};

export default CoverBgColorChanger;
