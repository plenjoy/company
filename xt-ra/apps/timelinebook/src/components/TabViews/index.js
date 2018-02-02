import React, { Component, PropTypes } from 'react';
import {
  Router,
  Route,
  IndexRedirect,
  hashHistory
} from 'react-router';
import { translate } from 'react-translate';

import PageNav from '../PageNav';
import AllPages from '../../containers/AllPages';
import ManagePhotos from '../../containers/ManagePhotos';

import './index.scss';

class TabViews extends Component {
  constructor(props) {
    super(props);

    this.trackSelectedTab = this.trackSelectedTab.bind(this);

    this.routes = (
      <Route path="/" component={props => this.getRenderHtml(props)}>
        <IndexRedirect to="allpages" />
        <Route
          path="allpages"
          component={AllPages}
          onEnter={this.trackSelectedTab}
        />
        <Route
          path="managephotos"
          component={ManagePhotos}
          onEnter={this.trackSelectedTab}
        />
      </Route>
    );
  }

  getRenderHtml(props) {
    return (
      <div className="TabViews">
        <PageNav />

        <div className="line" />

        <section className="content">
          {props.children}
        </section>
      </div>
    );
  }

  trackSelectedTab(nextState) {
    const { location } = nextState;
    const { actions, data } = this.props;
    const { projectId } = data;
    const { boundTrackerActions } = actions;

    switch (location.pathname) {
      case '/allpages':
        if (projectId !== -1) {
        }
        break;
      case '/managephotos':
        if (projectId !== -1) {
          boundTrackerActions.addTracker('TapManagePhotos');
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <Router history={hashHistory} routes={this.routes} />
    );
  }
}

TabViews.propTypes = {
  actions: PropTypes.shape({
    boundTrackerActions: PropTypes.object.isRequired
  }).isRequired
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('TabViews')(TabViews);
