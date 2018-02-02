import { combineReducers } from 'redux';
import categories from './categoriesReducer';
import themes from './themesReducer';
import summary from './summaryReducer';
import backgrounds from './backgroundsReducer';
import showTheme from './themeStatusReducer.js';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  categories,
  themes,
  summary,
  backgrounds,
  showTheme
});
