import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import {
  PER_ACTION_BUTTON_WIDTH,
  PER_ACTION_BUTTON_HEIGHT
} from '../../contants/strings.js';
import { getDropdownNode, showActionOnTop } from '../../utils/actionbar.js';
import TooltipContainer from '../TooltipContainer';

import './index.scss';

class MultipleActionBar extends Component {
  constructor(props) {
    super(props);

    this.onAlignLeft = this.onAlignLeft.bind(this);
    this.onAlignCenter = this.onAlignCenter.bind(this);
    this.onAlignRight = this.onAlignRight.bind(this);
    this.onAlignTop = this.onAlignTop.bind(this);
    this.onAlignMiddle = this.onAlignMiddle.bind(this);
    this.onAlignBottom = this.onAlignBottom.bind(this);
    this.onSpaceHorizontal = this.onSpaceHorizontal.bind(this);
    this.onSpaceVertical = this.onSpaceVertical.bind(this);
    this.onClearAll = this.onClearAll.bind(this);

    this.onMatchWidestWidth = this.onMatchWidestWidth.bind(this);
    this.onMatchNarrowestWidth = this.onMatchNarrowestWidth.bind(this);
    this.onMatchTallestHeight = this.onMatchTallestHeight.bind(this);
    this.onMatchShortestHeight = this.onMatchShortestHeight.bind(this);
    this.onMatchFirstSelectWidthAndHeight = this.onMatchFirstSelectWidthAndHeight.bind(
      this
    );

    this.showHorizontalAlignDropdown = this.showHorizontalAlignDropdown.bind(
      this
    );
    this.showVerticalAlignDropdown = this.showVerticalAlignDropdown.bind(this);
    this.showSpaceDropdown = this.showSpaceDropdown.bind(this);
    this.showMatchSizeDropdown = this.showMatchSizeDropdown.bind(this);
    this.hideAllDropdown = this.hideAllDropdown.bind(this);
    this.showActionOnTop = () => showActionOnTop(this);
    this.computedDropdownNodeTop = this.computedDropdownNodeTop.bind(this);
    this.state = {
      isShowHorizontalAlignDropdown: false,
      isShowVerticalAlignDropdown: false,
      isShowSpaceDropdown: false,
      isShowMatchSizeDropdown: false,
      showActionOnTop: false
    };
  }

  onAlignLeft() {
    const { actions, selectedElementArray } = this.props;
    actions.onAlignLeft(selectedElementArray);
  }

  onAlignCenter() {
    const { actions, selectedElementArray } = this.props;
    actions.onAlignCenter(selectedElementArray);
  }

  onAlignRight() {
    const { actions, selectedElementArray } = this.props;
    actions.onAlignRight(selectedElementArray);
  }

  onAlignTop() {
    const { actions, selectedElementArray } = this.props;
    actions.onAlignTop(selectedElementArray);
  }

  onAlignMiddle() {
    const { actions, selectedElementArray } = this.props;
    actions.onAlignMiddle(selectedElementArray);
  }

  onAlignBottom() {
    const { actions, selectedElementArray } = this.props;
    actions.onAlignBottom(selectedElementArray);
  }

  onSpaceHorizontal() {
    const { actions, selectedElementArray } = this.props;
    actions.onSpaceHorizontal(selectedElementArray);
  }

  onSpaceVertical() {
    const { actions, selectedElementArray } = this.props;
    actions.onSpaceVertical(selectedElementArray);
  }

  onClearAll() {
    const { actions, selectedElementArray } = this.props;
    actions.onClearAll(selectedElementArray);
  }

  onMatchWidestWidth() {
    const { actions, selectedElementArray } = this.props;
    actions.onMatchWidestWidth(selectedElementArray);
  }

  onMatchNarrowestWidth() {
    const { actions, selectedElementArray } = this.props;
    actions.onMatchNarrowestWidth(selectedElementArray);
  }

  onMatchTallestHeight() {
    const { actions, selectedElementArray } = this.props;
    actions.onMatchTallestHeight(selectedElementArray);
  }

