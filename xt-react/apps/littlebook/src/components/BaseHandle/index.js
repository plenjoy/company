import React, { Component, PropTypes } from 'react';
import * as handler from './handler.js';

import Resizable from '../Resizable';
import Rotatable from '../Rotatable';

import './index.scss';

const defaultParams = {
  resize: true,
  rotate: true
}

const propTypes = {
  data : PropTypes.shape({
    resize: PropTypes.object.bool,
    rotate: PropTypes.object.bool
  });
}

class BaseHandle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      resize = this.defaultParams.resize,
      rotate = this.defaultParams.rotate
    };
    return (
      <div className="base-handle">
        {
          resize ?
            <Resizable />
            : null
        }
        {
          rotate ?
            <Rotatable />
            : null
        }
      </div>
    );
  }
}

BaseHandle.proptype = propTypes;
BaseHandle.defaultParams = defaultParams;

export default BaseHandle;
