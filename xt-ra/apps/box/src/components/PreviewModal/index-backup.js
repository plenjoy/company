import React, { Component, PropTypes } from 'react';
import XModal from '../../../common/ZNOComponents/XModal';
import XButton from '../../../common/ZNOComponents/XButton';
import Spread from '../../components/Spread';
import OutInSide from '../OutInSide';
import { translate } from 'react-translate';
import { merge, template, get, set, isEqual, isUndefined } from 'lodash';
import {
  workSpacePrecent,
  sideBarWidth,
  spreadTypes,
  previewTopHeight,
  previewBottomHeight
} from '../../contants/strings';
import { getSize } from '../../../common/utils/helper';
import { panelTypes } from '../../contants/strings';
import { IMAGES_CROPPER, IMAGES_CROPPER_PARAMS } from '../../contants/apiUrl';
import './index.scss';


class PreviewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allSpreads: this.props.allSpreads,
      currentSpread: this.props.currentSpread
    };

    this.resetData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inPreviewWorkspace) {
      this.resetData();
    } else {
      if (!isEqual(this.props.allSpreads, nextProps.allSpreads)) {
        this.setState({
          allSpreads: nextProps.allSpreads
        });
      }

      if (!isEqual(this.props.currentSpread, nextProps.currentSpread)) {
        this.setState({
          currentSpread: nextProps.currentSpread
        });
      }
    }
  }

  componentDidMount() {
    this.addResizeEvent();
  }

  componentWillUnmount() {
    //window.onresize = null;
    window.removeEventListener("resize", this.resizeHandle.bind(this));
  }

  resizeHandle(event) {
    let timer = null;
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.resetData();
    }, 500);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.resizeHandle.bind(this));
  }

  resetData() {
    const { allSpreads } = this.state;
    const newAllSpreads = [];

    if (allSpreads && allSpreads.length) {
      allSpreads.forEach((spread) => {
        const newSpread = merge({}, spread);
        const s = spread.spreadOptions;
        const pageSize = getSize();
        let wsPrecent;

        switch (s.type) {
          case spreadTypes.coverPage:
            wsPrecent = workSpacePrecent.big;
            break;
          case spreadTypes.innerPage:
            wsPrecent = workSpacePrecent.normal;
            break;
          default:
            break;
        }

        if (wsPrecent) {
          const wsSize = this.getWorkspaceAvailableSize(s.w, s.h, wsPrecent);

          const workspaceWidth = wsSize.workspaceWidth; //(pageSize.width - sideBarWidth) * wsPrecent;
          const rate = workspaceWidth / s.w;
          const left = sideBarWidth + (((pageSize.width - sideBarWidth) - workspaceWidth) / 2);
          const opt = {
            width: s.w * rate,
            height: s.h * rate,
            bleedTop: (s.bleedTop / spread.rate) * rate,
            bleedBottom: (s.bleedBottom / spread.rate) * rate,
            bleedLeft: (s.bleedLeft / spread.rate) * rate,
            bleedRight: (s.bleedRight / spread.rate) * rate,
            spineThicknessWidth: (s.spineThicknessWidth / spread.rate) * rate,
            wrapSize: (s.wrapSize / spread.rate) * rate
          };

          merge(newSpread, {
              rate,
              left,
              pageSize,
              workspaceWidth,
              spreadOptions: merge({}, s, opt)
            }
          );
        }

        newAllSpreads.push(newSpread);
      });

      const index = this.getCurrentSpreadIndex();
      this.setState({
        allSpreads: newAllSpreads,
        currentSpread: newAllSpreads[index]
      });
    }
  }

  /**
   * 获取可用的workspace宽和高.
   * @param wsPrecent
   */
  getWorkspaceAvailableSize(spreadWidth, spreadHeight, wsPrecent) {
    const pageSize = getSize();
    const maxWidth = (pageSize.width) * wsPrecent;
    const maxHeight = (pageSize.height - previewTopHeight - previewBottomHeight);

    // 根据workspace的高度, 计算workspace的宽.
    let width = (maxHeight * spreadWidth) / spreadHeight;
    let height = (maxWidth * spreadHeight) / spreadWidth;

    // 如果根据最大高度计算出来的宽大于最大宽, 那就使用最大宽.
    if (width > maxWidth) {
      width = maxWidth;
    } else {
      height = maxHeight;
    }

    return {
      workspaceWidth: width,
      workspaceHeight: height
    }
  }

  onOutside() {
    const { allSpreads } = this.state;
    const index = this.getCurrentSpreadIndex();

    if (allSpreads && allSpreads.length && !Object.is(index, 0)) {
      this.setState({
        currentSpread: allSpreads[0]
      });
    }
  }

  onInside() {
    const { allSpreads } = this.state;
    const index = this.getCurrentSpreadIndex();
    if (allSpreads && allSpreads.length > 1 && !Object.is(index, 1)) {
      this.setState({
        currentSpread: allSpreads[1]
      });
    }
  }

  getCurrentSpreadIndex() {
    const { allSpreads, currentSpread } = this.state;
    const index = allSpreads.findIndex((v) => {
      return v.spreadOptions.id === currentSpread.spreadOptions.id;
    });

    return index;
  }

  getSpreadHtml() {
    const { baseUrls, ratio, imageArray } = this.props;
    const { currentSpread } = this.state || {};
    let html = '';
    let imageBaseUrl;
    if (baseUrls && baseUrls.baseUrl) {
      imageBaseUrl = template(IMAGES_CROPPER)(baseUrls);
    }

    if (currentSpread && currentSpread.spreadOptions) {
      html = (<Spread spreadId={currentSpread.spreadOptions.id}
                      spreadOptions={currentSpread.spreadOptions}
                      elementsOptions={currentSpread.elementsOptions}
                      imageBaseUrl={imageBaseUrl}
                      isPreview={true}
                      imageArray={imageArray}
                      activePhotoElementIndex={0}
                      baseUrls={baseUrls}
                      ratio={currentSpread.rate}
      />);
    }
    return html;
  }

  /**
   * 当panel type是 image wrapped时, 才需要显示切换按钮.
   */
  getBottomBtnHtml() {
    let html = '';
    const { setting } = this.props;
    if (setting && setting.type === panelTypes.imageWrapped) {
      html = (<OutInSide onLeftClicked={this.onOutside.bind(this)}
                         onRightClicked={this.onInside.bind(this)}
      />);
    }

    return html;
  }

  render() {
    const { onClosed, opened, hasPreview } = this.props;
    const { spreadOptions } = this.state.currentSpread;
    const spreadWidth = spreadOptions ? spreadOptions.width : 0;
    const spreadHeight = spreadOptions ? spreadOptions.height : 0;
    return (
      <XModal className="preview-modal" onClosed={ onClosed }
              isHideIcon={hasPreview}
              opened={ opened }>
        <div className="box-preview">
          <div className="container-preview" style={{ height: window.innerHeight - 50 }}>

            <div className="spread-container" style={{
              marginLeft: window.innerWidth / 2 - spreadWidth / 2,
              marginTop: '50px'
            }}>
              {this.getSpreadHtml()}
            </div>
            <div className="btn-list m-b-66">
              {this.getBottomBtnHtml()}
            </div>
          </div>
        </div>
      </XModal>
    );
  }
}

PreviewModal.propTypes = {
  onClosed: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired
};

export default translate('PreviewModal')(PreviewModal);
