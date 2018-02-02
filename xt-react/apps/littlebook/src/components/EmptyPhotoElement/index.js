import React, { Component, PropTypes } from 'react';

class EmptyPhotoElement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { style } = this.props;
    return (
      <div className="empty-photo" style={style} />
    );
  }
}

export default EmptyPhotoElement;
