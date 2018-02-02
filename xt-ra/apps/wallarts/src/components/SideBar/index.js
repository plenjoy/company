import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';
import PhotoTab from '../PhotoTab';
import OptionTab from '../OptionTab';
import * as handler from './handler';
import './index.scss';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = { tabIndex: 0 };
    this.onSelect = selectedIndex => handler.onSelect(this, selectedIndex);
  }

  render() {
    const { t, data, actions } = this.props;

    const {
      settings,
      project,
      uploadedImages,
      baseUrls,
      imageUsedMap,
      uploadStatus,
      useNewUpload,
      spec
    } = data;
    const {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      addStatusCount,
      boundLoadingModalAction
    } = actions;
    const tabsText = [t('OPTIONS'), t('PHOTOS')];

    const tabs = tabsText.map((text, i) => {
      const classes = classNames('item', { active: i === this.state.tabIndex });

      let disabled = false;
      if (!text) {
        disabled = true;
      }
      return (
        <Tab key={i} className={classes} disabled={disabled}>
          {text}
        </Tab>
      );
    });
    const photoTabActions = {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      addStatusCount,
      boundTrackerActions
    };
    const photoTabData = {
      uploadedImages,
      baseUrls,
      imageUsedMap,
      uploadStatus,
      useNewUpload
    };

    const optionTabActions = {
      toggleModal,
      boundImagesActions,
      boundProjectActions,
      boundTrackerActions,
      boundLoadingModalAction
    };
    const optionTabData = {
      project,
      settings,
      spec
    };
    return (
      <div className="side-bar" draggable="false">
        <Tabs
          onSelect={this.onSelect}
          selectedIndex={this.state.tabIndex}
          forceRenderTabPanel
        >
          <TabList className="list">{tabs}</TabList>

          <TabPanel>
            {spec.size ? (
              <OptionTab actions={optionTabActions} data={optionTabData} />
            ) : null}
          </TabPanel>

          {/* photos */}
          <TabPanel>
            <PhotoTab actions={photoTabActions} data={photoTabData} />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

SideBar.propTypes = {};

export default translate('SideBar')(SideBar);
