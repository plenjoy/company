import React from 'react';
import { fromJS } from 'immutable';
import { merge, get } from 'lodash';
import { upgradeItemTypes, coverTypes, originalCoverSize } from '../../../contants/strings';
import { getLayoutTypeByCover } from '../../../utils/template';

import XCheckBox from '../../../../../common/ZNOComponents/XCheckBox';
import UpgradeItem from '../../UpgradeItem';

import hardCoverEffect_5X7 from '../assets/5X7/hard-cover.png';
import paperCoverEffect_5X7 from '../assets/5X7/soft-cover.png';
import hardCoverEffect_6X6 from '../assets/6X6/hard-cover.png';
import paperCoverEffect_6X6 from '../assets/6X6/soft-cover.png';
import hardCoverEffect_8X8 from '../assets/8X8/hard-cover.png';
import paperCoverEffect_8X8 from '../assets/8X8/soft-cover.png';
import arrowIcon from '../assets/arrow.svg';

const getOriginalCoverSize = (productSize, isHardCover) => {
  const newProductSize = productSize ? productSize.toUpperCase() : '5X7';
  let coverSize;
  let bleed;

  if (isHardCover) {
    coverSize = get(originalCoverSize, `hardCover.${newProductSize}`);
    bleed = get(originalCoverSize, 'hardCover.bleed');
  } else {
    coverSize = get(originalCoverSize, `softCover.${newProductSize}`);
    bleed = get(originalCoverSize, 'softCover.bleed');
  }

  return {
    size: coverSize,
    bleed
  };
};

const getDescription = (currentCheckedItems, t) => {
  let description = '';
  const isUpgradeToHardCover = currentCheckedItems.find(m => m.get('value') === upgradeItemTypes.toHardCover.value);
  const isUpgradeToSize8X8 = currentCheckedItems.find(m => m.get('value') === upgradeItemTypes.toSize8X8.value);

  if (isUpgradeToSize8X8) {
    description = isUpgradeToHardCover ? t('UPGRADE_TO_8X8_HARD_COVER_TITLE') : t('UPGRADE_TO_8X8_TITLE');
  } else {
    description = isUpgradeToHardCover ? t('UPGRADE_HARD_COVER_TITLE') : '';
  }

  return description;
};

const computedRatiosOfHeight = (fromSummary, toSummary) => {
  const fromCover = fromSummary.get('coverType');
  const fromProductSize = fromSummary.get('productSize');
  const toCover = toSummary.get('coverType');
  const toProductSize = toSummary.get('productSize');
  const isHardCoverOfFrom = fromCover === coverTypes.LBHC;
  const isHardCoverOfTo = toCover === coverTypes.LBHC;

  const fromOri = getOriginalCoverSize(fromProductSize, isHardCoverOfFrom);
  const toOri = getOriginalCoverSize(toProductSize, isHardCoverOfTo);

  return { from: 1, to: (toOri.size.height - toOri.bleed.top * 2) / (fromOri.size.height - fromOri.bleed.top * 2) };
};

const getEffectImage = (productSize, isHardCover) => {
  let image;

  if (isHardCover) {
    image = productSize === '5X7' ? hardCoverEffect_5X7 :
        (productSize === '6X6' ? hardCoverEffect_6X6 : hardCoverEffect_8X8);
  } else {
    image = productSize === '5X7' ? paperCoverEffect_5X7 :
        (productSize === '6X6' ? paperCoverEffect_6X6 : paperCoverEffect_8X8);
  }

  return image;
};

export const getDefaultCheckedItems = (upgradeCheckedItems) => {
  const currentCheckedItems = [];

  if(upgradeCheckedItems){
    const hardCoverCheckedItem = upgradeCheckedItems.find(m => m.get('value') === upgradeItemTypes.toHardCover.value);

    if(hardCoverCheckedItem){
      currentCheckedItems.push(hardCoverCheckedItem);
    }
  }

  return fromJS(currentCheckedItems);
};

export const getPrice = (basePrice, currentCheckedItems) => {
  let price = 0;

  if (!isNaN(basePrice)) {
    let added = 0;

    const isUpgradeToHardCover = currentCheckedItems.find(m => m.get('value') === upgradeItemTypes.toHardCover.value);
    const isUpgradeToSize8X8 = currentCheckedItems.find(m => m.get('value') === upgradeItemTypes.toSize8X8.value);

    if (isUpgradeToHardCover) {
      added += 5;
    }

    if (isUpgradeToSize8X8) {
      added += 10;
    }

    price = new Number(basePrice) + added;
  }

  return `$${price.toFixed(2)}`;
};

