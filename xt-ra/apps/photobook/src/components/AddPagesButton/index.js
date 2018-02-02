import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { translate } from 'react-translate';
import { merge, get } from 'lodash';
import classNames from 'classnames';

// 导入处理函数
import * as events from './handler/events';

import './index.scss';

class AddPagesButton extends Component {
  constructor(props) {
    super(props);

    this.onAddPages = ev => events.onAddPages(this, ev);
  }

  render() {
    const { t, actions, data } = this.props;
    const { className, style } = data;
    const containerClassName = classNames('add-pages-button', className);

    return (
      <div className={containerClassName} style={style} onClick={this.onAddPages}>
        <span className="add-icon" />
        <span className="add-tip">{t('ADD_PAGES')}</span>
      </div>
    );
  }
}

AddPagesButton.propTypes = {
};

export default translate('AddPagesButton')(AddPagesButton);
