import { combineReducers } from 'redux';

import project from './projectReducer';
import system from './systemReducer';
import textEditModalData from './textEditModalDataReducer';
import spec from './specReducer';

export default combineReducers({
  project,
  system,
  spec,
  textEditModalData
});
