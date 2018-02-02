import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import { zIndex, elementTypes } from '../../constants/strings';

import './index.scss';
import emoji from '../../../../common/utils/emoji';

class FontCalculator extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { data, actions } = this.props;
    const { setIsCaptionOutOfSize } = actions;
    const { photo } = data;

    setTimeout(() => {
      const maxContainerHeight = this.DomMaxContainer.clientHeight;
      const minContainerHeight = this.DomMinContainer.clientHeight;
      const textHeight = this.DomText.clientHeight;

      const isCaptionOutOfMaxHeight = textHeight > maxContainerHeight;

      if(isCaptionOutOfMaxHeight) {
        let newCaption = photo.caption;

        while(this.DomText.clientHeight > maxContainerHeight) {
          newCaption = newCaption.substr(0, newCaption.length - 4);
          newCaption += '...';

          this.DomText.innerHTML = newCaption.replace(/\n/g, '<br />');

          if(this.DomText.clientHeight <= maxContainerHeight) {
            setIsCaptionOutOfSize(photo.id, textHeight > minContainerHeight, newCaption);
            break;
          }
        }
      } else {
        setIsCaptionOutOfSize(photo.id, textHeight > minContainerHeight, photo.caption);
      }
    }, 100);
  }

  render() {
    const { t, data, actions } = this.props;
    const { fontCalculator, photo } = data;

    const minFontCalculatorStyle = {
      width: fontCalculator.getIn(['settings', 'width']),
      height: fontCalculator.getIn(['settings', 'minHeight']),
      lineHeight: fontCalculator.getIn(['settings', 'lineHeight']),
      fontSize: fontCalculator.getIn(['settings', 'fontSize']),
      textAlign: 'left',
    };

    const maxFontCalculatorStyle = {
      width: fontCalculator.getIn(['settings', 'width']),
      height: fontCalculator.getIn(['settings', 'maxHeight']),
      lineHeight: fontCalculator.getIn(['settings', 'lineHeight']),
      fontSize: fontCalculator.getIn(['settings', 'fontSize']),
      textAlign: 'left',
    };

    let textHTML = emoji(photo.caption, { onlySpan: true });
    let divStyle = { padding: '0 17px' };

    return (
      <div className="font-calculator-max"
        style={maxFontCalculatorStyle}
        ref={event => this.DomMaxContainer = event}>
        <div className="font-calculator-min"
          style={minFontCalculatorStyle}
          ref={event => this.DomMinContainer = event}>
          <div style={divStyle} ref={event => this.DomText = event}>
            {textHTML}
          </div>
        </div>
      </div>
    );
  }
}

FontCalculator.propTypes = {};

export default translate('FontCalculator')(FontCalculator);
