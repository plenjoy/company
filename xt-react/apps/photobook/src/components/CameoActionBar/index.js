import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { translate } from 'react-translate';
import {
  addEventListener,
  removeEventListener
} from '../../../../common/utils/events';
import { cameoShapeTypes } from '../../contants/strings';
import TooltipContainer from '../TooltipContainer';

import * as handler from './handler';
import './index.scss';

class CameoActionBar extends Component {
  constructor(props) {
    super(props);

    this.onCrop = (element, event) => handler.onCrop(this, element, event);
    this.onRotate = (element, event) => handler.onRotate(this, element, event);
    this.onFlip = (element, event) => handler.onFlip(this, element, event);
    this.stopEvent = event => handler.stopEvent(event);
  }

  render() {
    const {
      t,
      actions,
      data,
      highlightIcons,
      disabledIcons,
      roundLabel,
      containerRect,
      element,
      cameoRect
    } = this.props;
    const {
      largeHightlight,
      mediumHightlight,
      smallHightlight,
      rectHightlight,
      roundHightlight
    } = highlightIcons;
    const {
      cropDisable,
      rotateDisable,
      flipDisable,
      rectDisable,
      roundDisable,
      sDisable,
      mDisable,
      lDisable,
      removeDisable
    } = disabledIcons;

    const checkboxClassNames = {
      L: largeHightlight ? 'highlight' : '',
      M: mediumHightlight ? 'highlight' : '',
      S: smallHightlight ? 'highlight' : '',
      rect: rectHightlight ? 'highlight' : '',
      round: roundHightlight ? 'highlight' : ''
    };

    const rectClass = classNames('icon-item item-rect', {
      hide: rectDisable
    });

    const roundClass = classNames('icon-item item-round', {
      hide: roundDisable
    });

    const sClass = classNames('icon-item item-small', {
      hide: sDisable
    });

    const mClass = classNames('icon-item item-medium', {
      hide: mDisable
    });

    const lClass = classNames('icon-item item-large', {
      hide: lDisable
    });

    const removeClass = classNames('icon-item item-clear', {
      hide: removeDisable
    });

    const { left, top } = containerRect;

    const removeWidth =
      (Number(rectDisable) +
        Number(roundDisable) +
        Number(sDisable) +
        Number(mDisable) +
        Number(lDisable) +
        Number(removeDisable)) *
      50;

    const style = {
      left: `${cameoRect.left + cameoRect.width / 2 + left}px`,
      top: `${15 + cameoRect.top + cameoRect.height + top}px`,
      width: `${450 - removeWidth}px`
    };

    const onRect = () => {
      actions.onRect(element);
    };

    const onRound = () => {
      actions.onRound(element);
    };

    const onSmall = () => {
      actions.onSmall(element);
    };

    const onMedium = () => {
      actions.onMedium(element);
    };

    const onLarge = () => {
      actions.onLarge(element);
    };

    const onClear = () => {
      actions.onClear(element);
    };

    return (
      <TooltipContainer>
        <ul
          style={style}
          className="cameo-action-bar"
          onMouseDown={this.stopEvent}
        >
          {/* crop  */}
          <li className="icon-item item-crop" data-tip={t('CROP_ITEM')}>
            <label>
              <input type="checkbox" disabled={cropDisable} />
              <a onClick={this.onCrop} />
            </label>
          </li>

          {/* rotate  */}
          <li className="icon-item item-rotate" data-tip={t('ROTATE_ITEM')}>
            <label>
              <input type="checkbox" disabled={rotateDisable} />
              <a onClick={this.onRotate} />
            </label>
          </li>

          {/* flip  */}
          <li className="icon-item item-flip" data-tip={t('FLIP_ITEM')}>
            <label>
              <input type="checkbox" disabled={flipDisable} />
              <a onClick={this.onFlip} />
            </label>
          </li>

          {/* rect  */}
          <li className={rectClass} data-tip={t('RECT_ITEM')}>
            <label>
              <input
                type="checkbox"
                className={checkboxClassNames.rect}
                disabled={rectDisable}
              />
              <a onClick={onRect} />
            </label>
          </li>

          {/* round  */}
          <li
            className={roundClass}
            data-tip={
              roundLabel === cameoShapeTypes.round
                ? t('ROUND_ITEM')
                : t('OVAL_ITEM')
            }
          >
            <label>
              <input
                type="checkbox"
                className={checkboxClassNames.round}
                disabled={roundDisable}
              />
              <a onClick={onRound} />
            </label>
          </li>

          {/* small  */}
          <li className={sClass} data-tip={t('SMALL_ITEM')}>
            <label>
              <input type="checkbox" className={checkboxClassNames.S} />
              <a onClick={onSmall} />
            </label>
          </li>

          {/* medium  */}
          <li className={mClass} data-tip={t('MIDDLE_ITEM')}>
            <label>
              <input type="checkbox" className={checkboxClassNames.M} />
              <a onClick={onMedium} />
            </label>
          </li>

          {/* large  */}
          <li className={lClass} data-tip={t('LARGE_ITEM')}>
            <label>
              <input type="checkbox" className={checkboxClassNames.L} />
              <a onClick={onLarge} />
            </label>
          </li>

          {/* clear  */}
          <li className={removeClass} data-tip={t('CLEAR_ITEM')}>
            <label>
              <input type="checkbox" />
              <a onClick={onClear} />
            </label>
          </li>
        </ul>
      </TooltipContainer>
    );
  }
}

CameoActionBar.propTypes = {
  actions: PropTypes.shape({
    onCrop: PropTypes.func,
    onRotate: PropTypes.func,
    onFlip: PropTypes.func,
    onRect: PropTypes.func,
    onRound: PropTypes.func,
    onSmall: PropTypes.func,
    onMedium: PropTypes.func,
    onLarge: PropTypes.func,
    onClear: PropTypes.func
  }),
  data: PropTypes.shape({
    className: PropTypes.string,
    style: PropTypes.object,
    highlight: PropTypes.shape({
      largeHightlight: PropTypes.bool,
      mediumHightlight: PropTypes.bool,
      smallHightlight: PropTypes.bool,
      rectHightlight: PropTypes.bool,
      roundHightlight: PropTypes.bool
    }),
    disabledIcons: PropTypes.shape({
      cropDisable: PropTypes.bool,
      rotateDisable: PropTypes.bool,
      flipDisable: PropTypes.bool
    })
  })
};

CameoActionBar.defaultProps = {};

export default translate('CameoActionBar')(CameoActionBar);
