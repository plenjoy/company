import React, { Component } from 'react';
import classNames from 'classnames';
import { addEventListener, removeEventListener } from '../../utils/events';

import './index.scss';

class XUndoable extends Component {
  constructor(props) {
    super(props);

    this.onUndo = (event, isPressKey) => {
      const { undoEnabled, undo } = this.props;
      undoEnabled && undo && undo(isPressKey);
    };
    this.onRedo = (event, isPressKey) => {
      const { redoEnabled, redo } = this.props;
      redoEnabled && redo && redo(isPressKey);
    };

    this.onKeyDown = (event) => {
      const ev = event || window.event;
      const isPressKey = true;

      // 如果按下了ctrl键
      if (ev.ctrlKey || ev.metaKey) {
        switch (ev.keyCode) {
          // z
          case 90: {
            ev.preventDefault();
            this.onUndo(event, isPressKey);
            break;
          }
          // y
          case 89: {
            ev.preventDefault();
            this.onRedo(event, isPressKey);
            break;
          }
          default: {
            break;
          }
        }
      }
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  render() {
    const {
      className,
      style,
      undoEnabled,
      redoEnabled,
      isShowText = true
    } = this.props;

    const newClassName = classNames('x-undoable', className);
    const newStyle = style;

    // undo
    const undoClassName = classNames('item undo', {
      active: undoEnabled
    });

    // redo
    const redoClassName = classNames('item redo', {
      active: redoEnabled
    });

    return (
      <div className={newClassName} style={newStyle}>
        <span className={undoClassName} onClick={this.onUndo} title="Ctrl + Z">
          <i className="icon" />
          {isShowText ? <span className="text">Undo</span> : null}
        </span>

        <span className={redoClassName} onClick={this.onRedo} title="Ctrl + Y">
          <i className="icon" />
          {isShowText ? <span className="text">Redo</span> : null}
        </span>
      </div>
    );
  }
}

XUndoable.defaultProps = {
  undoEnabled: false,
  redoEnabled: false,
  undo: () => {},
  redo: () => {},
  className: '',
  style: null,
  isShowText: true
};

export default XUndoable;
