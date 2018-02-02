import React, { Component, PropTypes } from 'react';
import { template, merge, get } from 'lodash';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import { is, fromJS } from 'immutable';

// 导入selector
import { mapSelectThemesDispatchToProps } from '../../selector/mapDispatch';
import { mapStateToProps } from '../../selector/mapState/selectThemes';

import noImage from './images.svg';

// 导入组件.
import ThemesList from '../../components/ThemesList';
import ThemeCategories from '../../components/ThemeCategories';
import XLoading from '../../../../common/ZNOComponents/XLoading';

import './index.scss';

// 导入handler.
import * as mainHandler from './handler/main';
import * as categoriesHandler from './handler/categories';
import * as themesHandler from './handler/themes';

class SelectThemes extends Component {
  constructor(props) {
    super(props);

    // categories
    this.changeCategory = newCategory =>
      categoriesHandler.changeCategory(this, newCategory);
    this.getCategories = () => categoriesHandler.getCategories(this);

    // themes
    this.getThemes = themeType => themesHandler.getThemes(this, themeType);

    this.setLoading = this.setLoading.bind(this);

    this.state = {
      currentCategoryCode: ''
    };
  }

  setLoading(showLoading) {
    const { boundGlobalLoadingActions } = this.props;
    if (showLoading) {
      boundGlobalLoadingActions.showGlobalLoading();
    } else {
      boundGlobalLoadingActions.hideGlobalLoading();
    }
  }

  componentWillReceiveProps(nextProps) {
    // 检查是否要设置currentCategoryCode
    if (
      !is(nextProps.currentTheme, this.props.currentTheme) &&
      nextProps.currentTheme &&
      nextProps.currentTheme.size
    ) {
      this.setState(
        {
          currentCategoryCode:
            nextProps.currentTheme.get('parentThemeCode') ||
            nextProps.currentTheme.get('typeCode')
        },
        () => {
          this.getThemes();
        }
      );
    }

    const oldSummary = this.props.themeSummary;
    const newSummary = nextProps.themeSummary;

    // 检查是否要重新获取theme list.
    const newSettings = nextProps.settings;
    const oldSettings = this.props.settings;

    const newProduct = get(newSettings, 'spec.product');
    const oldProduct = get(oldSettings, 'spec.product');
    const newSize = get(newSettings, 'spec.size');
    const oldSize = get(oldSettings, 'spec.size');
    if (
      (newProduct && newProduct !== oldProduct) ||
      (newSize && newSize !== oldSize)
    ) {
      this.getThemes();
    }

    if (!is(oldSummary, newSummary)) {
      this.setState({
        currentCategoryCode: newSummary.get('currentThemeType')
      });
    }
  }

  componentWillMount() {
    this.getCategories();
  }

  componentDidMount() {
    const currentTheme = get(this.props, 'currentTheme');
    const themeSummary = get(this.props, 'themeSummary');
    let currentCategoryCode = '';
    if (currentTheme) {
      currentCategoryCode =
        currentTheme.get('parentThemeCode') || currentTheme.get('typeCode');
    } else {
      currentCategoryCode = themeSummary.get('currentThemeType');
    }
    if (currentCategoryCode) {
      this.setState({
        currentCategoryCode
      }, () => {
        this.getThemes();
      });
    }
  }

  render() {
    const {
      t,
      categories,
      themes,
      themeSummary,
      hasAddedElements,
      boundThemeOverlayModalActions,
      boundProjectActions,
      boundTrackerActions,
      boundNotificationActions,
      boundConfirmModalActions,
      boundPaginationActions,
      boundThemeActions,
      boundTogglePanelActions,
      project
    } = this.props;
    const { currentCategoryCode } = this.state;

    // categories
    const categoriesData = {
      categories,

      // TODO
      currentCategoryCode
    };
    const categoriesActions = {
      changeCategory: this.changeCategory
    };

    // themes list
    const themesListData = {
      themes,
      themeSummary,
      currentCategoryCode,
      hasAddedElements,
      boundTrackerActions,
      project
    };

    const themesListActions = {
      boundThemeOverlayModalActions,
      boundProjectActions,
      boundNotificationActions,
      boundConfirmModalActions,
      boundPaginationActions,
      setLoading: this.setLoading,
      boundThemeActions,
      themeSummary,
      boundTrackerActions,
      boundTogglePanelActions
    };

    return (
      <div className="select-themes">
        {categories && categories.size ? (
          <div>
            <ThemeCategories
              data={categoriesData}
              actions={categoriesActions}
            />
            <ThemesList data={themesListData} actions={themesListActions} />
          </div>
        ) : (
          <div className="no-image">
            <img src={noImage} />
            {t('NO_THEME')}
          </div>
        )}
      </div>
    );
  }
}

SelectThemes.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default connect(mapStateToProps, mapSelectThemesDispatchToProps)(
  translate('SelectThemes')(SelectThemes)
);
