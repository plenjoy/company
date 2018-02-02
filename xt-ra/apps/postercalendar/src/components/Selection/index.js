import React, { PropTypes, Component } from 'react';
import { merge } from 'lodash';

import './index.scss';

class Selection extends Component {
  constructor(props) {
    super(props);

    this.isSelecting = false;
    this.state = {
      selectionBox: null,
      selectionBoxStyle: null
    };

    this.onSelect = this.onSelect.bind(this);
    this.onSelectStart = this.onSelectStart.bind(this);
    this.onSelectStop = this.onSelectStop.bind(this);


    window.addEventListener('mousedown', this.onSelectStart);
    window.addEventListener('mousemove', this.onSelect);
    window.addEventListener('mouseup', this.onSelectStop);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.onSelectStart);
    window.removeEventListener('mousemove', this.onSelect);
    window.removeEventListener('mouseup', this.onSelectStop);
  }

  onSelectStart(e) {
    const {
      containerOffsetTop,
      containerOffsetLeft,
      containerOffsetWidth,
      containerOffsetHeight
    } = this.props;
    if (e.pageX < containerOffsetLeft ||
      e.pageY < containerOffsetTop ||
      e.pageX > (containerOffsetLeft + containerOffsetWidth) ||
      e.pageY > (containerOffsetTop + containerOffsetHeight)) return;

    this.isSelecting = true;
    this.setState({
      selectionBox: {
        p1: {
          x: e.pageX - containerOffsetLeft,
          y: e.pageY - containerOffsetTop
        }
      }
    });
  }

  onSelect(e) {
    if (!this.isSelecting) return;
    const { selectionBox } = this.state;
    const { containerOffsetTop, containerOffsetLeft, actions } = this.props;

    const p2 = {
      x: e.pageX - containerOffsetLeft,
      y: e.pageY - containerOffsetTop
    };

    const newSelectionBox = merge({}, selectionBox, { p2 });

    const { p1 } = selectionBox;
    let selectionBoxStyle = {};

    if (p2.x > p1.x) {
      selectionBoxStyle = merge(selectionBoxStyle, {
        left: p1.x,
        width: p2.x - p1.x
      });
    } else {
      selectionBoxStyle = merge(selectionBoxStyle, {
        left: p2.x,
        width: p1.x - p2.x
      });
    }

    if (p2.y > p1.y) {
      selectionBoxStyle = merge(selectionBoxStyle, {
        top: p1.y,
        height: p2.y - p1.y
      });
    } else {
      selectionBoxStyle = merge(selectionBoxStyle, {
        top: p2.y,
        height: p1.y - p2.y
      });
    }

    actions.onSelect(newSelectionBox);

    this.setState({
      selectionBox: newSelectionBox,
      selectionBoxStyle
    });
  }

  onSelectStop() {
    if (this.isSelecting) {
      this.isSelecting = false;

      const { selectionBox } = this.state;
      const { actions } = this.props;
      actions.onSelectStop(selectionBox);

      this.setState({
        selectionBox: null,
        selectionBoxStyle: null
      });
    }
  }

  render() {
    const { selectionBoxStyle } = this.state;
    return (
      <div className="selection" style={selectionBoxStyle} />
    );
  }
}

Selection.propTypes = {
  actions: PropTypes.shape({
    onSelect: PropTypes.func.isRequired,
    onSelectStop: PropTypes.func.isRequired
  }).isRequired,
  containerOffsetTop: PropTypes.number.isRequired,
  containerOffsetLeft: PropTypes.number.isRequired,
  containerOffsetWidth: PropTypes.number.isRequired,
  containerOffsetHeight: PropTypes.number.isRequired
};

export default Selection;
