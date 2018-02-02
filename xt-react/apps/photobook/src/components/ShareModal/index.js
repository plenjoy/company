import classNames from 'classnames';
import { translate } from 'react-translate';
import React, { Component, PropTypes } from 'react';
import ClipboardButton from 'react-clipboard.js';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';

import TextPositionTabs from '../TextPositionTabs/';

import './index.scss';

class ShareModal extends Component {
  constructor(props) {
    super(props);

    this.onTabChange = this.onTabChange.bind(this);
    this.resetCopiedIndex = this.resetCopiedIndex.bind(this);
    this.changeShareSize = this.changeShareSize.bind(this);
    this.closeModal = this.closeModal.bind(this);

    const { znoUrl, anonymousUrl } = this.props;
    this.state = {
      znoUrl,
      anonymousUrl,
      embedCode: '',
      currentTabIndex: 0,
      copiedIndex: 0,
      selectedShareSize: 'large'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.productType !== nextProps.productType||
      this.props.projectId !== nextProps.projectId) {
      const { baseUrl, projectId, productType, getShareUrls } = nextProps;
      if (baseUrl && projectId != -1 && productType) {
        getShareUrls(baseUrl, projectId, productType);
      }
    }

    if (this.props.znoUrl !== nextProps.znoUrl ||
      this.props.anonymousUrl !== nextProps.anonymousUrl) {
      this.setState({
        znoUrl: nextProps.znoUrl,
        anonymousUrl: nextProps.anonymousUrl.replace(/\/\/prod/, '/prod'),
        embedCode: `<iframe src="${nextProps.znoUrl}" width="800px" height="461px"></iframe>`
      });
    }
  }

  componentDidMount() {
    const { baseUrl, projectId, productType, getShareUrls } = this.props;
    if (baseUrl && projectId != -1 && productType) {
      getShareUrls(baseUrl, projectId, productType);
    }
  }

  onTabChange(tabIndex) {
    this.setState({
      currentTabIndex: tabIndex
    });
  }

  closeModal() {
    const { closeShareModal } = this.props;
    const newEmbedCode = this.state.embedCode
        .replace(/width="[0-9]{3}px"/, 'width="800px"')
        .replace(/height="[0-9]{3}px"/, 'height="461px"');
    closeShareModal();
    this.setState({
      currentTabIndex: 0,
      copiedIndex: 0,
      selectedShareSize: 'large',
      embedCode: newEmbedCode
    });
  }

  changeShareSize(sizeString) {
    if (this.state.selectedShareSize !== sizeString) {
      const sizeMap = {
        large: [800, 461],
        medium: [600, 363],
        small: [400, 266]
      };
      const newEmbedCode = this.state.embedCode
        .replace(/width="[0-9]{3}px"/, `width="${sizeMap[sizeString][0]}px"`)
        .replace(/height="[0-9]{3}px"/, `height="${sizeMap[sizeString][1]}px"`)
      ;
      this.setState({
        selectedShareSize: sizeString,
        embedCode: newEmbedCode,
        copiedIndex: 0
      });
    }
  }

  resetCopiedIndex(copyIndex) {
     this.setState({
       copiedIndex: copyIndex
     });
  }


  render() {
    const { isShown, t } = this.props;
    const tabList = [t('SHAREURL'), t('EMBEDCODE')];
    const initTabIndex = this.state.currentTabIndex;
    const shareURLWrap = classNames('share-url-wrap', { 'show': this.state.currentTabIndex ===0 });
    const shareEmbedWrap = classNames('share-embed-wrap', { 'show': this.state.currentTabIndex ===1 });
    const copyTip1 = classNames({ 'show' : this.state.copiedIndex === 1 });
    const copyTip2 = classNames({ 'show' : this.state.copiedIndex === 2 });
    const copyTip3 = classNames({ 'show' : this.state.copiedIndex === 3 });
    return (
      <XModal
        className="share-modal"
        onClosed={this.closeModal}
        opened={isShown}
      >
        <p className="modal-title">{t('TITLE')}</p>
        <TextPositionTabs
          initTabIndex={initTabIndex}
          onTabChange={this.onTabChange}
          tabList={tabList}
        />
        <div className={shareURLWrap}>
          <div className="znoUrl-wrap">
            <h3 className="urltype">{t('ZNO_URL')}</h3>
            <div className="position-reference">
              <input
                type="text"
                className="url-text"
                value={this.state.znoUrl}
                disabled="true"
              />
              <ClipboardButton
                className="copy-button"
                onSuccess={this.resetCopiedIndex.bind(this, 1)}
                data-clipboard-text={this.state.znoUrl}
              >
                {t('COPY')}
              </ClipboardButton>
              <span className={copyTip1}>URL has copied to clipboard</span>
            </div>
          </div>
          <div className="anonymousUrl-wrap">
            <h3 className="urltype">{t('ANONYMOUS_URL')}</h3>
            <div className="position-reference">
              <input
                type="text"
                className="url-text"
                value={this.state.anonymousUrl}
                disabled="true"
              />
              <ClipboardButton
                className="copy-button"
                onSuccess={this.resetCopiedIndex.bind(this, 2)}
                data-clipboard-text={this.state.anonymousUrl}
              >
                {t('COPY')}
              </ClipboardButton>
              <span className={copyTip2}>URL has copied to clipboard</span>
            </div>
          </div>
        </div>
        <div className={shareEmbedWrap}>
          <div className="share-size-wrap">
            <div
              className="size-item-wrap fl"
              onClick={this.changeShareSize.bind(this, 'large')}
            >
              <input
                checked={this.state.selectedShareSize === 'large'}
                type="radio"
                name="embed-size"
                id="large-size"
              />
              <label htmlFor="large-size">{t('LARGE')} <span>(800x461)</span></label>
            </div>
            <div
              className="size-item-wrap fr"
              onClick={this.changeShareSize.bind(this, 'small')}
            >
              <input
                checked={this.state.selectedShareSize === 'small'}
                type="radio"
                name="embed-size"
                id="small-size"
              />
              <label htmlFor="small-size">{t('SMALL')} <span>(400x266)</span></label>
            </div>
            <div
              className="size-item-wrap"
              onClick={this.changeShareSize.bind(this, 'medium')}
            >
              <input
                checked={this.state.selectedShareSize === 'medium'}
                type="radio"
                name="embed-size"
                id="medium-size"
              />
              <label htmlFor="medium-size">{t('MEDIUM')} <span>(600x363)</span></label>
            </div>
          </div>
          <div className="embed-code-wrap">
            <h3 className="urltype">{t('EMBEDCODE_TITLE')}</h3>
            <div className="position-reference">
              <ClipboardButton
                className="copy-button fr"
                onSuccess={this.resetCopiedIndex.bind(this, 3)}
                data-clipboard-text={this.state.embedCode}
              >
                {t('COPY')}
              </ClipboardButton>
              <textarea
                className="embed-code"
                value={this.state.embedCode}
              />
              <span className={copyTip3}>Embed Code has copied to clipboard</span>
            </div>
          </div>
        </div>
        <div className="button-wrap">
          <XButton
            className="little-button"
            onClicked={this.closeModal}
          >{t('CLOSE')}</XButton>
        </div>
      </XModal>
    );
  }
}

ShareModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  closeShareModal: PropTypes.func.isRequired,
  znoUrl: PropTypes.string.isRequired,
  anonymousUrl: PropTypes.string.isRequired,
  baseUrl: PropTypes.string,
  projectId: PropTypes.number,
  productType: PropTypes.string
};

export default translate('ShareModal')(ShareModal);
