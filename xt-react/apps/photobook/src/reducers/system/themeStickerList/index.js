import { combineReducers } from 'redux';

import themestickerList from './list';
import currentThemeType from './setCurrentSticker';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  list: themestickerList,
  currentThemeType,
});

