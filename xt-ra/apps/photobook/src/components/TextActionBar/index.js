import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import { getDropdownNode, showActionOnTop } from '../../utils/actionbar.js';
import {
  PER_ACTION_BUTTON_WIDTH,
  PER_ACTION_BUTTON_HEIGHT
} from '../../contants/strings.js';
import { transform } from '../../../../common/utils/transform';
import TooltipContainer from '../TooltipContainer';

import './index.scss';

class TextActionBar extends Component {
  constructor(props) {
    super(props);

    this.onEditText = this.onEditText.bind(this);

    this.onBringToFront = this.onBringToFront.bind(this);
    this.onSendToback = this.onSendToback.bind(this);
    this.onBringForward = this.onBringForward.bind(this);
    this.onSendBackward = this.onSendBackward.bind(this);

    this.onRemoveText = this.onRemoveText.bind(this);

    this.showLayerDropdown = this.showLayerDropdown.bind(this);
    this.hideAllDropdown = this.hideAllDropdown.bind(this);
    this.computedDropdownNodeTop = this.computedDropdownNodeTop.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.showActionOnTop = () => showActionOnTop(this);
    this.state = {
      isShowLayerDropdown: false,
      showActionOnTop: false
    };
  }

  onEditText() {
    const { actions, element } = this.props;
    actions.onEditText(element);
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

  onRemoveText() {
    const { actions, element } = this.props;
    actions.onRemoveImage(element);
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

  stopEvent(e) {
    e.stopPropagation();
  }

  onMouseOver() {
    this.showActionOnTop();
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
  componentWillReceiveProps() {
    if (this.componentRef) {
      this.showActionOnTop();
    }
  }

  componentDidMount() {
    this.showActionOnTop();
  }

  render() {
    const { element, t, isSpine, degree, containerRect, page } = this.props;

    const textActionClass = classNames('text-action-bar', {
      'has-layer': isSpine
    });

    const { x, y, width, height, offsetTop = 30 } = page;
    const { left, top } = containerRect;

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

    const addTop = degree > 170 && degree < 190 ? 20 : 0;

    const actionbarPosition = {
      left: transformedRect.width / 2 + transformedRect.left,
      top: transformedRect.top + transformedRect.height + addTop
    };

    const actionbarWidth = 3 * PER_ACTION_BUTTON_WIDTH;

    if (!isSpine) {
      if (actionbarPosition.left <= x + actionbarWidth / 2) {
        actionbarPosition.left = x + actionbarWidth / 2;
      } else if (actionbarPosition.left + actionbarWidth / 2 >= width) {
        actionbarPosition.left = width - actionbarWidth / 2;
      }

      if (actionbarPosition.top <= y) {
        actionbarPosition.top = y;
      } else if (
        actionbarPosition.top + PER_ACTION_BUTTON_HEIGHT >=
        height + offsetTop
      ) {
        actionbarPosition.top = height + offsetTop;
      } else {
        // actionbar需求与框有一定的间隙.
        actionbarPosition.top += 15;
      }
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
          className={textActionClass}
          style={style}
          onMouseDown={this.stopEvent}
          onMouseOver={this.onMouseOver}
          ref={(c) => {
            this.componentRef = c;
          }}
        >
          <li className="icon-item item-edit">
            <a onClick={this.onEditText} data-tip={t('EDIT_TEXT')} />
          </li>
          {isSpine ? null : (
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
          )}
          <li className="icon-item item-clear">
            <a onClick={this.onRemoveText} data-tip={t('CLEAR_TEXT')} />
          </li>
        </ul>
      </TooltipContainer>
    );
  }
}

TextActionBar.propTypes = {
  actions: PropTypes.shape({
    onEditText: PropTypes.func,
    onRemoveText: PropTypes.func,
    onBringToFront: PropTypes.func,
    onSendToback: PropTypes.func,
    onBringForward: PropTypes.func,
    onSendBackward: PropTypes.func
  }).isRequired,
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  t: PropTypes.func.isRequired
};

export default TextActionBar;
