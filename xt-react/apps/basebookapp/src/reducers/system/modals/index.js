import { combineReducers } from 'redux';
import loadings from './loadingReducer';
import upgradeModal from './upgradeModalReducer';
import confirmModal from './confirmModalReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  loadings,
  upgradeModal,
  confirmModal
});
