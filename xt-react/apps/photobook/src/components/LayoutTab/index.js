import React, { Component, PropTypes } from 'react';
import { merge } from 'lodash';
import * as handler from './handler.js';
import LayoutList from '../LayoutList';
import './index.scss';

class LayoutTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, actions } = this.props;
    const {
      boundTemplateActions,
      boundProjectActions,
      boundTrackerActions,
      onSelectFilter,
      applyTemplate,
      getMore
    } = actions;
    const {
      paginationSpread,
      uploadedImages,
      baseUrls,
      setting,
      ratio,
      currentFilterTag,
      isLoaded,
      page,
      templateList,
      pagination,
      userInfo,
      panelStep,
      realFilterTag,
      capability,
      bookSetting
    } = data;
    const layoutListData = {
      paginationSpread,
      uploadedImages,
      templateList,
      baseUrls,
      setting,
      currentFilterTag,
      isLoaded,
      page,
      pagination,
      userInfo,
      panelStep,
      realFilterTag,
      capability,
      bookSetting
    };
    const layoutListActions = {
      boundTemplateActions,
      boundProjectActions,
      boundTrackerActions,
      onSelectFilter,
      applyTemplate,
      getMore
    };

    return (
      <div className="layout-tab">
        <LayoutList data={layoutListData} actions={layoutListActions} />
      </div>
    );
  }
}

LayoutTab.proptype = {};

export default LayoutTab;
