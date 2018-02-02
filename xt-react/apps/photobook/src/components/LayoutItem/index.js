import Immutable from 'immutable';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import './index.scss';

class LayoutItem extends Component {
  constructor(props) {
    super(props);

    this.deleteLayout = this.deleteLayout.bind(this);
    this.onClicked = this.onClicked.bind(this);

    this.state = {
      delectIconShow: true
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.data, nextProps.data) || nextState.delectIconShow !== this.state.delectIconShow;
  }

  componentDidMount() {
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

  deleteLayout() {
    const { deleteTemplate, onSelectFilter } = this.props.actions;
    const { data } = this.props;
    const userInfo = data.get('userInfo');
    const templateId = data.getIn(['template', 'uidpk']);
    const userId = userInfo ? userInfo.get('id') : null;
    const currentFilterTag = data.get('currentFilterTag');

    this.setState({
      delectIconShow: !this.state.delectIconShow
    });

    if (userId) {
      deleteTemplate(templateId, userId).then(() => {
        // 返回 选择分页  currentFilterTag当前分页项
        onSelectFilter(currentFilterTag);
        this.setState({
          delectIconShow: !this.state.delectIconShow
        });
      });
    }
  }

  render() {
    const { data, actions } = this.props;
    const templateUrl = data.getIn(['template', 'templateUrl']);
    const customerId = data.getIn(['template', 'customerId']);
    const isSelected = data.get('isSelected');

    const iconClassName = classNames('icon-delete', {
      hide: !this.state.delectIconShow
    });

    return (
      <div className="layout-item">
        {
          customerId && !isSelected
          ? (
            <div className={iconClassName} onClick={this.deleteLayout} />
          )
          : null
        }

        {
          templateUrl ? (
            <img className="layout-img" src={templateUrl} ref={itemNode => this.itemNode = itemNode} onClick={this.onClicked} />
          ) : null
        }
      </div>
    );
  }
}

LayoutItem.proptype = {

};

export default LayoutItem;
