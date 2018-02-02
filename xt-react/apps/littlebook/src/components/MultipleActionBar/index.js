import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import './index.scss';

const MultipleActionBar = ({ actions, selectedElementArray, t }) => {
  const onAlignLeft = () => {
    actions.onAlignLeft(selectedElementArray);
  };

  const onAlignCenter = () => {
    actions.onAlignCenter(selectedElementArray);
  };

  const onAlignRight = () => {
    actions.onAlignRight(selectedElementArray);
  };

  const onAlignTop = () => {
    actions.onAlignTop(selectedElementArray);
  };

  const onAlignMiddle = () => {
    actions.onAlignMiddle(selectedElementArray);
  };

  const onAlignBottom = () => {
    actions.onAlignBottom(selectedElementArray);
  };

  const onSpaceHorizontal = () => {
    actions.onSpaceHorizontal(selectedElementArray);
  };

  const onSpaceVertical = () => {
    actions.onSpaceVertical(selectedElementArray);
  };

  const onClearAll = () => {
    actions.onClearAll(selectedElementArray);
  };

  return (
    <ul className="multiple-action-bar" data-html2canvas-ignore="true">
      <li className="icon-item item-align-horizontal">
        <a />
        <ul className="sub-menu">
          <li className="icon-item item-align-left" title={t('ALIGN_LEFT')}>
            <a onClick={onAlignLeft} />
          </li>
          <li className="icon-item item-align-center" title={t('ALIGN_CENTER')}>
            <a onClick={onAlignCenter} />
          </li>
          <li className="icon-item item-align-right" title={t('ALIGN_RIGHT')}>
            <a onClick={onAlignRight} />
          </li>
        </ul>
      </li>
      <li className="icon-item item-align-vertical">
        <a />
        <ul className="sub-menu">
          <li className="icon-item item-align-top" title={t('ALIGN_TOP')}>
            <a onClick={onAlignTop} />
          </li>
          <li className="icon-item item-align-middle" title={t('ALIGN_MIDDLE')}>
            <a onClick={onAlignMiddle} />
          </li>
          <li className="icon-item item-align-bottom" title={t('ALIGN_BOTTOM')}>
            <a onClick={onAlignBottom} />
          </li>
        </ul>
      </li>
      <li className="icon-item item-space">
        <a title={t('SPACE_NEED_THREE_MORE_ELEMENTS')} />
        <ul className="sub-menu">
          <li className="icon-item item-space-horizontal" title={t('SPACE_HORIZONAL')}>
            <a onClick={onSpaceHorizontal} />
          </li>
          <li className="icon-item item-space-vertical" title={t('SPACE_VERTICAL')}>
            <a onClick={onSpaceVertical} />
          </li>
        </ul>
      </li>
      <li className="icon-item item-clear-all" title={t('CLEAR_ALL')}>
        <a onClick={onClearAll} />
      </li>
    </ul>

  );
};

MultipleActionBar.propTypes = {
  actions: PropTypes.shape({
    onAlignLeft: PropTypes.func,
    onAlignCenter: PropTypes.func,
    onAlignRight: PropTypes.func,
    onAlignTop: PropTypes.func,
    onAlignMiddle: PropTypes.func,
    onAlignBottom: PropTypes.func,
    onSpaceHorizontal: PropTypes.func,
    onSpaceVertical: PropTypes.func
  }).isRequired,
  selectedElementArray: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default MultipleActionBar;
