import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';

class TooltipContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowToolTip: false
    };

    this.showToolTip = this.showToolTip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  showToolTip() {
    this.setState({ isShowToolTip: true });
  }

  hideTooltip() {
    this.setState({ isShowToolTip: false });
  }

  render() {
    return (
      <div onMouseEnter={this.showToolTip} onMouseLeave={this.hideTooltip}>
        {this.props.children}

        <ReactTooltip
          class="hover-tooltip"
          effect="solid"
          place="bottom"
          disable={!this.state.isShowToolTip}
          delayShow={100}
        />
      </div>
    );
  }
}

TooltipContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default TooltipContainer;
