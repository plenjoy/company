import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import './index.scss';

class Element extends Component {
  constructor(props) {
    super(props);

    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseUp(e) {
    const { id, actions } = this.props;
    actions.onMouseUp(id, e);
  }

  render() {
    const {
      className,
      position,
      width,
      height,
      dep,
      rot,
      isDisabled,
      isSelected,
      children
    } = this.props;

    const elementStyle = Object.assign(
      {},
      {
        width,
        height,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rot}deg)`,
        zIndex: dep
      }
    );

    const elementClass = classNames('element', className, {
      selected: isSelected
    });

    return (
      <div
        className={elementClass}
        style={elementStyle}
        onMouseUp={this.onMouseUp}
      >
        {isDisabled
          ? <span className="lock-icon glyphicon glyphicon-lock" />
          : null}

        {children}

        <div className="element-border" />
      </div>
    );
  }
}

Element.propTypes = {
  id: PropTypes.string.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    onMouseUp: PropTypes.func.isRequired
  }).isRequired,
  dep: PropTypes.number.isRequired,
  rot: PropTypes.number.isRequired,
  keepRatio: PropTypes.bool.isRequired,
  bounds: PropTypes.shape({
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired
  }),
  isDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  className: PropTypes.string
};

export default Element;
