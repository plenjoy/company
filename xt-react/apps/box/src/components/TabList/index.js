import React, { Component, PropTypes} from 'react';
import classNames from 'classnames';
import Tab from '../Tab';
import './index.scss';

class TabList extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const { className, onSelected, children, selectedTab } = this.props;
    const ClassName = classNames('list-tab', className);

    return(
      <div className={className}>
        {children.map((tab, index) => (
          <Tab
            selectedTab={selectedTab}
            onSelected={onSelected}
            key={index}
            tab={tab}
          />
        ))}
      </div>
    );
  }
}


export default TabList;
