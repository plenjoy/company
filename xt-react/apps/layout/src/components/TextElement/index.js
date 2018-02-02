import React, { PropTypes, Component } from 'react';

import Element from '../Element';

import './index.scss';

class TextElement extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { imgUrl } = this.props;

    return (
      <Element {...this.props}>
        <div className="text-element">
          <img
            className="text-image"
            src={imgUrl}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          />
        </div>
      </Element>
    );
  }
}

TextElement.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    onDblClick: PropTypes.func
  }).isRequired
};

export default TextElement;
