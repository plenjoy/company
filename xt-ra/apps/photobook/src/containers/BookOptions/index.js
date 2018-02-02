import { connect } from 'react-redux';
import { get, template, merge, isEqual } from 'lodash';
import { translate } from 'react-translate';
import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';

import './index.scss';

// 导入组件.
import XLoading from '../../../../common/ZNOComponents/XLoading';
import BookCover from '../../components/BookCover';
import OptionsBar from '../../components/OptionsBar';

// 导入selector
import { mapBookOptionsDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/editPage';

// 导入handler
import * as optionsBarHandler from './handler/optionBar';
import * as bookOptionsHandler from './handler/bookOptions';
import * as snippingHandler from './handler/snipping';
import * as cameoHandler from '../../common/handlers/cameo';

import { productTypes, coverTypes, elementTypes } from '../../contants/strings';
import { CREATE_ELEMENT_WITHOUT_UNDO } from '../../contants/actionTypes';

class BookOptions extends Component {
  constructor(props) {
    super(props);

    // optionBar处理函数.
    this.changeSetting = param => optionsBarHandler.changeSetting(this, param, (newSetting, selectMap) => bookOptionsHandler.updateBookOptionsData(this, newSetting, selectMap));
    this.cancelSetting = () => optionsBarHandler.cancelSetting(this, (settingState) => {
      const newState = this.destructorObject();
      this.setState(merge({}, settingState, newState));
    });
    this.saveSetting = diffSetting => optionsBarHandler.saveSetting(this, diffSetting);
    this.beforeSaveSetting = () => optionsBarHandler.beforeSaveSetting(this);
    this.settingConstructor = (setting, oldSetting) => optionsBarHandler.settingConstructor(this, setting, oldSetting);

    this.onAddCameo = event => cameoHandler.onAddCameo(this, event, CREATE_ELEMENT_WITHOUT_UNDO);

    // bookOption的处理函数.
    this.destructorObject = props => bookOptionsHandler.destructorObject(this, props);

    // 设置state.
    const bookOptionsData = this.destructorObject();
    this.state = merge({},
      this.settingConstructor(bookOptionsData.settings.spec),
      bookOptionsData, {
        // 标识是否要显示页面的loading.
        isLoading: true,

        // 标识是否正在保存project的设置.
        isSaving: false,
        cameo: {
          cameo: 'M',
          cameoShape: 'Rect'
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    // 检查bookoptions的数据是否变化.
    const oldBookOptions = this.props.bookOptionsData;
    const newBookOptions = nextProps.bookOptionsData;
    if (!Immutable.is(oldBookOptions, newBookOptions)) {
      const bookOptionsData = this.destructorObject(nextProps);
      const newState = merge({}, bookOptionsData);
      this.setState(newState);
    }

    const oldSetting = oldBookOptions.getIn(['settings', 'spec']);
    const newSetting = newBookOptions.getIn(['settings', 'spec']);
    if (!Immutable.is(oldSetting, newSetting)) {
      const { boundTemplateActions } = this.props;

      // 如果size发生变化, 就清空模板列表.
      if (oldSetting.get('size') !== newSetting.get('size')) {
        boundTemplateActions.clearTemplateList();
      }

      this.setState(this.settingConstructor(newSetting.toJS()));
    }

    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = this.state.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;
    if (coverEffectImg) {
      this.setState({
        isLoading: false
      });
    }

    // 判断是否需要截图.
    const oldPaginationSpreadForCover = get(this.props, 'paginationSpreadForCover');
    const newPaginationSpreadForCover = get(nextProps, 'paginationSpreadForCover');
  }

  componentDidMount() {
    // 如果封面效果图已经生成了, 那就隐藏页面loading.
    const materials = this.state.materials;
    const coverEffectImg = materials ? materials.getIn(['cover', 'img']) : null;
    if (coverEffectImg) {
      this.setState({
        isLoading: false
      });
    }
  }

  render() {
    const { t } = this.props;
    const {
      translations,
      bookOptionsData,
      project,
      boundProjectActions,
      boundConfirmModalActions,
      boundPaginationActions,
      boundSnippingActions,
      boundThemeActions,
      env,
      parameters,
      capabilities
    } = this.props;

    // 析够所有的数据.
    const {
      isPreview,
      urls,
      size,
      ratios,
      position,
      materials,
      variables,
      pagination,
      paginationSpread,
      settings,
      isLoading,
      isSaving
    } = this.state;

    const property = get(project, 'property');
    const newRatios = merge({}, ratios);

    // 校正一下ratios对象中的coverWorkspace的值.
    // 为了保持封面和内页的渲染高度相同, 在getRenderSize中对封面的各个size做了校正. 但是coverWorkspace
    // 还是老的值. 这里我们再次把它校验到正确的值.
    if (size.coverSpreadSize.width &&
      newRatios.coverWorkspace &&
      size.coverSpreadSize.width * newRatios.coverWorkspace !== size.coverWorkspaceSize.width) {
      newRatios.coverWorkspace = size.coverWorkspaceSize.width / size.coverSpreadSize.width;
    }

    // optionsBar 的所有 action 和数据
    const optionsBarActions = {
      boundProjectActions,
      boundConfirmModalActions,
      boundPaginationActions,
      boundThemeActions,
      changeSetting: this.changeSetting,
      cancelSetting: this.cancelSetting,
      beforeSaveSetting: this.beforeSaveSetting,
      saveSetting: this.saveSetting
    };
    const isProCustomer = env.userInfo && env.userInfo.get('isProCustomer');
    const optionsBarData = merge({},
      this.state,
      { title: project.property.get('title') },
      { baseUrl: urls.baseUrl },
      { isProCustomer },
      { capability: capabilities.get('bookOptionPages') },
      { property }
    );

    // book cover数据.
    const bookCoverData = {
      isPreview,

      // 不显示空的图片框.
      ignoreEmpty: true,
      urls,
      size,
      ratios: newRatios,
      position,
      materials,
      variables,
      pagination,
      paginationSpread,
      settings,
      parameters,
      capability: capabilities.get('bookOptionPages')
    };
    const bookCoverActions = {};

    // 容器样式, 设置居中显示.
    const containerStyle = {
      width: `${size.renderCoverSize.width}px`,
      height: `${size.renderCoverSize.height}px`,
      margin: `-${size.renderCoverSize.height / 2}px auto 0`,
      display: isLoading ? 'none' : 'block'
    };

    return (
      <div className="book-options">
        <OptionsBar actions={optionsBarActions} data={optionsBarData} />
        <div className="cover-select-area" style={containerStyle}>
          <BookCover actions={bookCoverActions} data={bookCoverData} />
        </div>

        {/* <XLoading isShown={isLoading || isSaving} loadingText="Loading..."/>*/}
      </div>
    );
  }
}

BookOptions.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapBookOptionsDispatchToProps)(translate('BookOptions')(BookOptions));