  onMatchShortestHeight() {
    const { actions, selectedElementArray } = this.props;
    actions.onMatchShortestHeight(selectedElementArray);
  }

  onMatchFirstSelectWidthAndHeight() {
    const { actions, selectedElementArray } = this.props;
    actions.onMatchFirstSelectWidthAndHeight(selectedElementArray);
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
  showHorizontalAlignDropdown(e) {
    this.setState({
      isShowHorizontalAlignDropdown: true
    });
  }

  showVerticalAlignDropdown(e) {
    this.setState({
      isShowVerticalAlignDropdown: true
    });
  }

  showSpaceDropdown(e) {
    this.setState({
      isShowSpaceDropdown: true
    });
  }

  showMatchSizeDropdown(e) {
    this.setState({
      isShowMatchSizeDropdown: true
    });
  }

  hideAllDropdown() {
    this.setState({
      isShowHorizontalAlignDropdown: false,
      isShowVerticalAlignDropdown: false,
      isShowSpaceDropdown: false,
      isShowMatchSizeDropdown: false
    });
  }

  stopEvent(e) {
    e.stopPropagation();
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
    const { t, containerRect, controlRect, degree, page } = this.props;

    const { x, y, offsetTop = 30 } = page;
    const pageWidth = page.width;
    const pageHeight = page.height;
    const { left, top } = containerRect;

    const { minPos, maxPos, width, height } = controlRect;

    const addTop = degree > 140 && degree < 200 ? 20 : 0;

    const actionbarWidth = 5 * PER_ACTION_BUTTON_WIDTH;

    const actionbarPosition = {
      left: width + minPos.x,
      top: maxPos.y + height + addTop
    };

    if (actionbarPosition.left <= x + actionbarWidth / 2) {
      actionbarPosition.left = x + actionbarWidth / 2;
    } else if (actionbarPosition.left + actionbarWidth / 2 >= pageWidth) {
      actionbarPosition.left = pageWidth - actionbarWidth / 2;
    }

    if (actionbarPosition.top <= y) {
      actionbarPosition.top = y;
    } else if (actionbarPosition.top >= pageHeight + offsetTop) {
      actionbarPosition.top = pageHeight + offsetTop;
    } else {
      // actionbar需求与框有一定的间隙.
      actionbarPosition.top += 15;
    }

    const style = {
      left: `${actionbarPosition.left + left}px`,
      top: `${actionbarPosition.top + top}px`
    };

    const {
      isShowHorizontalAlignDropdown,
      isShowVerticalAlignDropdown,
      isShowSpaceDropdown,
      isShowMatchSizeDropdown
    } = this.state;

    const horizontalAlignDropdownStyle = classNames('sub-menu', {
      show: isShowHorizontalAlignDropdown
    });

    const verticalAlignDropdownStyle = classNames('sub-menu', {
      show: isShowVerticalAlignDropdown
    });

    const spaceDropdownStyle = classNames('sub-menu', {
      show: isShowSpaceDropdown
    });

    const matchSizeDropdownStyle = classNames('sub-menu', {
      show: isShowMatchSizeDropdown
    });

    return (
      <TooltipContainer>
        <ul
          className="multiple-action-bar"
          style={style}
          onMouseDown={this.stopEvent}
          onMouseOver={this.showActionOnTop}
          ref={(c) => {
            this.componentRef = c;
          }}
        >
          <li
            className="icon-item item-align-horizontal"
            onMouseOver={this.showHorizontalAlignDropdown}
            onMouseOut={this.hideAllDropdown}
            onMouseEnter={this.computedDropdownNodeTop}
          >
            <a />
            <ul
              className={horizontalAlignDropdownStyle}
              onClick={this.hideAllDropdown}
            >
              <li
                className="icon-item item-align-left"
                data-tip={t('ALIGN_LEFT')}
                data-place="right"
              >
                <a onClick={this.onAlignLeft} />
              </li>
              <li
                className="icon-item item-align-center"
                data-tip={t('ALIGN_CENTER')}
                data-place="right"
              >
                <a onClick={this.onAlignCenter} />
              </li>
              <li
                className="icon-item item-align-right"
                data-tip={t('ALIGN_RIGHT')}
                data-place="right"
              >
                <a onClick={this.onAlignRight} />
              </li>
            </ul>
          </li>
          <li
            className="icon-item item-align-vertical"
            onMouseOver={this.showVerticalAlignDropdown}
            onMouseOut={this.hideAllDropdown}
            onMouseEnter={this.computedDropdownNodeTop}
          >
            <a />
            <ul
              className={verticalAlignDropdownStyle}
              onClick={this.hideAllDropdown}
            >
              <li
                className="icon-item item-align-top"
                data-tip={t('ALIGN_TOP')}
                data-place="right"
              >
                <a onClick={this.onAlignTop} />
              </li>
              <li
                className="icon-item item-align-middle"
                data-tip={t('ALIGN_MIDDLE')}
                data-place="right"
              >
                <a onClick={this.onAlignMiddle} />
              </li>
              <li
                className="icon-item item-align-bottom"
                data-tip={t('ALIGN_BOTTOM')}
                data-place="right"
              >
                <a onClick={this.onAlignBottom} />
              </li>
            </ul>
          </li>
          <li
            className="icon-item item-space"
            onMouseOver={this.showSpaceDropdown}
            onMouseOut={this.hideAllDropdown}
            onMouseEnter={this.computedDropdownNodeTop}
          >
            <a data-tip={t('SPACE_NEED_THREE_MORE_ELEMENTS')} data-place="top" />
            <ul className={spaceDropdownStyle} onClick={this.hideAllDropdown}>
              <li
                className="icon-item item-space-horizontal"
                data-tip={t('SPACE_HORIZONAL')}
                data-place="right"
              >
                <a onClick={this.onSpaceHorizontal} />
              </li>
              <li
                className="icon-item item-space-vertical"
                data-tip={t('SPACE_VERTICAL')}
                data-place="right"
              >
                <a onClick={this.onSpaceVertical} />
              </li>
            </ul>
          </li>
          <li
            className="icon-item item-match-size"
            onMouseOver={this.showMatchSizeDropdown}
            onMouseOut={this.hideAllDropdown}
            onMouseEnter={this.computedDropdownNodeTop}
          >
            <a />
            <ul
              className={matchSizeDropdownStyle}
              onClick={this.hideAllDropdown}
            >
              <li
                className="icon-item item-match-widest-width"
                data-tip={t('MATCH_WIDEST_WIDTH')}
                data-place="right"
              >
                <a onClick={this.onMatchWidestWidth} />
              </li>
              <li
                className="icon-item item-match-narrowest-width"
                data-tip={t('MATCH_NARROWEST_WIDTH')}
                data-place="right"
              >
                <a onClick={this.onMatchNarrowestWidth} />
              </li>
              <li
                className="icon-item item-match-tallest-height"
                data-tip={t('MATCH_TALLEST_HEIGHT')}
                data-place="right"
              >
                <a onClick={this.onMatchTallestHeight} />
              </li>
              <li
                className="icon-item item-match-shortest-height"
                data-tip={t('MATCH_SHORTEST_HEIGHT')}
                data-place="right"
              >
                <a onClick={this.onMatchShortestHeight} />
              </li>
              <li
                className="icon-item item-match-first-select-width-and-height"
                data-tip={t('MATCH_FIRST_SELECT_WIDTH_AND_HEIGHT')}
                data-place="right"
              >
                <a onClick={this.onMatchFirstSelectWidthAndHeight} />
              </li>
            </ul>
          </li>
          <li className="icon-item item-clear-all" data-tip={t('CLEAR_ALL')}>
            <a onClick={this.onClearAll} />
          </li>
        </ul>
      </TooltipContainer>
    );
  }
}

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
  selectedElementArray: PropTypes.instanceOf(Immutable.List).isRequired
};

export default MultipleActionBar;
