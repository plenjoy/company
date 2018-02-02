import { translate } from 'react-translate';
import React, { Component } from 'react';
import classNames from 'classnames';
import * as handler from './handler';

import './index.scss';

class LayoutList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      templateList: []
    };

    this.receiveProps = (nextProps) => handler.receiveProps(this, nextProps);
    this.didMount = () => handler.didMount(this);
    this.getTemplateHTML = () => handler.getTemplateHTML(this);
    this.onLayoutDragStarted = (guid, event) => handler.onLayoutDragStarted(this, guid, event);

  }

  componentWillReceiveProps(nextProps) {
    this.receiveProps(nextProps);
  }

  componentDidMount() {
    this.didMount();
  }

  render() {
    const className = classNames('layout-list', {})

    return (
      <div className={className}>
        { this.getTemplateHTML() }
      </div>
    );
  }
}

export default translate('LayoutList')(LayoutList);
