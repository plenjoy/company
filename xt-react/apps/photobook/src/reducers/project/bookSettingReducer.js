import Immutable from 'immutable';

import { CHANGE_BOOK_SETTING, INIT_BOOK_SETTING } from '../../contants/actionTypes';

import {
  DEFAULT_FONT_FAMILY_ID,
  DEFAULT_FONT_WEIGHT_ID
} from '../../contants/strings';

const initialState = Immutable.fromJS({
  // 是否自动应用autolayout
  autoLayout: true,

  // 是否应用全局背景色到所有页面.
  applyBackground: true,
  background: {
    color: '#FFFFFF'
  },

  // 是否应用全局的字体设置.
  applyFont: false,
  font: {
    fontSize: 23,
    color: '#000000',
    fontFamilyId: DEFAULT_FONT_FAMILY_ID,
    fontId: DEFAULT_FONT_WEIGHT_ID
  },

  // 是否自动应用全局的边框设置到所有的图片元素.
  applyBorderFrame: false,

  // 普通用户的高级模式.
  professionalView: false,

  // 全局边框的默认值.
  border: {
    color: '#000000',
    size: 0,
    opacity: 100
  }
});

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_BOOK_SETTING:
    case CHANGE_BOOK_SETTING: {
      return state.merge(action.bookSetting);
    }
    default:
      return state;
  }
};
