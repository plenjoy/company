import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import * as layoutHandler from './handler/layout';
import * as handler from './handler/bottomPanel';
import { filterOptions } from '../../contants/strings';

import LayoutTab from '../LayoutTab';
import PageNavigation from '../PageNavigation';

import './index.scss';

class BottomPanel extends Component {
  constructor(props) {
    super(props);

    const { t, data } = props;

    // 内部state.
    this.state = {
      isLoaded: false,
      templateList: [],
      currentFilterTag: filterOptions.TOP,
      realFilterTag: 0,
      panelStep: 1
    };

    this.applyTemplate = guid => layoutHandler.applyTemplate(this, guid);
    this.sortTemplateByNum = list => layoutHandler.sortTemplateByNum(list);
    this.onSelectFilter = tag => layoutHandler.onSelectFilter(this, tag);
    this.receiveProps = nextProps =>
      layoutHandler.receiveProps(this, nextProps);
    this.willMount = () => layoutHandler.willMount(this);
    this.didMount = () => layoutHandler.didMount(this);

    // 选项卡选中时的处理函数.
    this.onSelect = selectedIndex => handler.onSelect(this, selectedIndex);
    this.onClickNavItem = tabIndex => handler.onClickNavItem(this, tabIndex);

    this.tabsText = [t('LAYOUTS'), t('PAGES')];
  }

  componentDidMount() {
    this.didMount();
  }

  componentWillReceiveProps(nextProps) {
    this.receiveProps(nextProps);
  }

  render() {
    const { data, actions } = this.props;
    const {
      paginationSpread,
      uploadedImages,
      baseUrls,
      setting,
      pagination,
      userInfo,
      panelStep,
      fontList,
      isEditParentBook,

      // nav pages.
      navPagesRatios,
      navPagesSize,
      navPagesPosition,
      allSheets,

      specData,
      urls,
      materials,
      variables,
      settings,
      parameters,
      coverSpreadForInnerWrap,
      capability,
      bookSetting,
      tabIndex,
      env
    } = data;

    const {
      templateList,
      isLoaded,
      currentFilterTag,
      realFilterTag
    } = this.state;
    const {
      boundTemplateActions,
      boundProjectActions,
      boundTrackerActions,
      pageNumberActions
    } = actions;

    const tabsText = this.tabsText;
    const pageId = pagination.pageId;
    const pages = paginationSpread.get('pages');

    const page = pages.find((p) => {
      return p.get('id') === pageId;
    });

    const tabs = tabsText.map((text, i) => {
      const disabled = isEditParentBook && i === 1;
      const classes = classNames('tab-item', {
        active: i === tabIndex,
        disabled
      });

      return (
        <Tab key={i} className={classes} disabled={disabled}>
          <span id={text}>{disabled ? '' : text}</span>
        </Tab>
      );
    });

    const tabNavs = tabsText.map((text, i) => {
      const classes = classNames('tab-nav-item', { active: i === tabIndex });
      return isEditParentBook && i === 1 ? null : (
        <li
          key={i}
          className={classes}
          onClick={this.onClickNavItem.bind(this, i)}
        >
          {text}
        </li>
      );
    });

    const onSelectFilter = this.onSelectFilter;
    const applyTemplate = this.applyTemplate;

    const layoutTabActions = {
      boundTemplateActions,
      boundProjectActions,
      boundTrackerActions,
      onSelectFilter,
      applyTemplate
    };
    const layoutTabData = {
      paginationSpread,
      uploadedImages,
      templateList,
      currentFilterTag,
      realFilterTag,
      baseUrls,
      setting,
      pagination,
      isLoaded,
      page,
      userInfo,
      panelStep,
      fontList,
      capability,
      bookSetting
    };

    // PageNavigation
    const pageNavigationActions = {
      pageNumberActions
    };
    const pageNavigationData = {
      pagination,
      navPagesRatios,
      navPagesSize,
      navPagesPosition,
      allSheets,
      specData,
      urls,
      materials,
      variables,
      settings,
      parameters,
      coverSpreadForInnerWrap,
      capability,
      env
    };

    return (
      <div className="bottom-panel">
        {panelStep ? (
          <Tabs
            className="tab-pages-layouts"
            onSelect={this.onSelect}
            selectedIndex={tabIndex}
          >
            <TabList className="list">{tabs}</TabList>
            <TabPanel>
              <LayoutTab actions={layoutTabActions} data={layoutTabData} />
            </TabPanel>
            <TabPanel>
              {isEditParentBook ? null : (
                <PageNavigation
                  actions={pageNavigationActions}
                  data={pageNavigationData}
                />
              )}
            </TabPanel>
          </Tabs>
        ) : (
          <ul className="tab-nav">{tabNavs}</ul>
        )}
      </div>
    );
  }
}

export default translate('BottomPanel')(BottomPanel);