export const onClickCheckedItem = (that, item) => {
  const { boundTemplateActions, templateId } = that.props;
  let { currentCheckedItems, from, to } = that.state;

  const isUpgradeToHardCover = item.value.get('value') === upgradeItemTypes.toHardCover.value;
  const isUpgradeToSize8X8 = item.value.get('value') === upgradeItemTypes.toSize8X8.value;

  let targetSize = to.getIn(['summary', 'productSize']);
  let targetCoverType = to.getIn(['summary', 'coverType']);

  if (item.checked) {
    currentCheckedItems = currentCheckedItems.push(item.value);

    if (isUpgradeToHardCover) {
      to = to.setIn(['summary', 'coverType'], coverTypes.LBHC);
      targetCoverType = coverTypes.LBHC;
    }

    if (isUpgradeToSize8X8) {
      to = to.setIn(['summary', 'productSize'], '8X8');
      targetSize = '8X8';
    }
  } else {
    const index = currentCheckedItems.findIndex(m => m.get('value') === item.value.get('value'));
    if (index !== -1) {
      currentCheckedItems = currentCheckedItems.splice(index, 1);
    }

    if (isUpgradeToHardCover) {
      to = to.setIn(['summary', 'coverType'], coverTypes.LBPAC);
      targetCoverType = coverTypes.LBPAC;
    }

    if (isUpgradeToSize8X8) {
      targetSize = from.getIn(['summary', 'productSize']);
      to = to.setIn(['summary', 'productSize'], targetSize);
    }
  }

  if (templateId) {
    boundTemplateActions.getRelationTemplate(
      templateId,
      targetSize,
      getLayoutTypeByCover(targetCoverType)
    ).then((result) => {
      const templateElement = get(result, 'data.templateElement');

      if (templateElement) {
        to = to.set('px', templateElement.px);
        to = to.set('py', templateElement.py);
        to = to.set('pw', templateElement.pw);
        to = to.set('ph', templateElement.ph);
      }

      that.setState({
        currentCheckedItems,
        to
      });
    }, () => {

    });
  } else {
    that.setState({
      currentCheckedItems,
      to
    });
  }
};

export const handleConfirm = (that) => {
  // 防止重复添加购物车.
  if (that.isClickedCheckout) {
    return;
  }

  that.isClickedCheckout = true;

  const { onOkClick, close, hideOnOk, boundTrackerActions, upgradeCheckedItems } = that.props;
  const { currentCheckedItems } = that.state;

  const isUpgradeToHardCover = !!(currentCheckedItems.find(m => m.get('value') === upgradeItemTypes.toHardCover.value));
  const isUpgradeToSize8X8 = !!(currentCheckedItems.find(m => m.get('value') === upgradeItemTypes.toSize8X8.value));

  const hasUpgradeCoverOption = !!(upgradeCheckedItems.find(m => m.get('value') === upgradeItemTypes.toHardCover.value));
  const hasUpgradeSizeOption = !!(upgradeCheckedItems.find(m => m.get('value') === upgradeItemTypes.toSize8X8.value));

  if (hideOnOk) {
    close && close();
  }

  onOkClick({
    isUpgradeToHardCover,
    isUpgradeToSize8X8,
    hasUpgradeCoverOption,
    hasUpgradeSizeOption
  });
};

export const handleCancel = (that) => {
  const { onCancelClick, close, boundTrackerActions } = that.props;
  onCancelClick && onCancelClick();
  close && close();
};

export const computedOptionsSize = that => {
  const { from } = that.state;
  const fromSummary = from.get('summary');
  const fromProductSize = fromSummary.get('productSize');

  const wrapWidth = fromProductSize === '5X7' ? 700 : 700;
  const iconsLeftRightPadding = fromProductSize === '5X7' ? 30 : 40;

  return {
    wrapWidth,
    iconsLeftRightPadding
  };
};

