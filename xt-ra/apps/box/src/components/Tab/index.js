import React, { Component, PropTypes} from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import './index.scss';

class Tab extends Component{
  constructor(props) {
    super(props);
  }

  // 判断是不是选中的tab
  isSelectedTab(tab) {
    return tab === this.props.selectedTab;
  }

  // 在ListTab里面选中tab
  selectTab(tab) {
    this.props.onSelected(tab);
  }

  render(){
    const { onSelected, tab, t } = this.props;
    const tabClass = this.isSelectedTab(tab) ? 'list-tab-selected' : 'list-tab-noselect';

    return(
      <div className={ tabClass } onClick={() => this.selectTab(tab)}>
        {t(tab)}
      </div>
    );
  }

  componentDidMount() {
    const {tab, onSelected} = this.props;

    if(this.isSelectedTab(tab)) {
      onSelected(tab);
    }
  }
}


export default translate('Tab')(Tab);
