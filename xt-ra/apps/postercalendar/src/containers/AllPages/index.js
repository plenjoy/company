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
import XLoading from '../../../../common/ZNOComponents/XLoading';
import BookCover from '../../components/BookCover';
import BookSheet from '../../components/BookSheet';

import { productTypes } from '../../constants/strings';

// 导入处理函数.

import './index.scss';

class ArrangePages extends Component {
  constructor(props) {
    super(props);

    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = this.props.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;
    this.setMouseHoverDomNode = this.setMouseHoverDomNode.bind(this);
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
      userInfo
    } = this.props;
    const specData = spec;

    const size = arrangePagesSize;
    const sheets = [];

    if (allSheets.size && this.state.hasCoverRender && get(size, 'renderCoverSize')) {
      const sheetActions = {
        boundProjectActions,
        boundPaginationActions,
        setMouseHoverDomNode: this.setMouseHoverDomNode,
        boundImageEditModalActions,
        boundTextEditModalActions,
        boundTrackerActions
      };

      // sheet容器.
      const containerWidth = size.renderCoverSize.width > size.renderInnerContainerSize.width ? size.renderCoverSize.width : size.renderInnerContainerSize.width;
      const containerHeight = size.renderCoverSize.height > size.renderInnerContainerSize.height ? size.renderCoverSize.height : size.renderInnerContainerSize.height;
      const containerStyle = {
        width: `${containerWidth}px`,
        height: `${containerHeight}px`
      };
      const productType = get(settings, 'spec.product');

      allSheets.forEach((sheet, index) => {
        const isCover = sheet.getIn(['summary', 'isCover']);

        const pageNumberStyle = merge({}, {
          width: isCover ? `${size.renderCoverSize.width}px` : `${size.renderInnerSize.width}px`,
          display: containerWidth ? 'block' : 'none'
        });

        // 如果是封面.
        if (isCover) {
          if (productType !== productTypes.LC) {
            const bookCoverData = {userInfo, styles: containerStyle, specData, pageNumberStyle, allPageSheetIndex: index, thumbnail: true, urls, size, ratios, variables, pagination, paginationSpread: sheet, settings, parameters };
            sheets.push(<BookCover key={sheet.get('id')} actions={sheetActions} data={bookCoverData} />);
          }
        } else {
          // 正常的内页.
          const sheetData = {userInfo, styles: containerStyle, pageNumberStyle, allPageSheetIndex: index, thumbnail: true, urls, size, ratios, variables, pagination, paginationSpread: sheet, settings, parameters };
          sheets.push(<BookSheet key={sheet.get('id')} actions={sheetActions} data={sheetData} />);
        }
      });
    }
    return (
      <div className="all-pages">
        <div className="wrap clearfix">
          { sheets }
        </div>

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
