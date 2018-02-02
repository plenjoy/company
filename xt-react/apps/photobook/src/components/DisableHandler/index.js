import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class Handler extends Component {
  constructor(props) {
    super(props);

    this.disable = (ev)=> {
      const event = ev || window.event;
      event.stopPropagation();
      event.preventDefault();
    };
  }

  render() {
    const { data, children } = this.props;
    const { className, style } = data;
    const customClass = classNames('disable-handler', className);

    return (
      <div
        style={style}
        className={customClass}
        onClick={this.disable}
        onDoubleClick={this.disable}
        onMouseDown={this.disable}
        onMouseOver={this.disable}
        onMouseOut={this.disable}
        onDrop={this.disable}
        onDragStart={this.disable}
        onDragOver={this.disable}
        onDragEnter={this.disable}
        onDragLeave={this.disable}
        onDragEnd={this.disable}
        draggable={this.disable}
        onContextMenu={this.disable}
      >
        {children}
      </div>
    );
  }
}

Handler.propTypes = {
  data: PropTypes.shape({
    className: PropTypes.string,
    style: PropTypes.Object
  })
};
