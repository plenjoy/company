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
    document.addEventListener('mouseup', this.onSelectStop);
  }

  onSelectStart(e) {
    const { containerOffsetTop, containerOffsetLeft, actions } = this.props;
    if (e.pageX < containerOffsetLeft || e.pageY < containerOffsetTop) return;

    this.isSelecting = true;
    this.setState({
      selectionBox: {
        p1: {
          x: e.pageX - containerOffsetLeft,
          y: e.pageY - containerOffsetTop
        }
      }
    });

    actions.onSelectStart();
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

  onSelectStop(e) {
    const { selectionBox } = this.state;
    if (this.isSelecting) {
      this.isSelecting = false;

      const { actions } = this.props;
      actions.onSelectStop(selectionBox, e);

      this.setState({
        selectionBox: null,
        selectionBoxStyle: null
      });
    }

    if (selectionBox && selectionBox.p1 && selectionBox.p2) {
      e.stopPropagation();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.onSelectStart);
    window.removeEventListener('mousemove', this.onSelect);
    document.removeEventListener('mouseup', this.onSelectStop);
  }

  render() {
    const { selectionBoxStyle } = this.state;
    return <div className="selection" style={selectionBoxStyle} />;
  }
}

Selection.propTypes = {
  actions: PropTypes.shape({
    onSelect: PropTypes.func.isRequired,
    onSelectStop: PropTypes.func.isRequired
  }).isRequired,
  containerOffsetTop: PropTypes.number.isRequired,
  containerOffsetLeft: PropTypes.number.isRequired
};

export default Selection;
