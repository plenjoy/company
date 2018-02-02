
// --------------------- request actions ------------------------------

// action类型: 发送一个ajax请求
export const API_REQUEST = 'API_REQUEST';

// action类型: 接受到一个ajax响应
export const API_SUCCESS = 'API_SUCCESS';

// action类型: ajax请求失败时.
export const API_FAILURE = 'API_FAILURE';

// --------------------- system actions ------------------------------

// parser url querystring
export const PARSER_QUERYSTRING = 'PARSER_QUERYSTRING';

export const ADD_TRACKER = 'ADD_TRACKER';

// action类型：弹出右上角提示框
export const SHOW_NOTIFY = 'SHOW_NOTIFY';

// action 类型：关闭右上角提示框
export const HIDE_NOTIFY = 'HIDE_NOTIFY';

// action 类型：弹出中间确认弹框
export const SHOW_CONFIRM = 'SHOW_CONFIRM';

// action 类型：关闭中间确认弹框
export const HIDE_CONFIRM = 'HIDE_CONFIRM';

// upgrade model.
export const SHOW_UPGRADE = 'SHOW_UPGRADE';
export const HIDE_UPGRADE = 'HIDE_UPGRADE';

// action 类型: 工厂阅览窗口
export const SHOW_PREVIEW_MODAL = 'SHOW_PREVIEW_MODAL';
export const HIDE_PREVIEW_MODAL = 'HIDE_PREVIEW_MODAL';

// action 类型: 显示 item  loading
export const SHOW_LOADING = 'SHOW_LOADING';

// action 类型: 隐藏 item loading
export const HIDE_LOADING = 'HIDE_LOADING';

// action 类型: 显示/隐藏preview modal
export const SHOW_PREVIEW = 'SHOW_PREVIEW';
export const HIDE_PREVIEW = 'HIDE_PREVIEW';

// action 类型: notification
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const INIT_NOTIFICATION_SYSTEM = 'INIT_NOTIFICATION_SYSTEM';

// action 类型：sidebar
export const CHANGE_TAB_IN_SIDEBAR = 'CHANGE_TAB_IN_SIDEBAR';

// action 类型：第三方授权认证
export const SHOW_OAUTH_PAGE = 'SHOW_OAUTH_PAGE';   // 打开第三方授权页
export const HIDE_OAUTH_PAGE = 'HIDE_OAUTH_PAGE';   // 关闭第三方授权页

export const SHOW_OAUTH_LOADING = 'SHOW_OAUTH_LOADING';
export const HIDE_OAUTH_LOADING = 'HIDE_OAUTH_LOADING';

export const SET_OAUTH_USER = 'SET_OAUTH_USER';   // 打开第三方授权页
export const SET_OAUTH_TOKEN = 'SET_OAUTH_TOKEN';   // 关闭第三方授权页
export const ADD_OAUTH_PHOTOS = 'ADD_OAUTH_PHOTOS';

// action 类型：volumes
export const GENERATE_VOLUMES = 'GENERATE_VOLUMES';
export const SELECT_VOLUME = 'SELECT_VOLUME';
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const CHANGE_SUMMARY = 'CHANGE_SUMMARY';
export const UPDATE_VOLUMES = 'UPDATE_VOLUMES';
export const CHANGE_PAGE_TO_COVER = 'CHANGE_PAGE_TO_COVER';
export const TOGGLE_COVER = 'TOGGLE_COVER';
export const ORDER_VOLUMES = 'ORDER_VOLUMES';

// action 类型：photoArray
export const ADD_PHOTOS = 'ADD_PHOTOS';
export const SORT_PHOTOS = 'SORT_PHOTOS';
export const CLEAR_PHOTOS = 'CLEAR_PHOTOS';
export const INCLUDE_PHOTOS = 'INCLUDE_PHOTOS';
export const EXCLUDE_PHOTOS = 'EXCLUDE_PHOTOS';
export const SET_IS_CAPTION_OUT_OF_SIZE = 'SET_IS_CAPTION_OUT_OF_SIZE';

// action 类型：materials
export const UPDATE_COVER_MATERIAL = 'UPDATE_COVER_MATERIAL';
export const UPDATE_INNER_MATERIAL = 'UPDATE_INNER_MATERIAL';

// action 类型：ratio
export const UPDATE_RATIO = 'UPDATE_RATIO';

// action 类型：all pages中每一个booksheet显示时的宽高, 以及每一行显示的个数
export const UPDATE_VIEW_PROPERTIES_OF_BOOK_SHEET = 'UPDATE_VIEW_PROPERTIES_OF_BOOK_SHEET';

export const SET_FONT_CALCULATOR_SETTINGS = 'SET_FONT_CALCULATOR_SETTINGS';

export const CALCULATE_OUT_OF_SIZE = 'CALCULATE_OUT_OF_SIZE';
// action 类型：弹出下单框
export const SHOW_ORDER = 'SHOW_ORDER';

// action 类型：关闭下单框
export const HIDE_ORDER = 'HIDE_ORDER';

export const CHANGE_PRICE = 'CHANGE_PRICE';

export const ORDER_ALL_VOLUMES = 'ORDER_ALL_VOLUMES';

export const CANCEL_ALL_ORDERED_VOLUMES = 'CANCEL_ALL_ORDERED_VOLUMES';

export const CHANGE_PAGE_INFO = 'CHANGE_PAGE_INFO';

export const SHOW_ORDER_LOADING = 'SHOW_ORDER_LOADING';
export const HIDE_ORDER_LOADING = 'HIDE_ORDER_LOADING';

export const SHOW_VIEW_IS_RENDING = 'SHOW_VIEW_IS_RENDING';
export const HIDE_VIEW_IS_RENDING = 'HIDE_VIEW_IS_RENDING';

export const SHOW_INCOMPLETE_MODAL = 'SHOW_INCOMPLETE_MODAL';
export const HIDE_INCOMPLETE_MODAL = 'HIDE_INCOMPLETE_MODAL';

export const CHANGE_FILTER_PHOTO_TAB ='CHANGE_FILTER_PHOTO_TAB';

export const GET_PREVIEW_PROJECT = 'GET_PREVIEW_PROJECT';