import React from 'react';
import classNames from 'classnames';

import select from '../assets/select.svg';
import selected from '../assets/selected.svg';
import right from '../assets/right.svg';
import change from '../assets/change.svg';
import OAuth from '../../../../../common/utils/OAuth';
import { coverTypes } from '../../../constants/strings';

import VolumeCover from '../../../components/VolumeCover';

/**
 * 渲染volume下单列表
 */
export function getVolumeList() {
  const { t, data } = this.props;
  const { orderVolumeIds } = this.state;
  const { volumes, summary } = data;

  return volumes.map((volume, index) => {

    const thumbnailUrl = volume.getIn(['cover', 'photo', 'thumbnail', 'url']);
    const volumeRowTitle = volume.get('isComplete') ? '' : 'Books are required to have 100 pages before printing';
    const volumeRowClass = classNames({
      'volume-row': volume.get('isComplete'),
      'volume-row-no-order': !volume.get('isComplete')
    });
    const isVolumeOrder = orderVolumeIds.some(idx => idx === volume.get('idx'));

    return (
      <div
        key={index}
        className={volumeRowClass}
        title={volumeRowTitle}
        onClick={() => this.selectVolume(volume)}
      >
        {isVolumeOrder
          ? <img className="select-img" src={selected}/>
          : <img className="select-img" src={select}/>}

        <span className="volume-cover-span">
          <VolumeCover
            width={30}
            height={30}
            coverUrl={thumbnailUrl}
            coverType={summary.get('cover')}
          />
        </span>
        <span className="font-medium">Volume {index + 1}</span>
        <span className="font-normal">{volume.get('date')}</span>

        {isVolumeOrder
          ? <img className="right-img" src={right}/>
          : null}

        <div className="volume-row-disable"></div>
      </div>
      )
    })
}

/**
 * 选中所有volume为下单
 */
export function selectAll() {
  const { orderVolumeIds } = this.state;
  const { volumes } = this.props.data;
  const completeVolumes = volumes.filter(volume => volume.get('isComplete'));
  const isSelectAll = orderVolumeIds.length === completeVolumes.size;
  const newOrderVolumeIds = [];

  if(!isSelectAll){
    for(const volume of completeVolumes) {
      newOrderVolumeIds.push(volume.get('idx'));
    }
  }

  this.setState({
    isShowWarning: !newOrderVolumeIds.length,
    orderVolumeIds: newOrderVolumeIds
  });
}

/**
 * 获取所有初始VolumeId
 * @param {*} volumes 
 */
export function getInitOrderVolumeIds(volumes) {
  return volumes
    .filter(volume => volume.get('isComplete'))
    .map(volume => volume.get('idx'))
    .toJS();
}

export function selectVolume(volume) {
  if(volume.get('isComplete')) {
    const { orderVolumeIds } = this.state;
    const isVolumeInOrder = orderVolumeIds.some(orderVolumeId => orderVolumeId === volume.get('idx'));

    let newOrderVolumeIds = [];

    if(isVolumeInOrder) {
      newOrderVolumeIds = orderVolumeIds.filter(orderVolumeId => orderVolumeId !== volume.get('idx'));
    } else {
      newOrderVolumeIds = [...orderVolumeIds, volume.get('idx')];
    }

    this.setState({
      isShowWarning: !newOrderVolumeIds.length,
      orderVolumeIds: newOrderVolumeIds
    })
  }
}

export async function clickOrder(selectCoverType) {
  const { onSaveProject, boundOrderModalActions, boundProjectsActions, boundTrackerActions } = this.props.actions;
  const { summary } = this.props.data;
  const { orderVolumeIds } = this.state;
  const isHC = selectCoverType == coverTypes.TLBHC;

  this.setState({
    isShowWarning: !orderVolumeIds.length
  });

  if(orderVolumeIds.length){
    this.setState({ isOrderClicked: true });
    if(selectCoverType !== summary.get('cover')) {
      await boundProjectsActions.changeSummary({cover: selectCoverType});
    }
    boundTrackerActions.addTracker(`TapCheckout,${isHC},${OAuth.authType}`);
    boundProjectsActions.orderVolumes(orderVolumeIds);

    setTimeout(() => {
      onSaveProject();
      boundOrderModalActions.showOrderLoading();
      boundOrderModalActions.hideOrder();
      this.setState({ isOrderClicked: false });
    });
  }
}