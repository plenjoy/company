import classNames from 'classnames';
import Immutable from 'immutable';
import { get, merge } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';

import Screenshot from '../../canvasComponents/Screenshot';

import { getNewState } from './hander';

import './index.scss';


class UpgraderTarget extends Component {
  constructor(props) {
    super(props);
    const newState = getNewState(props);
    if (newState) {
      this.state = newState;
    } else {
      this.state = {
        project: null,
        settings: null,
        paginationSpread: null,
        parameters: null,
        allSheets: null,
        size: null
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    const newState = getNewState(nextProps);
    if (newState) {
      this.setState(newState);
    }
  }

  render() {
    const { data } = this.props;
    const {
      isShown,
      urls,
      ratios,
      variables,
      template,
      pagination,
      specData,
      allImages,
      userId,
      capability,
      isForUpgradeScreenshot,
      userInfo
    } = data;
    const {
      project,
      settings,
      paginationSpread,
      parameters,
      allSheets,
      size
    } = this.state;
    const bookCoverAction = {};

    const bookCoverData = {
      urls,
      size,
      ratios,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      parameters,
      isPreview: true,
      specData,
      project,
      allImages,
      userId,
      capability,
      allSheets,
      useInUpgrade: true,
      isUpgradeTo8X6: true,
      isForUpgradeScreenshot,
      userInfo
    };
    const forUpgradeScreenshot = classNames('upgrader-target-container', { isForUpgradeScreenshot });
    const isForUpgradeScreenshotStyle = isForUpgradeScreenshot ? { display: 'none' } : {};
    return (
      <div className={forUpgradeScreenshot} style={isForUpgradeScreenshotStyle}>
        {
          paginationSpread && paginationSpread.get
            ? <Screenshot
              actions={bookCoverAction}
              data={bookCoverData}
            />
            : null
        }
        <span>8X6</span>
      </div>
    );
  }
}

UpgraderTarget.propTypes = {
};

UpgraderTarget.defaultProps = {
};

export default translate('UpgraderTarget')(UpgraderTarget);

