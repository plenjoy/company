import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import { addEventListener, removeEventListener } from '../../../../common/utils/events';

import './index.scss';

class ActionBar extends Component {
  constructor(props) {
    super(props);

    const { actions } = props;
    const { boundTrackerActions } = actions;

    // clean up面板的默认显示状态为不显示
    this.state = {
      isOpenedAddSheetPanel: false,
      isOpenedCleanUpPanel: false
    };

    this.showAddSheetPanel = this.showAddSheetPanel.bind(this);
    this.hideAddSheetPanel = this.hideAddSheetPanel.bind(this);

    this.showCleanUpPanel = this.showCleanUpPanel.bind(this);
    this.hideCleanUpPanel = this.hideCleanUpPanel.bind(this);

    this.showFlipPanel = this.showFlipPanel.bind(this);
    this.hideFlipPanel = this.hideFlipPanel.bind(this);

    this.hideAllPanel = this.hideAllPanel.bind(this);

    this.onBookSettingClick = () => {
      boundTrackerActions.addTracker('ClickBookSetting');
      actions.onDesignSetting();
    };

    this.onAddTextClick = () => {
      boundTrackerActions.addTracker('ClickAddText');
      actions.onAddText();
    };

    this.onAddFrameClick = () => {
      boundTrackerActions.addTracker('ClickAddFrame');
      actions.onAddFrame();
    };

    this.onSaveLayout = () => {
      actions.onSaveLayout();
    };

    this.onUndo = () => {
      const { data } = this.props;
      const { disableUndo } = data;

      !disableUndo && actions.onUndo();
    };

    this.onRedo = () => {
      const { data } = this.props;
      const { disableRedo } = data;

      !disableRedo && actions.onRedo();
    };

    // ctrl+z, ctrl+y键盘实现撤销还原.
    this.onKeypress = (event) => {
      const ev = event || window.event;

      // 如果按下了ctrl键
      if (ev.ctrlKey) {
        switch (ev.keyCode) {
          // z
          case 90: {
            this.onUndo();
            break;
          }
          // y
          case 89: {
            this.onRedo();
            break;
          }
          default: {
            break;
          }
        }
      }
    };

    addEventListener(document, 'keyup', this.onKeypress);
  }

  componentDidMount() {
    addEventListener(window, 'click', this.onHide);
  }

  componentWillUnmount() {
    removeEventListener(window, 'click', this.onHide);
    removeEventListener(document, 'keyup', this.onKeypress);
  }


  hideAddSheetPanel() {
    this.setState({
      isOpenedAddSheetPanel: false
    });
  }

  showCleanUpPanel() {
    this.setState({
      isOpenedCleanUpPanel: true
    });
  }

  hideCleanUpPanel() {
    this.setState({
      isOpenedCleanUpPanel: false
    });
  }

  showFlipPanel() {
    this.setState({
      isOpenedFlipPanel: true
    });
  }

  hideFlipPanel() {
    this.setState({
      isOpenedFlipPanel: false
    });
  }

  hideAllPanel() {
    this.hideAddSheetPanel();
    this.hideCleanUpPanel();
    this.hideFlipPanel();
  }

  getPanelHtml(nodes) {
    const html = [];

    nodes.forEach((v, i) => {
      const liStyle = classNames('sub-item', {
        disabled: v.disabled
      });
      html.push(
        <li key={i} className={liStyle} title="">
          <a onClick={v.action}>{v.title}</a>
        </li>
      );
    });

    return html;
  }

