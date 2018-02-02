/**
 * Created by Administrator on 2016/9/14.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import apiMiddleware from '../middlewares/api';
import trackerMiddleware from '../middlewares/tracker';

const stateTransformer = (state) => {
  let newState = JSON.parse(JSON.stringify(state));
  return newState;
};

/**
 * 用于创建一个store
 * @param {Object} initialState 初始值.
 */
export default function configureStore(initialState = {}) {
  const middlewares = [applyMiddleware(trackerMiddleware),
    applyMiddleware(thunk),
    applyMiddleware(apiMiddleware)];

  let composeEnhancers = compose;

  if (__DEVELOPMENT__) {
    // middlewares.push(applyMiddleware(createLogger({ stateTransformer })));
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  const finalCreateStore = composeEnhancers(
    ...middlewares
  )(createStore);

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
