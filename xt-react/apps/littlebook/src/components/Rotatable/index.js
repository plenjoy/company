import React, { PropTypes, Component } from 'react';
import { DraggableCore } from 'react-draggable';

import './index.scss';

class Rotatable extends Component {
  constructor(props) {
    super(props);

    this.onRotate = this.onRotate.bind(this);
    this.onRotateStart = this.onRotateStart.bind(this);
    this.onRotateStop = this.onRotateStop.bind(this);

    this.isRotating = false;
  }

  onRotateStart(e) {
    this.isRotating = true;
    this.props.actions.onRotateStart(e);

    e.stopPropagation();
  }

  onRotate(e, draggableData) {
    if (!this.isRotating) return;

    const { actions } = this.props;
    actions.onRotate(e, draggableData);

    e.stopPropagation();
  }

  onRotateStop(e) {
    this.isRotating = false;

    this.props.actions.onRotateStop(e);

    this.forceUpdate();
    e.stopPropagation();
  }

  render() {
    const { isShown, rot } = this.props;

    return (
      <div className="rotatable">
        {
          isShown
          ? (
            <DraggableCore
              onStart={this.onRotateStart}
              onDrag={this.onRotate}
              onStop={this.onRotateStop}
            >
              <div className="icon-rotate" />
            </DraggableCore>
          )
          : null
        }
        {
          this.isRotating
          ? <span className="degree-string">{rot}&deg;</span>
          : null
        }
      </div>
    );
  }
}

Rotatable.propTypes = {
  actions: PropTypes.shape({
    onRotate: PropTypes.func.isRequired,
    onRotateStart: PropTypes.func.isRequired,
    onRotateStop: PropTypes.func.isRequired
  }).isRequired,
  isShown: PropTypes.bool.isRequired,
  rot: PropTypes.number.isRequired
};

export default Rotatable;