  showAddSheetPanel() {
    this.setState({
      isOpenedAddSheetPanel: true
    });
  }
  render() {
    const {
      className,
      t,
      actions,
      data
    } = this.props;

    const { boundTrackerActions } = actions;
    const {
      addSheetPanel,
      cleanUpPanel,
      disableAddText,
      disableAddFrame,
      disableAddSheet,
      disableFlip,
      disableSaveLayout,
      disableChangeBgColor,
      disableUndo,
      disableRedo,
      isPressBook
    } = data;

    const cName = classNames('action-bar', className);

    const {
      isOpenedCleanUpPanel,
      isOpenedAddSheetPanel,
      isOpenedFlipPanel
    } = this.state;
    const cleanUpPanelClasses = classNames('sub-panel', {
      show: isOpenedCleanUpPanel
    });
    const addSheetPanelClasses = classNames('sub-panel', {
      show: isOpenedAddSheetPanel
    });
    const flipPanelClasses = classNames('sub-panel', {
      show: isOpenedFlipPanel
    });

    const addSheetHtml = this.getPanelHtml([
      {
        title: t('ADD_BEFORE_THIS_PAGE'),
        action: () => {
          boundTrackerActions.addTracker('insertSheetBeforeCurrentSheet');
          actions.onAddBeforeThisPage();
        },
        disabled: addSheetPanel.disableAddToBefore
      },
      {
        title: t('ADD_AFTER_THIS_PAGE'),
        action: () => {
          boundTrackerActions.addTracker('insertSheetAfterCurrentSheet');
          actions.onAddAfterThisPage();
        },
        disabled: addSheetPanel.disableAddToAfter
      },
      {
        title: t('ADD_TO_BACK'),
        action: () => {
          boundTrackerActions.addTracker('insertSheetToEndOfTheBook');
          actions.onAddToBack();
        },
        disabled: addSheetPanel.disableAddToBack
      }
    ]);

    const cleanUpHtml = this.getPanelHtml([
      {
        title: t('CLEAN_ALL_IMAGES'),
        action: () => {
          boundTrackerActions.addTracker('ClickClearAllImage');
          actions.onClearAllImages();
        },
        disabled: cleanUpPanel.disableClearAllImages
      },
      {
        title: t('REMOVE_ALL_FRAMES'),
        action: () => {
          boundTrackerActions.addTracker('ClickRemoveAllFrames');
          actions.onRemoveAllFrames();
        },
        disabled: cleanUpPanel.disableRemoveAllFrames
      },
      {
        title: isPressBook ? t('REMOVE_PAGE') : t('REMOVE_SHEET'),
        action: () => {
          boundTrackerActions.addTracker('ClickRemoveSheet');
          actions.onRemoveSheet();
        },
        disabled: cleanUpPanel.disableRemoveSheet
      },
      {
        title: t('RESTART'),
        action: actions.onRestart,
        disabled: cleanUpPanel.disableRestart
      }
    ]);

    const flipHtml = this.getPanelHtml([
      {
        title: t('FLIP_HORIZONTALLY'),
        action: () => {
          boundTrackerActions.addTracker('ClickFlipSheetHorizontally');
          actions.onFlipHorizontally();
        },
        disabled: false
      },
      {
        title: t('FLIP_VERTICALLY'),
        action: () => {
          boundTrackerActions.addTracker('ClickFlipSheetVertically');
          actions.onFlipVertically();
        },
        disabled: false
      }
    ]);

    const addTextStyle = classNames('item', {
      disabled: disableAddText
    });

    const addFrameStyle = classNames('item', {
      disabled: disableAddFrame
    });

    const flipStyle = classNames('item', {
      disabled: disableFlip
    });

    const addSheetStyle = classNames('item', {
      disabled: disableAddSheet
    });

    const saveLayoutStyle = classNames('item', {
      disabled: disableSaveLayout
    });
    const changeBgColor = classNames('item', {
      disabled: disableChangeBgColor
    });

    // undo/redo
    const undoStyle = classNames('icon-undo', {
      disabled: disableUndo
    });

    const redoStyle = classNames('icon-redo', {
      disabled: disableRedo
    });


    return (
      <div className="action-bar-wrap">
        <ul className={cName}>
          <li className="item" title={t('DESIGN_SETTING')}>
            <a className="icon-book-setting" onClick={this.onBookSettingClick} />
          </li>

          <li className="item" title={t('AUTO_FILL')}>
            <a className="icon-auto-fill" onClick={actions.onAutoFill} />
          </li>

          <li className={changeBgColor} title={t('CHANGE_BACKGROUND_COLOR')}>
            <a className="icon-change-bgcolor" onClick={actions.onChangeBgColor} />
          </li>
          <li className={addTextStyle} title={t('ADD_TEXT')}>
            <a className="icon-add-text" onClick={this.onAddTextClick} />
          </li>
          <li className={addFrameStyle} title={t('ADD_FRAME')}>
            <a className="icon-add-frame" onClick={this.onAddFrameClick} />
          </li>
          <li
            className={flipStyle}
            onMouseOver={this.showFlipPanel}
            onMouseOut={this.hideFlipPanel}
          >
            <a className="icon-flip" />
            <ul className={flipPanelClasses} onClick={this.hideAllPanel}>
              {flipHtml}
            </ul>
          </li>

          <li
            className={addSheetStyle}
            onMouseOver={this.showAddSheetPanel}
            onMouseOut={this.hideAddSheetPanel}
          >
            <a className="icon-add-sheet" />
            <ul className={addSheetPanelClasses} onClick={this.hideAllPanel}>
              {addSheetHtml}
            </ul>
          </li>

          <li className='item' title={t('UNDO')}>
            <a className={undoStyle} onClick={this.onUndo} />
          </li>

          <li className='item' title={t('REDO')}>
            <a className={redoStyle} onClick={this.onRedo} />
          </li>

          <li
            className="item"
            onMouseOver={this.showCleanUpPanel}
            onMouseOut={this.hideCleanUpPanel}
          >
            <a className="icon-clean-up" />
            <ul className={cleanUpPanelClasses} onClick={this.hideAllPanel}>
              {cleanUpHtml}
            </ul>
          </li>

          <li className={saveLayoutStyle} title={t('SAVE_LAYOUT')}>
            <a className="icon-save-layout" onClick={this.onSaveLayout} />
          </li>
        </ul>
      </div>
    );
  }
}

