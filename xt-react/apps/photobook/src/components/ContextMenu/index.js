import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';

import * as handler from './handler.js';
import './index.scss';

class ContextMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, children } = this.props;
    const { isShow, offset } = data;
    const contextMenuClassName = classNames('context-menu', { 'active': isShow });
    const style = {
      top: offset.top + 'px',
      left: offset.left + 'px'
    };

    return (
      <div className={contextMenuClassName} style={style}>
        <ul className="menu-list">
          {children}
        </ul>
      </div>
    );
  }
}

ContextMenu.proptype = {

};

export default translate('ContextMenu')(ContextMenu);
