import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { template, merge, get } from 'lodash';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import {
  spineExpandingTopRatio,
  arrangePageRules
} from '../../contants/strings';

// 导入selector
import { mapArragePagesDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/editPage';

// 导入组件.
import XLoading from '../../../../common/ZNOComponents/XLoading';
import XUndoable from '../../../../common/ZNOComponents/XUndoable';
import BookCover from '../../components/BookCover';
import BookSheet from '../../components/BookSheet';
import AddPagesButton from '../../components/AddPagesButton';

// 导入处理函数.
import * as arrangePagesHandler from './handler/arrangePages';
import * as undoableHandler from './handler/undoable';

import './index.scss';
import { getArrangePageViewSize } from '../../utils/sizeCalculator';

class ArrangePages extends Component {
  constructor(props) {
    super(props);
    this.onAddPages = () => arrangePagesHandler.onAddPages(this);
    this.onRemovePages = pageIds =>
      arrangePagesHandler.onRemovePages(this, pageIds);

    // undoable
    this.onUndo = isPressKey => undoableHandler.onUndo(this, isPressKey);
    this.onRedo = isPressKey => undoableHandler.onRedo(this, isPressKey);

    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = this.props.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;

    this.setMouseHoverDomNode = this.setMouseHoverDomNode.bind(this);

    this.state = {
      hasCoverRender: !!coverEffectImg,
      isDragPage: false
    };

    this.startDragPage = this.startDragPage.bind(this);
    this.stopDragPage = this.stopDragPage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = nextProps.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;

    this.setState({
      hasCoverRender: !!coverEffectImg
    });
  }

  componentWillUnmount() {
    const { boundUndoActions } = this.props;
    boundUndoActions.clearHistory();
  }

  componentDidMount() {
    const { boundUndoActions } = this.props;
    boundUndoActions.clearHistory();
  }

  setMouseHoverDomNode(domNode) {
    if (domNode) {
      ReactTooltip.show(ReactDOM.findDOMNode(domNode));
    } else {
      ReactTooltip.hide();
    }
  }

  startDragPage() {
    this.setState({ isDragPage: true });
  }

  stopDragPage() {
    this.setState({ isDragPage: false });
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
      spec,
      coverSpreadForInnerWrap,
      boundProjectActions,
      boundPaginationActions,
      boundTrackerActions,
      capabilities,
      undoData,
      env
    } = this.props;
    const capability = capabilities.get('arrangePages');
    const specData = spec;
    const newArrangePagesRatios = merge({}, arrangePagesRatios);

    const { isDragPage } = this.state;

    // 校正一下ratios对象中的coverWorkspace的值.
    // 为了保持封面和内页的渲染高度相同, 在getRenderSize中对封面的各个size做了校正. 但是coverWorkspace
    // 还是老的值. 这里我们再次把它校验到正确的值.
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

    const {
      count: sheetCountInRow,
      width: innerWidth
    } = getArrangePageViewSize();

    // 最大sheet和当前的sheet总数.
    const maxSheetNumber = parameters
      ? parameters.getIn(['sheetNumberRange', 'max'])
      : 0;
    const minSheetNumber = parameters
      ? parameters.getIn(['sheetNumberRange', 'min'])
      : 0;
    const totalSheetNumber = get(pagination, 'total');

    if (allSheets.size && this.state.hasCoverRender) {
      const sheetActions = {
        boundProjectActions,
        boundPaginationActions,
        onRemovePages: this.onRemovePages,
        setMouseHoverDomNode: this.setMouseHoverDomNode,
        boundTrackerActions,
        startDragPage: this.startDragPage,
        stopDragPage: this.stopDragPage
      };

      // 计算 内页sheet 总宽
      const innerTotalWidth = innerWidth + arrangePageRules.margin;

      allSheets.forEach((sheet, index) => {
        const isCover = sheet.getIn(['summary', 'isCover']);
        // 计算在当前行的第几个
        const orderInRow = index % sheetCountInRow;
        // 计算左边距离，内页总宽 * n
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
            specData,
            pageNumberStyle,
            thumbnail: true,
            urls,
            size,
            ratios,
            position: arrangePagesPosition.cover,
            materials,
            variables,
            pagination: merge({}, pagination, { sheetIndex: 0 }),
            paginationSpread: sheet,
            settings,
            parameters,
            isShowBgColor: true,
            isDragPage,
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
            thumbnail: true,
            position: arrangePagesPosition.inner,
            paginationSpread: sheet,
            pagination: merge({}, pagination, { sheetIndex: index }),
            pageNumberStyle,
            urls,
            size,
            ratios,
            coverSpreadForInnerWrap,
            materials,
            variables,
            settings,
            parameters,
            snipping,
            capability,
            maxSheetNumber,
            minSheetNumber,
            totalSheetNumber,
            isDragPage,
            allSheets,
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

      // add pages buttons
      const addPagesData = {
        style: {
          width: `${size.renderInnerSheetSizeWithoutBleed.width}px`,
          height: `${size.renderInnerSheetSizeWithoutBleed.height}px`,
          marginLeft: `${arrangePagesPosition.inner.render.left}px`,
          marginTop: `${arrangePagesPosition.inner.sheet.top +
            spineExpandingTopRatio * size.renderInnerSize.height}px`,
          lineHeight: `${size.renderInnerSheetSizeWithoutBleed.height}px`,
          display: size.renderInnerSheetSizeWithoutBleed.width
            ? 'block'
            : 'none',
          left: `${(allSheets.size % sheetCountInRow) * innerTotalWidth}px`
        }
      };

      if (totalSheetNumber < maxSheetNumber) {
        const addPagesAction = { onAddPages: this.onAddPages };

        capability.get('canAddSheet') &&
          sheets.push(
            <AddPagesButton
              key="__AddPagesButton"
              data={addPagesData}
              actions={addPagesAction}
            />
          );
      }
    }

    sheets.forEach((sheet, index) => {
      if (index % sheetCountInRow === 0) {
        sheetsInRows.push([sheet]);
      } else {
        sheetsInRows[Math.floor(index / sheetCountInRow)].push(sheet);
      }
    });

    const rowStyle = {
      height:
        (size.coverWorkspaceSize.height > size.innerWorkspaceSize.height
          ? size.coverWorkspaceSize.height
          : size.innerWorkspaceSize.height) + 30
    };

    return (
      <div className="arrange-pages">
        <XUndoable
          undoEnabled={undoData.pastCount}
          redoEnabled={undoData.futureCount}
          undo={this.onUndo}
          redo={this.onRedo}
        />

        <div className="wrap clearfix">
          {sheetsInRows.map((sheetsInRow, index) => (
            <div className="row" key={`row-${index}`} style={rowStyle}>
              {sheetsInRow}
            </div>
          ))}
        </div>

        <ReactTooltip
          class="hover-tooltip"
          effect="solid"
          place="bottom"
          delayShow={300}
        />
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
