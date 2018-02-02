import React, { Component, PropTypes } from 'react';
import './index.scss';

export default class AddTodo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <input type='text' ref='input'/>
        <button onClick={(e) => this.handleClick(e)}>
          Addfff333444
        </button>
      </div>

    )
  }

  handleClick(e) {
    const node = this.refs.input;
    const text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  }
}

AddTodo.propTypes = {
  onAddClick: PropTypes.func.isRequired
};
