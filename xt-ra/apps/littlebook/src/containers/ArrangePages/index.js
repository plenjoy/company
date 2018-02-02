import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { merge } from 'lodash';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { arrangePageRules } from '../../contants/strings';

// 导入selector
import { mapArragePagesDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/editPage';

// 导入组件.
import XLoading from '../../../../common/ZNOComponents/XLoading';
import BookCover from '../../components/BookCover';
import BookSheet from '../../components/BookSheet';
import * as paginationHandler from './handler/pagination';

// 导入处理函数.
import * as arrangePagesHandler from './handler/arrangePages';

import './index.scss';
import { getArrangePageViewSize } from '../../utils/sizeCalculator';

class ArrangePages extends Component {
  constructor(props) {
    super(props);
    this.onAddPages = () => arrangePagesHandler.onAddPages(this);
    this.doAutoLayout = (pageIds, isSkipCover = false) =>
      arrangePagesHandler.doAutoLayout(this, pageIds, isSkipCover);

    // 翻页时的处理函数.
    this.switchSheet = (param) => {
      paginationHandler.switchSheet(this, param);
    };

    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = this.props.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;

    this.setMouseHoverDomNode = this.setMouseHoverDomNode.bind(this);

    this.state = {
      hasCoverRender: !!coverEffectImg
    };
  }

  componentWillReceiveProps(nextProps) {
    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = nextProps.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;

    this.setState({
      hasCoverRender: !!coverEffectImg
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
    const {
      t,
      urls,
      materials,
      variables,
      pagination,
      settings,
      snipping,
      parameters,
      arrangePagesRatios,
      arrangePagesPosition,
      arrangePagesSize,
      allSheets,
      boundTrackerActions,
      boundProjectActions,
      actions,
      template,
      allImages,
      allElements,
      env
    } = this.props;

    // 校正一下ratios对象中的coverWorkspace的值.
    // 为了保持封面和内页的渲染高度相同, 在getRenderSize中对封面的各个size做了校正. 但是coverWorkspace
    // 还是老的值. 这里我们再次把它校验到正确的值.
    const newArrangePagesRatios = merge({}, arrangePagesRatios);

    if (
      arrangePagesSize.coverSpreadSize.width &&
      newArrangePagesRatios.coverWorkspace &&
      arrangePagesSize.coverSpreadSize.width *
        newArrangePagesRatios.coverWorkspace !==
        arrangePagesSize.coverWorkspaceSize.width
    ) {
      // 重新计算preview的coverWorkspace.
      newArrangePagesRatios.coverWorkspace =
        arrangePagesSize.coverWorkspaceSize.width /
        arrangePagesSize.coverSpreadSize.width;
    }

    const size = arrangePagesSize;
    const ratios = newArrangePagesRatios;
    const sheets = [];
    const sheetsInRows = [];

    const { count: sheetCountInRow } = getArrangePageViewSize();

    // 最大sheet和当前的sheet总数.
    if (allSheets.size && this.state.hasCoverRender) {
      const sheetActions = {
        boundProjectActions,
        boundTrackerActions,
        doAutoLayout: this.doAutoLayout,
        switchSheet: this.switchSheet,
        setMouseHoverDomNode: this.setMouseHoverDomNode
      };

      const innerTotalWidth = size.renderInnerSize.width + arrangePageRules.margin;

      allSheets.forEach((sheet, index) => {
        const isCover = sheet.getIn(['summary', 'isCover']);

        const orderInRow = index % sheetCountInRow;
        const left = innerTotalWidth * orderInRow;

        // sheet容器.
        const containerWidth =
          size.coverWorkspaceSize.width > size.innerWorkspaceSize.width
            ? size.coverWorkspaceSize.width
            : size.innerWorkspaceSize.width;
        const containerHeight =
          size.coverWorkspaceSize.height > size.innerWorkspaceSize.height
            ? size.coverWorkspaceSize.height
            : size.innerWorkspaceSize.height;
        const containerStyle = {
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          left: `${left}px`
        };

        const pageNumberStyle = merge(
          {},
          {
            width: isCover
              ? `${size.renderCoverSize.width}px`
              : `${size.renderInnerSize.width}px`,
            display: containerWidth ? 'block' : 'none'
          }
        );

        // 如果是封面.
        if (isCover) {
          const bookCoverData = {
            styles: containerStyle,
            pageNumberStyle,
            thumbnail: true,
            urls,
            size,
            ratios,
            position: arrangePagesPosition.cover,
            materials,
            variables,
            pagination,
            paginationSpread: sheet,
            settings,
            parameters,
            template,
            allImages,
            allElements,
            env
          };
          sheets.push(
            <BookCover
              key={sheet.get('id')}
              actions={sheetActions}
              data={bookCoverData}
            />
          );
        } else {
          // 正常的内页.
          const sheetData = {
            styles: containerStyle,
            pageNumberStyle,
            thumbnail: true,
            urls,
            size,
            ratios,
            position: arrangePagesPosition.inner,
            materials,
            variables,
            pagination,
            paginationSpread: sheet,
            settings,
            parameters,
            snipping,
            template,
            allImages,
            allElements,
            env
          };
          sheets.push(
            <BookSheet
              key={sheet.get('id')}
              actions={sheetActions}
              data={sheetData}
            />
          );
        }
      });
    }

    sheets.forEach((sheet, index) => {
      if(index % sheetCountInRow === 0) {
        sheetsInRows.push([sheet]);
      } else {
        sheetsInRows[Math.floor(index / sheetCountInRow)].push(sheet);
      }
    });

    const rowStyle = {
      height: (size.coverWorkspaceSize.height > size.innerWorkspaceSize.height
        ? size.coverWorkspaceSize.height
        : size.innerWorkspaceSize.height) + 30
    }

    return (
      <div className="arrange-pages">

        <div className="wrap">
          {sheetsInRows.map((sheetsInRow, index) =>
            <div className="row" key={`row-${index}`} style={rowStyle}>
              {sheetsInRow}
            </div>
          )}
        </div>

        <XLoading
          isShown={!this.state.hasCoverRender}
          loadingText="Loading..."
        />

        <ReactTooltip
          class="swap-photo-hint"
          effect="solid"
          place="bottom"
          delayShow={500}
        >
          {t('DRAG_TO_SWAP')}
        </ReactTooltip>
      </div>
    );
  }
}

ArrangePages.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapArragePagesDispatchToProps)(
  translate('ArrangePages')(ArrangePages)
);
