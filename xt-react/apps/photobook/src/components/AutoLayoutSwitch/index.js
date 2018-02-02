import React, { Component, PropTypes } from 'react';
import ToolTip from 'react-portal-tooltip';

import XToggleSwitch from '../../../../common/ZNOComponents/XToggleSwitch';

import './index.scss';

class AutoLayoutSwitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowToolTip: false
    };

    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  showTooltip() {
    this.setState({ isShowToolTip: true });
  }
  hideTooltip() {
    this.setState({ isShowToolTip: false });
  }

  render() {
    const { canAutoLayout, onSwitchChange } = this.props;

    const toolTipStyle = {
      style: {
        fontSize: 12,
        color: '#3a3a3a',
        backgroundColor: '#fff',
        padding: '6px 10px',
        borderRadius: 0,
        whiteSpace: 'nowrap',
        zIndex: 99999,
        lineHeight: '20px'
      },
      arrowStyle: {
        color: '#fff',
        borderColor: false
      }
    };

    return (
      <div className="auto-layout-switch clearfix">
        <span className="text left">Auto Layout</span>
        <XToggleSwitch
          checked={canAutoLayout}
          onChange={onSwitchChange}
          className="left"
        />
        <i
          id="tipIcon"
          className="icon auto-layout-tip left"
          tabIndex="-1"
          onClick={this.showTooltip}
          onBlur={this.hideTooltip}
        />

        <ToolTip
          active={this.state.isShowToolTip}
          position="top"
          arrow="right"
          parent="#tipIcon"
          style={toolTipStyle}
          tooltipTimeout={0}
        >
          Auto Layout will automatically select the correct layout <br /> for
          your photos as you drop them onto the page.
        </ToolTip>
      </div>
    );
  }
}

AutoLayoutSwitch.propTypes = {
  canAutoLayout: PropTypes.bool.isRequired,
  onSwitchChange: PropTypes.func.isRequired
};

export default AutoLayoutSwitch;
