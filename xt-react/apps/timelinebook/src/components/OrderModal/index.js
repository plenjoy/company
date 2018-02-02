import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { get, merge } from 'lodash';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import VolumeCover from '../../components/VolumeCover';
import * as strings from '../../constants/strings';
import * as main from './handler/main';
import './index.scss';

import select from './assets/select.svg';
import selected from './assets/selected.svg';
import right from './assets/right.svg';
import change from './assets/change.svg';

class OrderModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowWarning: false,
      orderVolumeIds: main.getInitOrderVolumeIds(props.data.volumes),
      isFirstOpen: true,
      isOrderClicked: false
    };

    this.selectAll = main.selectAll.bind(this);
    this.clickOrder = main.clickOrder.bind(this);
    this.selectVolume = main.selectVolume.bind(this);
    this.getVolumeList = main.getVolumeList.bind(this);
  }

  componentWillReceiveProps({data: nextData}) {
    const { volumes: nextVolumes, isShown } = nextData;
    const { orderVolumeIds, isFirstOpen } = this.state;
    const newOrderVolumeIds = [];

    orderVolumeIds.forEach((orderVolumeId, index) => {
      const isVolumeDelete = !nextVolumes.some(nextVolume => nextVolume.get('idx') === orderVolumeId);

      if(!isVolumeDelete) {
        newOrderVolumeIds.push(orderVolumeId);
      }
    });

    if(isShown && isFirstOpen) {
      this.setState({
        orderVolumeIds: main.getInitOrderVolumeIds(nextVolumes),
        isFirstOpen: false
      });
    } else {
      this.setState({ orderVolumeIds: newOrderVolumeIds });
    }
  }

  render() {
    const { t, data, actions } = this.props;
    const { orderVolumeIds, isShowWarning, isOrderClicked } = this.state;

    const { volumes, summary, price, isShown } = data;
    const { closeOrderModalByX } = actions;

    const isSoftCover = summary.get('cover') === 'TLBSC';

    const volumeListClass = classNames({
      'softListClass':isSoftCover,
      'hardListClass':!isSoftCover
    });

    const orderModalClass = classNames('order-modal', {
      'hide': !isShown || isOrderClicked
    });

    const orderNum = orderVolumeIds.length;
    const isSelectAll = orderNum === volumes.filter(volume => volume.get('isComplete')).size;

    const softPrice = +price.get('softCoverOriPrice');
    const softTotalPrice = softPrice * orderNum;
    const hardTotalPrice = (softPrice + 5) * orderNum;

    const orderTitle = isSoftCover ? 'Upgrade to Hard Cover' : 'Select Volume';
    const volumeOrderText = orderNum > 1 ? ' Volumes Selected' : ' Volume Selected';

    return (
      <XModal
        className={orderModalClass}
        onClosed={closeOrderModalByX}
        opened={isShown}
      >
        <div className="order-title">{ orderTitle }</div>

        {isSoftCover ?
          <div className="upgrade-block">
            <div className="soft-block">
              <VolumeCover
                width={195}
                height={195}
                coverUrl={volumes.getIn(['0','cover', 'photo', 'thumbnail', 'url'])}
                coverType="TLBSC"
              />
              <div className="soft-cover-title">Soft Cover</div>
            </div>
            <img className="block-img" src={change}/>
            <div className="hard-block">
              <VolumeCover
                width={200}
                height={200}
                coverUrl={volumes.getIn(['0','cover', 'photo', 'thumbnail', 'url'])}
                coverType="TLBHC"
              />
              <div className="hard-cover-title">Hard Cover</div>
              <div className="additional-title">Additional $5</div>
              <div className="info-title">More high-end, elegant and professional</div>
            </div>
          </div>
          : null}
        
        <div className="select-all-row" onClick={this.selectAll}>
          {isSelectAll
            ? <img className="select-all-img" src={selected}/>
            : <img className="select-all-img" src={select}/>}

          <span className="select-all-font-medium">Select All</span>
          <span className="select-all-font-normal">({orderNum} {volumeOrderText})</span>

          {isShowWarning
            ? <span className="warning-tip">Please select at least one volume.</span>
            : null}

        </div>
        <div className={volumeListClass}>
          {this.getVolumeList()}
        </div>
        <div className="button-wrap">

          {isSoftCover
            ? <XButton className="button-white" onClicked={() => this.clickOrder('TLBSC')}>
                {`Soft Cover $${softTotalPrice.toFixed(2)}`}
              </XButton>
            : null}

          <XButton onClicked={() => this.clickOrder('TLBHC')}>
            {isSoftCover
              ? `Hard Cover $${hardTotalPrice.toFixed(2)}`
              : `Check Out $${hardTotalPrice.toFixed(2)}`}
          </XButton>
        </div>
      </XModal>    
    );
  }
}

export default translate('OrderModal')(OrderModal);