ActionBar.propTypes = {
  actions: PropTypes.shape({
    onDesignSetting: PropTypes.func.isRequired,
    onAutoFill: PropTypes.func.isRequired,
    onAddText: PropTypes.func.isRequired,
    onAddFrame: PropTypes.func.isRequired,
    onFlipHorizontally: PropTypes.func.isRequired,
    onFlipVertically: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onClearAllImages: PropTypes.func.isRequired,
    onRemoveAllFrames: PropTypes.func.isRequired,
    onRemoveSheet: PropTypes.func.isRequired,
    onRestart: PropTypes.func.isRequired,
    onAddToFront: PropTypes.func.isRequired,
    onAddToBack: PropTypes.func.isRequired,
    onAddAfterThisPage: PropTypes.func.isRequired,
    onAddBeforeThisPage: PropTypes.func.isRequired
  }).isRequired,
  data: PropTypes.shape({
    disableAddText: PropTypes.bool,
    disableAddFrame: PropTypes.bool,
    disableFlip: PropTypes.bool,
    disableAddSheet: PropTypes.bool,
    disableUndo: PropTypes.bool,
    disableRedo: PropTypes.bool,
    addSheetPanel: PropTypes.shape({
      disableAddToFront: PropTypes.bool,
      disableAddToBack: PropTypes.bool,
      disableAddToAfter: PropTypes.bool,
      disableAddToBefore: PropTypes.bool
    }),
    cleanUpPanel: PropTypes.shape({
      disableClearAllImages: PropTypes.bool,
      disableRemoveAllFrames: PropTypes.bool,
      disableRemoveSheet: PropTypes.bool,
      disableRestart: PropTypes.bool
    }),
    isPressBook: PropTypes.bool
  })
};

ActionBar.defaultProps = {
  data: {
    addSheetPanel: {
      disableAddToFront: false,
      disableAddToBack: false,
      disableAddToAfter: false,
      disableAddToBefore: false
    },
    cleanUpPanel: {
      disableClearAllImages: false,
      disableRemoveAllFrames: false,
      disableRemoveSheet: false,
      disableRestart: false
    }
  }
};

export default translate('ActionBar')(ActionBar);
