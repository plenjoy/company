import classNames from 'classnames';
import React, { Component } from 'react';

import './index.scss';

class LayoutItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, actions } = this.props;
    const { template } = data;
    const { applyTemplate, onLayoutDragStarted } = actions;
    const src = template.get('imageUrl');
    const guid = template.get('guid');
    const layoutClass = classNames('layout-item', {
      'selected': template.get('isSelected')
    });
    return (
      <div className={layoutClass}>
        {
          src ? (
            <img className="layout-img" src={src} ref={itemNode => this.itemNode = itemNode} onClick={applyTemplate.bind(this, guid)} onDragStart={onLayoutDragStarted.bind(this, guid)} />
          ) : null
        }
      </div>
    );
  }
}

export default LayoutItem;
