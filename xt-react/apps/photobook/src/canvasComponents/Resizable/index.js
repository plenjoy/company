import React, { Component, PropTypes } from 'react';
import { Group, Circle } from 'react-konva';

class Resizable extends Component {
  constructor(props) {
    super(props);

    this.setCursor = this.setCursor.bind(this);
  }

  getNewCursorArray(degree) {
    const cursorStyleArray = [
      'ns-resize',
      'nesw-resize',
      'ew-resize',
      'nwse-resize',
      'ns-resize',
      'nesw-resize',
      'ew-resize',
      'nwse-resize'
    ];

    const ARR_LENGTH = 8;
    const STEP = 45;

    let startIndex = 0;

    if (degree) {
      startIndex = Math.floor(degree / STEP);
      if (degree % STEP > STEP / 2) {
        startIndex += 1;
      }
    }

    if (startIndex > 1) {
      const len = ARR_LENGTH - startIndex;
      return cursorStyleArray
        .slice(startIndex, startIndex + len)
        .concat(cursorStyleArray.slice(0, startIndex));
    }

    return cursorStyleArray;
  }

  setCursor(cursorStyle) {
    if (this.resizableNode) {
      this.resizableNode.getStage().content.style.cursor = cursorStyle;
    }
  }

  getCircleProps(dir) {
    const { actions, degree, x, y, width, height } = this.props;

    const defaultCircleProps = {
      ref: dir,
      stroke: '#4CC1FC',
      strokeWidth: 1,
      radius: 5,
      fill: '#fff',
      draggable: true,
      dragOnTop: false,
      onDragStart: actions.onResizeStart,
      onDragMove: (e) => {
        actions.onResize(e);
      },
      onDragEnd: actions.onResizeStop,
      onMouseLeave: (e) => {
        this.setCursor('default');
      },
      onMouseDown: (e) => {
        e.evt.stopPropagation();
      }
    };

    const cursorStyleArray = this.getNewCursorArray(degree);

    let circleProps = null;

    const rightX = x + width;
    const rightY = y + height;

    const middleX = x + width / 2;
    const middleY = y + height / 2;

    switch (dir) {
      case 'top': {
        circleProps = Object.assign({}, defaultCircleProps, {
          x: middleX,
          y,
          onMouseEnter: (e) => {
            this.setCursor(cursorStyleArray[0]);
            e.cancelBubble = true;
          }
        });
        break;
      }
      case 'topRight': {
        circleProps = Object.assign({}, defaultCircleProps, {
          x: rightX,
          y,
          onMouseEnter: (e) => {
            this.setCursor(cursorStyleArray[1]);
            e.cancelBubble = true;
          }
        });
        break;
      }
      case 'right': {
        circleProps = Object.assign({}, defaultCircleProps, {
          x: rightX,
          y: middleY,
          onMouseEnter: (e) => {
            this.setCursor(cursorStyleArray[2]);
            e.cancelBubble = true;
          }
        });
        break;
      }
      case 'bottomRight': {
        circleProps = Object.assign({}, defaultCircleProps, {
          ref: 'bottomRight',
          x: rightX,
          y: rightY,
          onMouseEnter: (e) => {
            this.setCursor(cursorStyleArray[3]);
            e.cancelBubble = true;
          }
        });
        break;
      }
      case 'bottom': {
        circleProps = Object.assign({}, defaultCircleProps, {
          x: middleX,
          y: rightY,
          onMouseEnter: (e) => {
            this.setCursor(cursorStyleArray[4]);
            e.cancelBubble = true;
          }
        });
        break;
      }
      case 'bottomLeft': {
        circleProps = Object.assign({}, defaultCircleProps, {
          ref: 'bottomLeft',
          x,
          y: rightY,
          onMouseEnter: (e) => {
            this.setCursor(cursorStyleArray[5]);
            e.cancelBubble = true;
          }
        });
        break;
      }
      case 'left': {
        circleProps = Object.assign({}, defaultCircleProps, {
          x,
          y: middleY,
          onMouseEnter: (e) => {
            this.setCursor(cursorStyleArray[6]);
            e.cancelBubble = true;
          }
        });
        break;
      }
      case 'topLeft': {
        circleProps = Object.assign({}, defaultCircleProps, {
          x,
          y,
          onMouseEnter: (e) => {
            this.setCursor(cursorStyleArray[7]);
            e.cancelBubble = true;
          }
        });
        break;
      }
      default:
    }

    return circleProps;
  }

  render() {
    const topLeftCircleProps = this.getCircleProps('topLeft');

    const topCircleProps = this.getCircleProps('top');

    const topRightCircleProps = this.getCircleProps('topRight');

    const rightCircleProps = this.getCircleProps('right');

    const bottomLeftCircleProps = this.getCircleProps('bottomLeft');

    const bottomCircleProps = this.getCircleProps('bottom');

    const bottomRightCircleProps = this.getCircleProps('bottomRight');

    const leftCircleProps = this.getCircleProps('left');

    const { keepRatio } = this.props;

    return (
      <Group ref={node => (this.resizableNode = node)}>
        <Circle {...topLeftCircleProps} />
        <Circle {...topRightCircleProps} />
        <Circle {...bottomRightCircleProps} />
        <Circle {...bottomLeftCircleProps} />

        {
          !keepRatio
          ? (
            <Group>
              <Circle {...topCircleProps} />
              <Circle {...rightCircleProps} />
              <Circle {...bottomCircleProps} />
              <Circle {...leftCircleProps} />
            </Group>
          )
          : null
        }
      </Group>
    );
  }
}

Resizable.propTypes = {
  actions: PropTypes.shape({
    onResize: PropTypes.func.isRequired,
    onResizeStart: PropTypes.func.isRequired,
    onResizeStop: PropTypes.func.isRequired
  }).isRequired,
  degree: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  keepRatio: PropTypes.bool.isRequired
};

export default Resizable;
