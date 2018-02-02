import React, { Component, PropTypes} from 'react';
import classNames from 'classnames';
import './index.scss';

class ListTab extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const { className, children} = this.props;
    const ClassName = classNames('list-tab', className);
    return(
      <div className={className}>
        <div className="list-tab-selected">{children}</div>
        <div className="list-tab-noselect"></div>
      </div>
    );
  }
}


export default ListTab;
