import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import { translate } from 'react-translate';

import PageNav from '../PageNav';
import EditPage from '../../containers/EditPage';
import ArrangePages from '../../containers/ArrangePages';
import PhotoGrouping from '../../containers/PhotoGrouping';
import SelectThemes from '../../containers/SelectThemes';
import BookOptions from '../../containers/BookOptions';

import './index.scss';

class ViewTabs extends Component {
  constructor(props) {
    super(props);

    this.trackSelectedTab = this.trackSelectedTab.bind(this);

    const { actions } = this.props;
    const { toggleSideBar } = actions;

    this.routes = props.data.isEditParentBook ? (
      <Route
        path="/"
        component={props => (
          <PageNav data={this.props.data}>{props.children}</PageNav>
        )}
      >
        <IndexRedirect to="editpage" />
        <Route
          path="editpage"
          component={props => (
            <EditPage toggleSideBar={toggleSideBar}>{props.children}</EditPage>
          )}
          onEnter={this.trackSelectedTab}
        />
      </Route>
    ) : (
      <Route
        path="/"
        component={props => (
          <PageNav data={this.props.data}>{props.children}</PageNav>
        )}
      >
        <IndexRedirect to="editpage" />
        <Route
          path="editpage"
          component={props => (
            <EditPage toggleSideBar={toggleSideBar}>{props.children}</EditPage>
          )}
          onEnter={this.trackSelectedTab}
        />
        <Route
          path="arrangepages"
          component={ArrangePages}
          onEnter={this.trackSelectedTab}
        />
        <Route
          path="photogrouping"
          component={PhotoGrouping}
          onEnter={this.trackSelectedTab}
        />
        <Route
          path="selectthemes"
          component={SelectThemes}
          onEnter={this.trackSelectedTab}
        />
        <Route
          path="bookoptions"
          component={BookOptions}
          onEnter={this.trackSelectedTab}
        />
      </Route>
    );
  }

  trackSelectedTab(nextState, replace) {
    const { location } = nextState;
    const { actions, data } = this.props;
    const { boundTrackerActions } = actions;
    if (data.isEditParentBook) {
      boundTrackerActions.addTracker('ChangeView,EditPage');
    } else {
      switch (location.pathname) {
        case '/editpage': {
          boundTrackerActions.addTracker('ChangeView,EditPage');
          break;
        }
        case '/arrangepages': {
          boundTrackerActions.addTracker('ChangeView,ArrangePages');
          break;
        }
        case '/photogrouping': {
          boundTrackerActions.addTracker('ChangeView,PhotoGrouping');
          break;
        }
        case '/selectthemes': {
          boundTrackerActions.addTracker('ClickSelectTheme');
          break;
        }
        case '/bookoptions': {
          boundTrackerActions.addTracker('ChangeView,BookOptions');
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  render() {
    return <Router history={hashHistory} routes={this.routes} />;
  }
}

ViewTabs.propTypes = {
  actions: PropTypes.shape({
    boundTrackerActions: PropTypes.object.isRequired
  }).isRequired
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('ViewTabs')(ViewTabs);
