import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class XDrop extends Component {
  constructor(props) {
    super(props);
  }

  onDrapOvered(event) {
    const onDragOveredInProps = this.props.onDragOvered;
    event.stopPropagation();
    event.preventDefault();

    onDragOveredInProps && onDragOveredInProps();
    return false;
  }

  render() {
    const { children, onDroped, onDragEntered, onDragLeaved, onDragEnded, data = {} } = this.props;
    const { dropActiveClassName, isShowDropActive = false } = data;
    const daClassName = classNames('drop-active', dropActiveClassName);

    return (
      <div className="on-drop"
           onDrop={onDroped}
           onDragOver={this.onDrapOvered.bind(this)}
           onDragEnter={onDragEntered}
           onDragEnd={onDragEnded}
           onDragLeave={onDragLeaved} >
        {isShowDropActive ? <div className={daClassName} /> : null }

        {children}
      </div>
    );
  }
}

XDrop.propTypes = {
  onDroped: PropTypes.func.isRequired,
  onDragEntered: PropTypes.func,
  onDragLeaved: PropTypes.func,
  onDragEnded: PropTypes.func
}
