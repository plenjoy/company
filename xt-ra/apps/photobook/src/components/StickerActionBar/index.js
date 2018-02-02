import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import { getDropdownNode, showActionOnTop } from '../../utils/actionbar.js';
import { PER_ACTION_BUTTON_HEIGHT } from '../../contants/strings.js';
import { transform } from '../../../../common/utils/transform';
import TooltipContainer from '../TooltipContainer';

import './index.scss';

class StickerActionBar extends Component {
  constructor(props) {
    super(props);

    this.onEditImage = this.onEditImage.bind(this);
    this.onRotateImage = this.onRotateImage.bind(this);
    this.onFlipImage = this.onFlipImage.bind(this);
    this.onExpandToFullSheet = this.onExpandToFullSheet.bind(this);
    this.onExpandToLeftPage = this.onExpandToLeftPage.bind(this);
    this.onExpandToRightPage = this.onExpandToRightPage.bind(this);
    this.onBringToFront = this.onBringToFront.bind(this);
    this.onSendToback = this.onSendToback.bind(this);
    this.onBringForward = this.onBringForward.bind(this);
    this.onSendBackward = this.onSendBackward.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onEditImage = this.onEditImage.bind(this);

    this.showExpandDropdown = this.showExpandDropdown.bind(this);
    this.showLayerDropdown = this.showLayerDropdown.bind(this);
    this.hideAllDropdown = this.hideAllDropdown.bind(this);
    this.computedDropdownNodeTop = this.computedDropdownNodeTop.bind(this);
    this.showActionOnTop = () => showActionOnTop(this);
    this.onMouseOver = this.onMouseOver.bind(this);

    this.state = {
      isShowExpandDropdown: false,
      isShowLayerDropdown: false,
      showActionOnTop: false
    };
  }

  onEditImage() {
    const { actions, element } = this.props;
    actions.onEditImage(element);
  }

  onRotateImage() {
    const { actions, element } = this.props;
    actions.onRotateImage(element);
  }

  onFlipImage() {
    const { actions, element } = this.props;
    actions.onFlipImage(element);
  }

  onExpandToFullSheet() {
    const { actions, element } = this.props;
    actions.onExpandToFullSheet(element);
  }

  onExpandToLeftPage() {
    const { actions, element } = this.props;
    actions.onExpandToLeftPage(element);
  }

  onExpandToRightPage() {
    const { actions, element } = this.props;
    actions.onExpandToRightPage(element);
  }

  onBringToFront() {
    const { actions, element } = this.props;
    actions.onBringToFront(element);
  }

  onSendToback() {
    const { actions, element } = this.props;
    actions.onSendToback(element);
  }

  onBringForward() {
    const { actions, element } = this.props;
    actions.onBringForward(element);
  }

  onSendBackward() {
    const { actions, element } = this.props;
    actions.onSendBackward(element);
  }

  onFilter() {
    const { actions, element } = this.props;
    actions.onFilter(element);
  }

  onRemoveImage() {
    const { actions, element } = this.props;
    actions.onRemoveImage(element);
  }

  showExpandDropdown() {
    this.setState({
      isShowExpandDropdown: true
    });
  }

  showLayerDropdown() {
    this.setState({
      isShowLayerDropdown: true
    });
  }

  hideAllDropdown() {
    this.setState({
      isShowExpandDropdown: false,
      isShowLayerDropdown: false
    });
  }

  computedDropdownNodeTop(e) {
    const { showActionOnTop } = this.state;
    const dropdownNode = getDropdownNode(e);
    if (showActionOnTop) {
      const allDropdownHeight = dropdownNode.allDropdownHeight;
      dropdownNode.ulNode.style.top = `${-allDropdownHeight - 2}px`;
    } else {
      dropdownNode.ulNode.style.top = '';
    }
  }
  stopEvent(e) {
    e.stopPropagation();
  }

  onMouseOver() {
    this.showActionOnTop();
  }
  componentWillReceiveProps() {
    if (this.componentRef) {
      this.showActionOnTop();
    }
  }

  componentDidMount() {
    this.showActionOnTop();
  }

  render() {
    const { element, t, degree, containerRect, page } = this.props;

    const { x, y, width, height, offsetTop = 30 } = page;
    const { left, top } = containerRect;

    const addTop = degree > 140 && degree < 200 ? 20 : 0;

    const photoActionBarClassName = classNames('photo-action-bar', {
      'has-sticker': true
    });

    const computed = element.get('computed');
    const transformedRect = transform(
      {
        x: computed.get('left'),
        y: computed.get('top'),
        width: computed.get('width'),
        height: computed.get('height')
      },
      degree
    );

    const actionbarWidth = transformedRect.width;
    const actionbarPosition = {
      left: transformedRect.width / 2 + transformedRect.left,
      top: transformedRect.top + transformedRect.height + addTop
    };

    if (actionbarPosition.left <= x + actionbarWidth / 2) {
      actionbarPosition.left = x + actionbarWidth / 2;
    } else if (actionbarPosition.left + actionbarWidth / 2 >= width) {
      actionbarPosition.left = width - actionbarWidth / 2;
    } else {
      // actionbar需求与框有一定的间隙.
      actionbarPosition.top += 15;
    }

    if (actionbarPosition.top <= y) {
      actionbarPosition.top = y;
    } else if (actionbarPosition.top >= height + offsetTop) {
      actionbarPosition.top = height + offsetTop;
    }

    const style = {
      left: `${actionbarPosition.left + left}px`,
      top: `${actionbarPosition.top + top}px`
    };

    const { isShowLayerDropdown } = this.state;

    const layerDropdownStyle = classNames('sub-menu', {
      show: isShowLayerDropdown
    });

    return (
      <TooltipContainer>
        <ul
          className={photoActionBarClassName}
          style={style}
          onMouseDown={this.stopEvent}
          onMouseOver={this.onMouseOver}
          ref={(c) => {
            this.componentRef = c;
          }}
        >
          <li
            className="icon-item item-layer"
            onMouseOver={this.showLayerDropdown}
            onMouseOut={this.hideAllDropdown}
            onMouseEnter={this.computedDropdownNodeTop}
          >
            <a />
            <ul className={layerDropdownStyle} onClick={this.hideAllDropdown}>
              <li className="item-to-front">
                <a onClick={this.onBringToFront}>{t('BRING_TO_FRONT')}</a>
              </li>
              <li className="item-to-back">
                <a onClick={this.onSendToback}>{t('SEND_TO_BACK')}</a>
              </li>
              <li className="item-forward">
                <a onClick={this.onBringForward}>{t('BRING_FORWARD')}</a>
              </li>
              <li className="item-backward">
                <a onClick={this.onSendBackward}>{t('SEND_BACKWARD')}</a>
              </li>
            </ul>
          </li>
          <li className="icon-item item-clear">
            <a onClick={this.onRemoveImage} data-tip={t('CLEAR_ITEM')} />
          </li>
        </ul>
      </TooltipContainer>
    );
  }
}
export default StickerActionBar;
