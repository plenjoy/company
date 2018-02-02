import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import {spy} from 'mobx';

import '../../common/fontFamily/font1.css';
import '../../common/fontFamily/font2.css';

ReactDOM.render(
	<App />, document.getElementById('root')
);

window.onload = function() {
	document.getElementsByClassName('page-loading')[0].style.display = 'none';
};

// if (__DEVELOPMENT__) {
//   const isShowSelection = false;

//   spy((event) => {
//     switch(event.type) {
//       case 'action': {
//         console.log(event);
//         break;
//       }
//       case 'update': {
//         console.log(event);
//         break;
//       }
//       default:
//         break;
//     }
//   })
// }
