import React, { Component, PropTypes } from 'react';
import { translate } from "react-translate";

import { onAddTodo, onDeleteTodo } from './todoHandler';
import { onRandom } from './randomHandler';
import { onRedo, onUndo } from './undoHandler';
import './index.scss';

class Undo extends Component {
  constructor(props) {
    super(props);

    // 用于测试.
    this.onDeleteTodo = (index) => onDeleteTodo(this, index);
    this.onAddTodo = (ref) => onAddTodo(this, ref);
    this.onRandom = (ref) => onRandom(this);

    // 撤销与还原
    this.onRedo = () => onRedo(this);
    this.onUndo = () => onUndo(this);
  }

  render() {
    const { t, data } = this.props;
    const { todos, randoms } = data;

    // 用于测试
    const todosHtml = todos.map((todo, i) => {
      return (<div key={i}>{todo.title} <input type="button" value="remove" onClick={this.onDeleteTodo.bind(this, i)}/>
      </div>);
    });

    const randomHtml = randoms.map((random, i) => {
      return (<div key={i}>{random.value}</div>);
    });

    return (
      <div>
        {/* 用于测试撤销与还原功能 */}
        <div>
          <input type="button" value="undo" onClick={this.onUndo}/>
          <input type="button" value="redo" onClick={this.onRedo}/>
        </div>
        <div>
          <input type="button" value="random" onClick={this.onRandom}/>
          {randomHtml}
        </div>
        <div>
          <input type="text" ref="textInput"/>
          <input type="button" value="add" onClick={this.onAddTodo.bind(this, 'textInput')}/>
          {todosHtml}
        </div>
      </div>
    );
  }
}

Undo.propTypes = {
  actions: PropTypes.shape({
    boundTodoActions: PropTypes.shape({
      addTodo: PropTypes.func.isRequired,
      removeTodo: PropTypes.func.isRequired
    }),
    boundRandomActions: PropTypes.shape({
      random: PropTypes.func.isRequired
    }),
    boundUndoActions: PropTypes.shape({
      redo: PropTypes.func.isRequired,
      undo: PropTypes.func.isRequired
    })
  }),
  data: PropTypes.shape({
    todos: PropTypes.arrayOf({
      title: PropTypes.string
    }),
    randoms: PropTypes.arrayOf({
      value: PropTypes.number
    })
  })
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('Undo')(Undo);
