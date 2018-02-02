import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { translate } from 'react-translate';
import { cameoShapeTypes } from '../../contants/strings';

import * as handler from './handler';
import './index.scss';

class CameoActionBar extends Component {
  constructor(props) {
    super(props);

    this.onCrop = (event) => handler.onCrop(this, event);
    this.onRotate = (event) => handler.onRotate(this, event);
    this.onFlip = (event) => handler.onFlip(this, event);
  }

  render() {
    const { t, actions, data } = this.props;
    const { className, style, highlightIcons, disabledIcons, roundLabel, hasImage } = data;
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
      round: roundHightlight ? 'highlight' : '',
    };

    const rectClass = classNames('icon-item item-rect', {
      'hide': rectDisable
    });

    const roundClass = classNames('icon-item item-round', {
      'hide': roundDisable
    });

    const sClass = classNames('icon-item item-small', {
      'hide': sDisable
    });

    const mClass = classNames('icon-item item-medium', {
      'hide': mDisable
    });

    const lClass = classNames('icon-item item-large', {
      'hide': lDisable
    });

    const removeClass = classNames('icon-item item-clear', {
      'hide': removeDisable
    });

    return (
      <ul style={style} className="cameo-action-bar" data-html2canvas-ignore="true">
        {/* crop  */}
        <li className="icon-item item-crop" title={t('CROP_ITEM')}>
          <label>
            <input type="checkbox" disabled={cropDisable} />
            <a onClick={this.onCrop}></a>
          </label>
        </li>

        {/* rotate  */}
        <li className="icon-item item-rotate" title={t('ROTATE_ITEM')}>
          <label>
            <input type="checkbox" disabled={rotateDisable} />
            <a onClick={this.onRotate}></a>
          </label>
        </li>

        {/* flip  */}
        {/*
          <li className="icon-item item-flip" title={t('FLIP_ITEM')}>
            <label>
              <input type="checkbox" disabled={flipDisable} />
              <a onClick={this.onFlip}></a>
            </label>
          </li>
        */}

        {/* rect  */}
        <li className={rectClass} title={t('RECT_ITEM')}>
          <label>
            <input type="checkbox" className={checkboxClassNames.rect} disabled={rectDisable} />
            <a onClick={actions.onRect}></a>
          </label>
        </li>

        {/* round  */}
        <li className={roundClass} title={roundLabel === cameoShapeTypes.round ? t('ROUND_ITEM') : t('OVAL_ITEM')}>
          <label>
            <input type="checkbox"  className={checkboxClassNames.round} disabled={roundDisable} />
            <a onClick={actions.onRound}></a>
          </label>
        </li>

        {/*

          <li className={sClass} title={t('SMALL_ITEM')}>
            <label>
              <input type="checkbox" className={checkboxClassNames.S} />
              <a onClick={actions.onSmall}></a>
            </label>
          </li>


          <li className={mClass} title={t('MIDDLE_ITEM')}>
            <label>
              <input type="checkbox" className={checkboxClassNames.M} />
              <a onClick={actions.onMedium}></a>
            </label>
          </li>


          <li className={lClass} title={t('LARGE_ITEM')}>
            <label>
              <input type="checkbox" className={checkboxClassNames.L} />
              <a onClick={actions.onLarge}></a>
            </label>
          </li>
        */}

        {/* clear  */}
        <li className={removeClass} title={hasImage ? t('CLEAR_IMAGE') : t('CLEAR_ITEM')}>
          <label>
            <input type="checkbox" />
            <a onClick={actions.onClear}></a>
          </label>
        </li>
      </ul>
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

CameoActionBar.defaultProps = {
};

export default translate('CameoActionBar')(CameoActionBar);