export const getUpgradeItems = (that) => {
  const {
    baseUrl,
    bgColor,
    spinePage,
    isImageCover,
    allImages,
    basePrice,
    t,
    env
  } = that.props;


  const { currentCheckedItems, from, to, arrowMarginBottom } = that.state;
  const {
    iconsLeftRightPadding
  } = computedOptionsSize(that);

  const html = [];

  const baseData = { baseUrl, bgColor, allImages };

  const fromSummary = from.get('summary');
  const toSummary = to.get('summary');

  const fromCover = fromSummary.get('coverType');
  const fromProductSize = fromSummary.get('productSize');
  const toCover = toSummary.get('coverType');
  const toProductSize = toSummary.get('productSize');

  const isHardCoverOfFrom = fromCover === coverTypes.LBHC;
  const isHardCoverOfTo = toCover === coverTypes.LBHC;

  const ratiosOfHeight = computedRatiosOfHeight(fromSummary, toSummary);

  // from upgraded
  const fromData = merge({}, baseData, {
    element: from,
    effectImage: getEffectImage(fromProductSize, isHardCoverOfFrom),
    isHardCover: isHardCoverOfFrom,
    spinePage,
    isImageCover,
    productSize: fromProductSize,
    ratioOfHeight: ratiosOfHeight.from,
    shouldReComputedCrops: false,
    env
  });
  const fromActions = {
    updateArrowMarginBottom: that.updateArrowMarginBottom
  };

  html.push(<UpgradeItem key="from-item" data={fromData} actions={fromActions}>
    <div className="options">
      <span className="title">
        {`${from.getIn(['summary', 'productSize']).toLowerCase()}, ${from.getIn(['summary', 'coverType']) === coverTypes.LBPAC ? 'Paper Cover' : 'Hard Cover'}`}
      </span>
    </div>
  </UpgradeItem>);

  // arrow
  const arrowStyle = {
    marginBottom: `${arrowMarginBottom}px`,
    padding: `0 ${iconsLeftRightPadding}px`
  };
  html.push(<img key="arrow-item" style={arrowStyle} className="arrow-icon" src={arrowIcon} />);

  const shouldReComputedCrops = !!currentCheckedItems.size;
  let newTo = to;
  if (!shouldReComputedCrops) {
    newTo = newTo.set('cropLUX', from.get('cropLUX'));
    newTo = newTo.set('cropLUY', from.get('cropLUY'));
    newTo = newTo.set('cropRLX', from.get('cropRLX'));
    newTo = newTo.set('cropRLY', from.get('cropRLY'));
  }

  // to upgraded
  const toData = merge({}, baseData, {
    element: newTo,
    from: from,
    effectImage: getEffectImage(toProductSize, isHardCoverOfTo),
    isHardCover: isHardCoverOfTo,
    spinePage,
    isImageCover,
    productSize: toProductSize,
    ratioOfHeight: ratiosOfHeight.to,
    shouldReComputedCrops,
    env
  });
  const toActions = {
  };

  html.push(<UpgradeItem key="to-item" data={toData} actions={toActions}>
    <div className="options">
      <span className="title">
        {`${to.getIn(['summary', 'productSize']).toLowerCase()}, ${to.getIn(['summary', 'coverType']) === coverTypes.LBPAC ? 'Paper Cover' : 'Hard Cover'}`}
      </span>
    </div>
  </UpgradeItem>);


  const wrapStyle = {
    height: fromProductSize === '5X7' ? '180px' :
    (fromProductSize === '6X6' ? '230px' : '240px')
  };
  return (<div className="upgrade-content" style={wrapStyle}>
    <div className="items-wrap">
      { html }
    </div>
  </div>);
};

export const getCheckedItems = (that) => {
  const {
    upgradeCheckedItems
  } = that.props;

  const { currentCheckedItems } = that.state;
  const html = [];

  if (upgradeCheckedItems && upgradeCheckedItems.size) {
    upgradeCheckedItems.forEach((item, index) => {
      const isChecked = currentCheckedItems.findIndex(m => m.get('value') === item.get('value')) !== -1;

      html.push(<XCheckBox
        key={`checkitem-${item.get('value')}-${index}`}
        value={item}
        checked={isChecked}
        text={item.get('text')}
        contents={item.get('contents')}
        subText={item.get('subText')}
        isShowChecked
        onClicked={that.onClickCheckedItem}
      />);
    });
  }

  return html;
};

export const updateArrowMarginBottom = (that, size) => {
  if (size) {
    that.setState({
      arrowMarginBottom: 42
    });
  }
};
