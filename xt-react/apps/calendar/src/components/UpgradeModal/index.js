import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { merge } from 'lodash';
import { is } from 'immutable';
import { translate } from 'react-translate';
import { getScreenShot } from '../../utils/screenshot';
import { redirectToOrder } from '../../utils/order';
import XCheckBox from '../../../../common/ZNOComponents/XCheckBox';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import Screenshot from '../../canvasComponents/Screenshot';
import UpgradeTarget from '../UpgradeTarget';
import arrow from './icon/arrow.svg';
import './index.scss';


class UpgradeModalV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: true
    };
    this.isClickedCheckout = false;
    this.handleConfirm = this.handleConfirm.bind(this);
    this.onClickCheckedItem = this.onClickCheckedItem.bind(this);
  }
  async handleConfirm() {
    const { boundProjectActions, oldSaveProject, saveProjectWithOutScreenShot, close, addTracker } = this.props;
    const { project } = this.props.data;
    const projectId = project.property.get('projectId');
    const { isChecked } = this.state;
    if (isChecked) {
      const urlImage = await getScreenShot('.isForUpgradeScreenshot canvas', false);
      close();
      addTracker('UpgradeOption,1');
      await boundProjectActions.changeProjectSetting({ size: '8X6' });
      await boundProjectActions.uploadCoverImage(urlImage);
      await saveProjectWithOutScreenShot(() => {
        redirectToOrder(projectId);
      }, () => {});
    } else {
      close();
      addTracker('UpgradeOption,0');
      oldSaveProject();
    }
  }
  onClickCheckedItem() {
    const { isChecked } = this.state;
    this.setState({
      isChecked: !isChecked
    });
  }

  render() {
    const { isShown, close, boundProjectActions, data,userInfo } = this.props;
    const {
      urls,
      size,
      ratios,
      variables,
      template,
      pagination,
      paginationSpread,
      settings,
      parameters,
      isPreview,
      specData,
      project,
      allImages,
      userId,
      capability,
      allSheets,
      price,
    } = data;
    const bookCoverAction = {};
    const { isChecked } = this.state;
    const OKButtonClass = classNames('height-30');

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
      isPreview,
      specData,
      project,
      allImages,
      userId,
      capability,
      allSheets,
      useInUpgrade: true,
      isUpgradeTo8X6: isChecked,
      userInfo
    };
    const rightStyle = isChecked ? { marginTop: '12px' } : { marginTop: '34px',marginLeft:'12px' };


    return (
      <XModal
        className="upgrade-wrap"
        onClosed={close}
        opened={isShown}
      >
        <div className="upgrade-title">Would you like to upgrade your Little Moments Calendar?</div>
        <div className="upgrade-content">
          <div className="upgrade-container upgrade-left">
            <Screenshot
              actions={bookCoverAction}
              data={bookCoverData}
            />
            <span>7X5</span>
          </div>
          <img className="arrow-icon" src={arrow} />
          <div className="upgrade-right" >
            <div className="upgrade-container" style={rightStyle}>
              {isChecked ? <UpgradeTarget data={bookCoverData} /> :
              (<div className="upgrade-container>">
                <Screenshot
                  actions={bookCoverAction}
                  data={bookCoverData}
                />
                <span>7X5</span>
              </div>
               )
             }
              <UpgradeTarget data={{ ...bookCoverData, isForUpgradeScreenshot: true }} />
            </div>
          </div>
        </div>


        <div className="upgrade-checked-items">
          <XCheckBox
            value
            checked={isChecked}
            text={'Upgrade to 8X6'}
            subText={'Additional $5.00'}
            contents={'A larger print to show off favorite moments throughout the year. Makes a memorable gift!'}
            isShowChecked
            onClicked={this.onClickCheckedItem}
          />
        </div>
        <div className="button-wrap">
          <XButton
            height={30}
            onClicked={this.handleConfirm}
          >
        Add to Cart
        </XButton>
        </div>
      </XModal>
    );
  }
}

UpgradeModalV2.propTypes = {
  isShown: PropTypes.bool.isRequired
};

UpgradeModalV2.defaultProps = {
};

export default translate('UpgradeModal')(UpgradeModalV2);

