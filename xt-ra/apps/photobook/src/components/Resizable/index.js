import React, { PropTypes, Component } from 'react';
import { DraggableCore } from 'react-draggable';

import './index.scss';

class Resizable extends Component {
  constructor(props) {
    super(props);

    this.onResize = this.onResize.bind(this);
    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);

    this.onResizeTopLeft = this.onResizeTopLeft.bind(this);
    this.onResizeTopRight = this.onResizeTopRight.bind(this);
    this.onResizeBottomLeft = this.onResizeBottomLeft.bind(this);
    this.onResizeBottomRight = this.onResizeBottomRight.bind(this);
    this.onResizeTop = this.onResizeTop.bind(this);
    this.onResizeRight = this.onResizeRight.bind(this);
    this.onResizeBottom = this.onResizeBottom.bind(this);
    this.onResizeLeft = this.onResizeLeft.bind(this);

    this.isResizing = false;

    this.startMousePosition = {};

    this.state = {
      cursorStyleArray: [
        'ns', 'nesw', 'ew', 'nwse', 'ns', 'nesw', 'ew', 'nwse'
      ],
      startIndex: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldRot = this.props.rot;
    const newRot = nextProps.rot;

    const STEP = 45;
    if (oldRot !== newRot) {
      let startIndex = Math.floor(newRot / STEP);
      if (newRot % STEP > (STEP / 2)) {
        startIndex += 1;
      }

      this.setState({
        startIndex
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldStartIndex = this.state.startIndex;
    const newStartIndex = nextState.startIndex;

    if (this.props.isShown !== nextProps.isShown ||
      oldStartIndex !== newStartIndex ||
      this.props.keepRatio !== nextProps.keepRatio) {
      return true;
    }

    return false;
  }


  onResizeStart(e) {
    this.isResizing = true;
    this.props.actions.onResizeStart(e);

    e.stopPropagation();
  }

  onResize(dir, e, draggableData) {
    if (!this.isResizing) return;

    this.props.actions.onResize(dir, e, draggableData);
    e.stopPropagation();
  }

  onResizeStop(e) {
    this.isResizing = false;
    this.props.actions.onResizeStop(e);
    e.stopPropagation();
  }

  onResizeTopLeft(e, draggableData) {
    this.onResize('topLeft', e, draggableData);
  }

  onResizeTopRight(e, draggableData) {
    this.onResize('topRight', e, draggableData);
  }

  onResizeBottomLeft(e, draggableData) {
    this.onResize('bottomLeft', e, draggableData);
  }

  onResizeBottomRight(e, draggableData) {
    this.onResize('bottomRight', e, draggableData);
  }

  onResizeTop(e, draggableData) {
    this.onResize('top', e, draggableData);
  }

  onResizeRight(e, draggableData) {
    this.onResize('right', e, draggableData);
  }

  onResizeBottom(e, draggableData) {
    this.onResize('bottom', e, draggableData);
  }

  onResizeLeft(e, draggableData) {
    this.onResize('left', e, draggableData);
  }

  render() {
    const { isShown, keepRatio } = this.props;
    const { cursorStyleArray, startIndex } = this.state;

    const length = cursorStyleArray.length;
    const maxIndex = length - 1;
    let topIndex = startIndex + 0;
    let topRightIndex = startIndex + 1;
    let rightIndex = startIndex + 2;
    let bottomRightIndex = startIndex + 3;
    let bottomIndex = startIndex + 4;
    let bottomLeftIndex = startIndex + 5;
    let leftIndex = startIndex + 6;
    let topLeftIndex = startIndex + 7;

    if (topIndex > maxIndex) {
      topIndex = Math.abs(topIndex - length);
    }

    if (topRightIndex > maxIndex) {
      topRightIndex = Math.abs(topRightIndex - length);
    }

    if (rightIndex > maxIndex) {
      rightIndex = Math.abs(rightIndex - length);
    }

    if (bottomRightIndex > maxIndex) {
      bottomRightIndex = Math.abs(bottomRightIndex - length);
    }

    if (bottomIndex > maxIndex) {
      bottomIndex = Math.abs(bottomIndex - length);
    }

    if (bottomLeftIndex > maxIndex) {
      bottomLeftIndex = Math.abs(bottomLeftIndex - length);
    }

    if (leftIndex > maxIndex) {
      leftIndex = Math.abs(leftIndex - length);
    }

    if (topLeftIndex > maxIndex) {
      topLeftIndex = Math.abs(topLeftIndex - length);
    }

    const topStyle = {
      cursor: `${cursorStyleArray[topIndex]}-resize`
    };

    const topRightStyle = {
      cursor: `${cursorStyleArray[topRightIndex]}-resize`
    };

    const rightStyle = {
      cursor: `${cursorStyleArray[rightIndex]}-resize`
    };

    const bottomRightStyle = {
      cursor: `${cursorStyleArray[bottomRightIndex]}-resize`
    };

    const bottomStyle = {
      cursor: `${cursorStyleArray[bottomIndex]}-resize`
    };

    const bottomLeftStyle = {
      cursor: `${cursorStyleArray[bottomLeftIndex]}-resize`
    };

    const leftStyle = {
      cursor: `${cursorStyleArray[leftIndex]}-resize`
    };

    const topLeftStyle = {
      cursor: `${cursorStyleArray[topLeftIndex]}-resize`
    };


    return (
      isShown
      ? (
        <div className="resizable">
          <DraggableCore
            onStart={this.onResizeStart}
            onDrag={this.onResizeTopLeft}
            onStop={this.onResizeStop}
          >
            <div className="handle top-left" style={topLeftStyle} />
          </DraggableCore>

          <DraggableCore
            onStart={this.onResizeStart}
            onDrag={this.onResizeTopRight}
            onStop={this.onResizeStop}
          >
            <div className="handle top-right" style={topRightStyle} />
          </DraggableCore>

          <DraggableCore
            onStart={this.onResizeStart}
            onDrag={this.onResizeBottomRight}
            onStop={this.onResizeStop}
          >
            <div className="handle bottom-right" style={bottomRightStyle} />
          </DraggableCore>

          <DraggableCore
            onStart={this.onResizeStart}
            onDrag={this.onResizeBottomLeft}
            onStop={this.onResizeStop}
          >
            <div className="handle bottom-left" style={bottomLeftStyle} />
          </DraggableCore>

          {
            !keepRatio
            ? (
              <div>
                <DraggableCore
                  onStart={this.onResizeStart}
                  onDrag={this.onResizeTop}
                  onStop={this.onResizeStop}
                >
                  <div className="handle top" style={topStyle} />
                </DraggableCore>

                <DraggableCore
                  onStart={this.onResizeStart}
                  onDrag={this.onResizeRight}
                  onStop={this.onResizeStop}
                >
                  <div className="handle right" style={rightStyle} />
                </DraggableCore>

                <DraggableCore
                  onStart={this.onResizeStart}
                  onDrag={this.onResizeBottom}
                  onStop={this.onResizeStop}
                >
                  <div className="handle bottom" style={bottomStyle} />
                </DraggableCore>

                <DraggableCore
                  onStart={this.onResizeStart}
                  onDrag={this.onResizeLeft}
                  onStop={this.onResizeStop}
                >
                  <div className="handle left" style={leftStyle} />
                </DraggableCore>
              </div>
            )
            : null
          }
        </div>
      )
      : null
    );
  }
}

Resizable.propTypes = {
  actions: PropTypes.shape({
    onResize: PropTypes.func.isRequired,
    onResizeStart: PropTypes.func.isRequired,
    onResizeStop: PropTypes.func.isRequired
  }).isRequired,
  isShown: PropTypes.bool.isRequired,
  keepRatio: PropTypes.bool.isRequired,
  rot: PropTypes.number.isRequired
};

export default Resizable;
