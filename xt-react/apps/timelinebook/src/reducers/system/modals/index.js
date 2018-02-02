import { combineReducers } from 'redux';
import loadings from './loadingReducer';
import upgradeModal from './upgradeModalReducer';
import confirmModal from './confirmModalReducer';
import orderModal from './orderModalReducer';
import oAuthPage from './oAuthPageReducer';
import oAuthLoading from './oAuthLoadingReducer';
import fontCalculator from './fontCalculatorReducer';
import incompleteModal from './incompleteModalReducer';
import previewModal from './previewModalReducer';

// reducer合成器, 用于分别处理不同的reducer.
export default combineReducers({
  loadings,
  upgradeModal,
  confirmModal,
  orderModal,
  oAuthPage,
  oAuthLoading,
  fontCalculator,
  incompleteModal,
  previewModal
});
