import React, { PropTypes, Component } from 'react';

import Element from '../Element';

import './index.scss';

class PhotoElement extends Component {
  render() {
    return (
      <Element {...this.props}>
        <div className="photo-element">
          <span className="placeholder">photo</span>
        </div>
      </Element>
    );
  }
}

PhotoElement.propTypes = {

};

export default PhotoElement;
