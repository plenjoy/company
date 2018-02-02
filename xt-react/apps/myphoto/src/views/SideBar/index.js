import React from 'react';
import {observer} from 'mobx-react';

import './style.scss';
import { viewTypes } from '../../constants/string';
import { goTracker } from '../../../../common/utils/tracker';
import { clientType, product, trackerNames } from '../../constants/string';

@observer
class SideBar extends React.Component {
  constructor(props) {
    super(props);

    this.changeViewMode = this.changeViewMode.bind(this);
  }

  changeViewMode(newViewMode) {
    const { viewMode, changeViewMode } = this.props;

    if (viewMode === newViewMode)return;

    changeViewMode(newViewMode);

    switch(newViewMode) {
      case viewTypes.TIMELINE:
        goTracker(`${clientType}_${product},null,${trackerNames.ClickTimeline}`);
      break;
      case viewTypes.PROJECT:
        goTracker(`${clientType}_${product},null,${trackerNames.ClickProjects}`);
      break;
      default:
      break;
    }
  }

  render() {
    const { viewMode } = this.props;

    const timeLineStyle = {
      linkClass: `SideBar__item--link${viewMode === viewTypes.TIMELINE ? ' active' : ''}`,
      isChecked: viewMode === viewTypes.TIMELINE
    };

    const projectListStyle = {
      linkClass: `SideBar__item--link${viewMode === viewTypes.PROJECT ? ' active' : ''}`,
      isChecked: viewMode === viewTypes.PROJECT
    };

    return (
      <ul className='SideBar'>
        <li className='SideBar__item' onClick={() => {this.changeViewMode(viewTypes.TIMELINE)}}>
          <a className={timeLineStyle.linkClass}>
            <input className='SideBar__item--input' type='radio' checked={timeLineStyle.isChecked} onChange={() => {}} />Timeline
          </a>
        </li>
        <li className='SideBar__item' onClick={() => {this.changeViewMode(viewTypes.PROJECT)}}>
          <a className={projectListStyle.linkClass}>
            <input className='SideBar__item--input' type='radio' checked={projectListStyle.isChecked} onChange={() => {}} />Projects
          </a>
        </li>
      </ul>
    );
  }
}

SideBar.propTypes = {
};

export default SideBar;
