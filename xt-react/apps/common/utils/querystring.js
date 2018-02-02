import qs from 'qs';

// 从url附加的参数信息中获取用户project的一些初始属性
const queryStringObj = qs.parse(window.location.search.substr(1));

// const initialState = {
//   setting: pick(queryStringObj, ['title', 'size', 'product'])
// };

export default queryStringObj;
