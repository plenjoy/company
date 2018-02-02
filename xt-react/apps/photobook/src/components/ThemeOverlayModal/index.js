import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { getImgRatioFromProjectSize } from '../../../../common/utils/helper';
import { translate } from 'react-translate';

import XModal from '../../../../common/ZNOComponents/XModal';
import ThemeOverlayImg from '../../components/themeOverlayImg';
import ReactSwipe from 'react-swipe';

import './index.scss';

class ThemeOverlayModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeCurrentPos: null,
      swipeTotalNum: null
    };
    this.closeModal = this.closeModal.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.getSwipePos = this.getSwipePos.bind(this);
  }

  componentWillReceiveProps(nextProps) {
      // themeOverlayModal = nextProps.themeOverlayModal
  }

  getSwipePos() {
    const currentPos = this.refs.reactSwipe.getPos();
    const totalNum = this.refs.reactSwipe.getNumSlides();
    this.setState({
      swipeCurrentPos: currentPos,
      swipeTotalNum: totalNum
    });
  }
  componentDidMount() {
    this.getSwipePos();
  }

  onTabChange(tabIndex) {
    this.setState({
      currentTabIndex: tabIndex
    });
  }

  closeModal() {
    const { closeModal } = this.props;
    closeModal();
  }

  next() {
    this.refs.reactSwipe.next();
    this.getSwipePos();
  }

  prev() {
    this.refs.reactSwipe.prev();
    this.getSwipePos();
  }


  render() {
    const { isShown, t, themeOverlayModal } = this.props;
    const { swipeCurrentPos, swipeTotalNum } = this.state;
    const currentTheme = themeOverlayModal.get('currentTheme');
    const onApplyClick = themeOverlayModal.get('onApplyClick');
    const size = currentTheme.get('size');
    const imgRatio = getImgRatioFromProjectSize(size);
    const screenshotsList = currentTheme.get('screenshots');
    const themeTitle = currentTheme.get('themeTitle');
    const modalStyle = {
      height: '620px',
       width: `${(360 / imgRatio)+120}px`
    };
    const imgContentStyle ={
       height: '380px',
       width: `${(360 / imgRatio)+40}px`
    }
    const screenshotStyle ={
        height: '360px',
        width: `${(360/ imgRatio)}px`
    }

    return (
      <XModal
        className="theme-over-modal"
        onClosed={this.closeModal}
        styles={modalStyle}
        opened={isShown}
      >
        <div className="content-modal">
          <div className="screenshot-content">
            <div className="screenshot-title">{t('PREVIEW')}</div>
            <div className="screenshot-text" >{themeTitle}</div>
          </div>
          <div className="img-content"  style={imgContentStyle} >
            <div  className='swipe-content' style={screenshotStyle} >
            <ReactSwipe
              ref="reactSwipe"
              className="carousel"
              swipeOptions={{
                continuous: false
              }}
            >
              {
              screenshotsList.map((screenshot) => {
                return (<div className="item" style={screenshotStyle}>
                  <ThemeOverlayImg
                    src={screenshot}
                  />
                </div>
                );
              })
            }
            </ReactSwipe>
            </div>
          </div>
          {
            (swipeCurrentPos !== 0) ? <div className="pre" onClick={this.prev} /> : null
          }
          {
            (swipeCurrentPos !== (swipeTotalNum - 1)) ? <div className="next" onClick={this.next}/> : null

          }
          <div className="apply" onClick={onApplyClick.bind(this, currentTheme)}>{t('APPLY')}</div>
        </div>

      </XModal>
    );
  }
}


export default translate('ThemeOverlay')(ThemeOverlayModal);
