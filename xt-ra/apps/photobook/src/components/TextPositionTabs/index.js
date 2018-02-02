import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';

class TextPositionTabs extends Component {
  constructor(props) {
    super(props);

    const { initTabIndex } = this.props;

    this.state = {
      currentTabIndex: initTabIndex || 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldInitTabIndex = this.props.initTabIndex;
    const newInitTabIndex = nextProps.initTabIndex;

    if (oldInitTabIndex !== newInitTabIndex) {
      this.setState({
        currentTabIndex: newInitTabIndex
      });

      const { onTabChange } = this.props;
      onTabChange(newInitTabIndex);
    }
  }

  handleClick(index) {
    this.setState({
      currentTabIndex: index
    });

    const { onTabChange } = this.props;
    onTabChange(index);
  }

  render() {
    const { tabList } = this.props;
    const { currentTabIndex } = this.state;
    return (
      <ul className="text-position-tabs">
        {
          tabList.map((tab, index) => {
            const liStyle = classNames({
              active: index === currentTabIndex
            });
            return (
              <li className={liStyle} key={index}>
                <a onClick={this.handleClick.bind(this, index)}>{tab}</a>
              </li>
            );
          })
        }
      </ul>
    );
  }
}

TextPositionTabs.propTypes = {
  initTabIndex: PropTypes.number,
  onTabChange: PropTypes.func.isRequired
};

TextPositionTabs.defaultProps = {
  tabList: ['Front', 'Spine', 'Back']
};

export default TextPositionTabs;
