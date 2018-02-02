import React, { PropTypes, Component } from 'react';

import './index.scss';

class BleedContainer extends Component {

  render() {
    return (
      <div className="bleed-container" style={this.props.style} />
    );
  }
}

BleedContainer.propTypes = {
  style: PropTypes.shape({
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired
  }).isRequired
};

export default BleedContainer;
