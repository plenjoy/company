import { connect } from 'react-redux';
import { translate } from 'react-translate';
import { template, merge, get } from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';

// 导入selector
import { mapStateToProps } from '../../selector/mapState';
import { mapAppDispatchToProps } from '../../selector/mapDispatch';

// 导入组件.
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import XLoading from '../../../../common/ZNOComponents/XLoading';
import BookCover from '../../components/BookCover';
import BookSheet from '../../components/BookSheet';
import AllPagesUploadButton from '../../components/AllPagesUploadButton';

import { productTypes, limitedPageNum } from '../../constants/strings';

// 导入处理函数.
import {
  toggleModal,
  uploadFileClicked,
  onAddPhotos
} from './uploadHelper';

import './index.scss';

class ArrangePages extends Component {
  constructor(props) {
    super(props);

    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = this.props.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;
    this.setMouseHoverDomNode = this.setMouseHoverDomNode.bind(this);

    this.toggleModal = (type, status) => toggleModal(this, type, status);
    this.onAddPhotos = () => onAddPhotos(this);
    this.uploadFileClicked = () => uploadFileClicked(this);

    this.state = {
      hasCoverRender: !coverEffectImg
    };
  }

  componentWillReceiveProps(nextProps) {
    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = nextProps.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;

    this.setState({
      hasCoverRender: !coverEffectImg
    });
  }

  setMouseHoverDomNode(domNode) {
    if (domNode) {
      ReactTooltip.show(ReactDOM.findDOMNode(domNode));
    } else {
      ReactTooltip.hide();
    }
  }

  render() {
    const { t,
      urls,
      materials,
      variables,
      pagination,
      settings,
      parameters,
      ratios,
      arrangePagesSize,
      allSheets,
      spec,
      boundProjectActions,
      boundPaginationActions,
      boundImageEditModalActions,
      boundTextEditModalActions,
      boundTrackerActions,
      boundImagesActions,
      boundUploadImagesActions
    } = this.props;
    const specData = spec;
    const sheets = [];
    let usefullPageNum = 0;

    if (allSheets.size && this.state.hasCoverRender && get(arrangePagesSize, 'renderCoverSize')) {
      const sheetActions = {
        boundProjectActions,
        boundPaginationActions,
        setMouseHoverDomNode: this.setMouseHoverDomNode,
        boundImageEditModalActions,
        boundTextEditModalActions,
        boundTrackerActions,
        boundImagesActions,
        boundUploadImagesActions
      };


      allSheets.forEach((sheet, index) => {
        let size = arrangePagesSize;
        const thePage = sheet.getIn(['pages', '0']);
        if(!thePage) return;
        const isLandscapeShape = thePage.get('width') > thePage.get('height');

        // sheet容器.
        if(isLandscapeShape) {
          size = merge({}, arrangePagesSize, {
            renderCoverSheetSize: get(arrangePagesSize, 'renderCoverSheetSize'),
            renderInnerSize: get(arrangePagesSize, 'renderInnerSizeLandscape'),
            renderInnerContainerSize: get(arrangePagesSize, 'renderInnerContainerSizeLandscape'),
            renderInnerSheetSize: get(arrangePagesSize, 'renderInnerSheetSizeLandscape'),
            renderInnerSheetSizeWithoutBleed: get(arrangePagesSize, 'renderInnerSheetSizeWithoutBleedLandscape')
          });
        }
        const containerWidth = size.renderCoverSize.width > size.renderInnerContainerSize.width ? size.renderCoverSize.width : size.renderInnerContainerSize.width;
        const containerHeight = size.renderCoverSize.height > size.renderInnerContainerSize.height ? size.renderCoverSize.height : size.renderInnerContainerSize.height;
        const containerBoxSize = Math.max(containerWidth, containerHeight);
        const containerStyle = {
          width: `${containerBoxSize}px`,
          height: `${containerBoxSize}px`
        };
        const productType = get(settings, 'spec.product');

        const isCover = sheet.getIn(['summary', 'isCover']);

        const pageNumberStyle = merge({}, {
          width: isCover ? `${size.renderCoverSize.width}px` : `${size.renderInnerSize.width}px`,
          display: containerWidth ? 'block' : 'none'
        });

        // 如果是封面.
        const imageId = sheet.getIn(['pages', '0', 'elements', '0', 'encImgId']);
        if (imageId) {
          usefullPageNum += 1;
          if (isCover) {
            if (productType !== productTypes.LC) {
              const bookCoverData = { styles: containerStyle, specData, pageNumberStyle, allPageSheetIndex: index, thumbnail: true, urls, size, ratios, variables, pagination, paginationSpread: sheet, settings, parameters };
              sheets.push(<BookCover key={sheet.get('id')} actions={sheetActions} data={bookCoverData} />);
            }
          } else {
            // 正常的内页.
            const sheetData = { styles: containerStyle, pageNumberStyle, allPageSheetIndex: index, thumbnail: true, urls, size, ratios, variables, pagination, paginationSpread: sheet, settings, parameters, isLandscapeShape };
            sheets.push(<BookSheet key={sheet.get('id')} actions={sheetActions} data={sheetData} />);
          }
        }
      });
    }
    return (
      <div className="all-pages">
        <div className="wrap clearfix">
          { sheets }

          <XFileUpload
            className="hide"
            multiple="multiple"
            boundUploadedImagesActions={boundImagesActions}
            toggleModal={this.toggleModal}
            ref={fileUpload => (this.fileUpload = fileUpload)}
          />

          {
            allSheets.size && limitedPageNum  > usefullPageNum
              ? <AllPagesUploadButton
                  onAddPhotos={this.onAddPhotos}
                  usefullPageNum={usefullPageNum}
                  size={arrangePagesSize}
                />
              : null
          }
        </div>

        <div className="target-name"></div>

        <XLoading isShown={!this.state.hasCoverRender} loadingText="Loading..." />

      </div>
    );
  }
}

ArrangePages.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapAppDispatchToProps)(translate('ArrangePages')(ArrangePages));
