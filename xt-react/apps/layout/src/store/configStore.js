import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import apiMiddleware from '../middlewares/api';


/**
 * 用于创建一个store
 * @param {Object} initialState 初始值.
 */
export default function configureStore(initialState = {}) {
  const middlewares = [applyMiddleware(thunk), applyMiddleware(apiMiddleware)];

  let composeEnhancers = compose;

  if (__DEVELOPMENT__) {
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  const finalCreateStore = composeEnhancers(...middlewares)(createStore);

  const store = finalCreateStore(rootReducer, initialState);

  if (__DEVELOPMENT__ && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
