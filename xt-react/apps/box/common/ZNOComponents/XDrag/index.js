import React, { Component, PropTypes } from 'react';

export default class XDrag extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, onDragStarted, onDragEntered, onDragLeaved, onDragOvered, onDragEnded } = this.props;
    return (
      <div onDragStart={ onDragStarted }
           onDragEnter={onDragEntered}
           onDragLeave={onDragLeaved}
           onDragOver={onDragOvered}
           onDragEnd={onDragEnded}
           draggable="true">
        { children }
      </div>
    )
  }
}

XDrag.propTypes = {
  onDragStarted: PropTypes.func.isRequired,
  onDragEntered: PropTypes.func,
  onDragLeaved: PropTypes.func,
  onDragOvered: PropTypes.func,
  onDragEnded: PropTypes.func
}
