import { get, template } from 'lodash';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import * as apiUrl from '../../contants/apiUrl';
import { productTypes, coverTypes, elementTypes } from '../../contants/strings';

const env = state => get(state, 'system.env');
const project = state => get(state, 'project.data');
const capabilities = state => get(state, 'system.capabilities');
const theme = state => get(state, 'theme');

/**
 * 创建具有可记忆的selector
 */
const getProjectData = createSelector(project, project => project);
const getEnvData = createSelector(env, items => items);
const getCapabilitiesData = createSelector(capabilities, items => items);

// themes categories.
const getCategories = createSelector(theme, data => data.categories);
const getThemes = createSelector(theme,
  getEnvData,
  (data, env) => {
    let themes = data.themes;
    const uploadBaseUrl = get(env, 'urls').get('calendarBaseUrl');
    themes.forEach((theme, themeIndex) => {
      const imageJson = theme.get('picJsonStr');
      const size = theme.getIn(['imageSize', 2]);
      const themeId = theme.get('guid');
      let screenshots = fromJS([]);
      if (imageJson) {
        imageJson.forEach((index) => {
          screenshots = screenshots.push(template(apiUrl.THEME_SRC)({
            uploadBaseUrl,
            themeId,
            size,
            index
          }));
        });
        themes = themes.setIn([themeIndex, 'screenshots'], screenshots);
        themes = themes.setIn([themeIndex, 'coverScreenshot'], screenshots.get(0));
      }
    });
    return themes;
  });

const getThemeSummary = createSelector(theme, (data) => {
  return data.summary;
});

const getCurrentTheme = createSelector(getThemes, getProjectData, getThemeSummary, (themes, project, themeSummary) => {
  const applyBookThemeId = get(project, 'property').get('applyBookThemeId');
  const currentThemeType = themeSummary.get('currentThemeType');
  if (applyBookThemeId) {
    const currentTheme = themes.find((theme) => {
      return theme.get('guid') === applyBookThemeId;
    });
    if (currentTheme && (currentTheme.get('parentThemeCode') === currentThemeType || currentTheme.get('typeCode') === currentThemeType)) {
      return currentTheme;
    }
    return themes.find((theme) => {
      return theme.get('isDefault');
    });
  }
  return themes.find((theme) => {
    return theme.get('isDefault');
  });
});

const checkHasAddedElements = createSelector(getProjectData, (project) => {
  const cover = get(project, 'cover.present');
  const pageArray = get(project, 'pageArray.present');
  const setting = get(project, 'setting');

  let hasAddedElements = false;

  // 检查cover上是否新增了元素
  const cotainers = cover.get('containers');
  cotainers && cotainers.forEach((container) => {
    const elements = container.get('elements');
    if (elements.size > 1) {
      hasAddedElements = true;
      return false;
    } else if (elements.size) {
      const element = elements.get(0);
      // pressbook部分cover自带天窗
      if (element.get('type') === elementTypes.cameo &&
          !element.get('encImgId') &&
          setting.get('product') === productTypes.PS &&
          [coverTypes.PSNC, coverTypes.PSLC].indexOf(setting.get('cover')) >= 0) {
        // keep space
        hasAddedElements = false;
      } else {
        hasAddedElements = true;
        return false;
      }
    }
  });

  // 检查内页是否新增了元素
  if (!hasAddedElements) {
    pageArray && pageArray.forEach((page) => {
      if (page.get('elements').size) {
        hasAddedElements = true;
        return false;
      }
    });
  }

  return hasAddedElements;
});

// 获取所有设置
const getAllSettings = createSelector(getProjectData, (project) => {
  return {
    spec: project.setting.toJS(),
    bookSetting: project.bookSetting.toJS()
  };
});

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  project: getProjectData(state),
  env: getEnvData(state),
  settings: getAllSettings(state),
  capabilities: getCapabilitiesData(state),

  // themes
  categories: getCategories(state),
  themes: getThemes(state),
  currentTheme: getCurrentTheme(state),
  themeSummary: getThemeSummary(state),
  hasAddedElements: checkHasAddedElements(state)
});
