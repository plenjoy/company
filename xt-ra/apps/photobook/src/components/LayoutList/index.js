import Loader from 'react-loader';
import Immutable from 'immutable';
import classNames from 'classnames';
import { translate } from 'react-translate';
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { template, merge, isEqual, get } from 'lodash';

import { filterOptions } from '../../contants/strings';

import { addMouseWheelEvent } from '../../../../common/utils/mouseWheel';

import * as handler from './handler';
import LayoutFilter from '../LayoutFilter';
import XButton from '../../../../common/ZNOComponents/XButton';
import AutoLayoutSwitch from '../AutoLayoutSwitch';

import './index.scss';

class LayoutList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numTemplate: {},
      templateList: [],

      // layout 图片的大小.
      imageSize: {
        width: 0,
        height: 0
      },

      // 每行显示的个数.
      colNumber: 0
    };

    this.getTemplateHTML = () => handler.getTemplateHTML(this);
    this.groupTemplateByNum = list => handler.groupTemplateByNum(this, list);
    this.doFilter = (tag, list) => handler.doFilter(this, tag, list);
    this.onLayoutDragStarted = (guid, e) =>
      handler.onLayoutDragStarted(this, guid, e);
    this.handlerMouseWheel = dir => handler.handlerMouseWheel(this, dir);

    this.onSwitchChange = () => {
      const { data, actions } = this.props;
      const { bookSetting } = data;
      const { boundProjectActions, boundTrackerActions } = actions;

      const autoLayoutState = !bookSetting.get('autoLayout');
      boundProjectActions.changeBookSetting({
        autoLayout: autoLayoutState
      });

      boundTrackerActions.addTracker(
        `ToggleAutoLayout,${Number(autoLayoutState)}`
      );
    };
  }

  componentWillReceiveProps(nextProps) {
    const { actions } = this.props;
    const { onSelectFilter } = actions;

    const oldList = get(this.props, 'data.templateList');
    const newList = get(nextProps, 'data.templateList');

    const oldFilter = get(this.props, 'data.currentFilterTag');
    const newFilter = get(nextProps, 'data.currentFilterTag');

    const oldRealFilter = get(this.props, 'data.realFilterTag');
    const newRealFilter = get(nextProps, 'data.realFilterTag');

    const oldPage = get(this.props, 'data.page');
    const newPage = get(nextProps, 'data.page');

    if (!isEqual(oldList, newList)) {
      const numTemplate = this.groupTemplateByNum(newList);
      const currentFilterTag = newFilter;
      this.setState(
        {
          templateList: newList,
          numTemplate
        },
        () => {
          this.doFilter(currentFilterTag, newList);
        }
      );
    }

    if (
      !isEqual(oldFilter, newFilter) ||
      (!isEqual(oldRealFilter, newRealFilter) && newRealFilter) ||
      (oldPage &&
        newPage &&
        oldPage.get('elements').size !== newPage.get('elements').size)
    ) {
      const numTemplate = this.groupTemplateByNum(newList);
      this.setState(
        {
          numTemplate
        },
        () => {
          this.doFilter(newFilter, newList);
        }
      );
    }
  }

  componentDidMount() {
    const { actions } = this.props;
    const { onSelectFilter } = actions;
    const list = get(this.props, 'data.templateList');
    const filter = get(this.props, 'data.currentFilterTag');
    const numTemplate = this.groupTemplateByNum(list);
    const currentFilterTag = filter;

    this.setState(
      {
        templateList: list,
        numTemplate
      },
      () => {
        this.doFilter(currentFilterTag, list);
      }
    );

    // 绑定鼠标滚轮事件
    addMouseWheelEvent(this.layoutList, dir => {
      this.handlerMouseWheel(dir);
    });
  }

  render() {
    const { data, actions, t } = this.props;
    const {
      currentFilterTag,
      isLoaded,
      pagination,
      userInfo,
      panelStep,
      capability,
      bookSetting
    } = data;
    const { numTemplate, templateList } = this.state;

    const { onSelectFilter } = actions;

    const isCover = pagination.sheetIndex == '0';

    const hideFilter = classNames('', {
      hide: !data.templateList.length
    });

    const nums = Object.keys(numTemplate);

    const layoutWidthStyle = {
      width: 'auto'
    };

    // 当模板列表为空时, 就是用flex布局.
    const listClassName = classNames('list', {
      'display-flex': !templateList.length
    });

    return (
      <div className="layout-list">
        {panelStep ? (
          <LayoutFilter
            nums={nums}
            className={hideFilter}
            currentFilterTag={currentFilterTag}
            onSelectFilter={onSelectFilter}
            capability={capability}
          />
        ) : null}

        <AutoLayoutSwitch
          canAutoLayout={bookSetting.get('autoLayout')}
          onSwitchChange={this.onSwitchChange}
        />

        <div
          className={listClassName}
          ref={layoutList => (this.layoutList = layoutList)}
        >
          {templateList.length ? (
            this.getTemplateHTML()
          ) : (
            <span className="no-layouts" style={layoutWidthStyle}>
              {isCover ? t('NO_LAYOUTS') : t('NO_LAYOUTS_INNER')}
            </span>
          )}
        </div>
      </div>
    );
  }
}

LayoutList.proptype = {};

export default translate('LayoutList')(LayoutList);
