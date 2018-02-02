import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import { Provider } from 'react-redux';
import App from './containers/App/index';
import configureStore from './store/configStore';

// 定义当前可用的语言.
const available = ['en', 'cn'];

// 默认显示的语言
const language = (
  available.hasOwnProperty(navigator.language) ? navigator.language : 'en'
);

// 创建全局的store
const store = configureStore();

// app的挂载点
const rootElement = document.getElementById('app');

// 下载本地化文件并渲染app组件
fetch(`manifest.json?${Date.now()}`).then(res => res.json()).then((manifest) => {
  const requestFileName = manifest[`${language}.yml`];
  fetch(requestFileName)
    .then(res => res.json())
    .then((translations) => {
      ReactDOM.render(
        <Provider store={store}>
          <App translations={translations} />
        </Provider>,
        rootElement
      );
    }).catch(err => console.error(err));
});
