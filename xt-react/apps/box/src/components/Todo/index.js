import React, { Component, PropTypes } from 'react';
import './index.scss';

export default class Todo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className="todo"
        onClick={this.props.onClick}
        style={{
          textDecoration: this.props.completed ? 'line-through' : 'none',
          cursor: this.props.completed ? 'default' : 'pointer'
        }}>
        {this.props.text}
      </li>
    )
  }
}

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired
};
