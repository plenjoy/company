import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import { getDropdownNode, showActionOnTop } from '../../utils/actionbar.js';
import { transform } from '../../../../common/utils/transform';
import TooltipContainer from '../TooltipContainer';

import './index.scss';

class BackgroundActionBar extends Component {
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
    const { element, t, degree, containerRect } = this.props;

    const photoActionBarClassName = classNames('photo-action-bar', {
      'has-background': true
    });

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

    const style = {
      left: `${transformedRect.width / 2 + transformedRect.left + left}px`,
      top: `${transformedRect.top +
        transformedRect.height +
        15 +
        top +
        addTop}px`
    };

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
          <li className="icon-item item-clear">
            <a onClick={this.onRemoveImage} data-tip={t('CLEAR_ITEM')} />
          </li>
        </ul>
      </TooltipContainer>
    );
  }
}
export default BackgroundActionBar;
