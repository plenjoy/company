import Immutable from 'immutable';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import './index.scss';

class LayoutItem extends Component {
  constructor(props) {
    super(props);

    this.onClicked = this.onClicked.bind(this);

    this.state = {
      delectIconShow: true
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  componentDidMount() {
    const isSelected = this.props.data.get('isSelected');
    if (isSelected) {
      if (this.itemNode) {
        this.itemNode.scrollIntoView();
      }
    }
  }

  componentDidUpdate() {
    const isSelected = this.props.data.get('isSelected');
    if (isSelected) {
      if (this.itemNode) {
        this.itemNode.scrollIntoView();
      }
    }
  }

  onClicked() {
    const { data, actions } = this.props;
    const { applyTemplate } = actions;
    const guid = data.getIn(['template', 'guid']);
    const isSelected = data.get('isSelected');

    // 已经选中的layout, 不需要再次选中.
    if (!isSelected && applyTemplate) {
      applyTemplate(guid);
    }
  }

  render() {
    const { data, actions } = this.props;
    const templateUrl = data.getIn(['template', 'templateUrl']);

    return (
      <div className="layout-item">
        {
          templateUrl ? (
            <img className="layout-img" src={templateUrl} ref={itemNode => this.itemNode = itemNode} onClick={this.onClicked} />
          ) : null
        }
      </div>
    );
  }
}

export default LayoutItem;
