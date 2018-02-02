import React, { Component, PropTypes } from 'react';
import './index.scss';

export default class XImageUpload extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="x-image-upload">
        <input type="file" />
      </div>
    );
  }
}
