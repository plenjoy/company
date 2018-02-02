import React, { Component, PropTypes } from 'react';
import logo from './logo-portal.png';
import './index.scss';

class PageHeader extends Component {
  componentWillMount() {
    const { uidpk, actions } = this.props;
    const {
      getEnv,
      getProjectData,
      getStyleList,
      getFontList,
      getSpecData
    } = actions;
    getSpecData();

    getEnv().then(() => {
      getFontList();
      getProjectData(uidpk).then(() => {
        getStyleList();
      });
    });
  }

  render() {
    return (
      <div className="row page-head">
        <div className="col-md-3">
          <img src={logo} />
        </div>
        <div className="col-md-9">
          <div className="head-title">Layout Editor</div>
        </div>
      </div>
    );
  }
}

PageHeader.propTypes = {
  uidpk: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    getEnv: PropTypes.func.isRequired,
    getProjectData: PropTypes.func.isRequired,
    getStyleList: PropTypes.func.isRequired
  })
};

export default PageHeader;
