
// --------------------- request actions ------------------------------

// action类型: 发送一个ajax请求
export const API_REQUEST = 'API_REQUEST';

// action类型: 接受到一个ajax响应
export const API_SUCCESS = 'API_SUCCESS';

// action类型: ajax请求失败时.
export const API_FAILURE = 'API_FAILURE';

// --------------------- spec actions ---------------------------------
// action类型: 获取spec数据.
export const GET_SPEC_DATA = 'GET_SPEC_DATA';

export const INIT_SPEC_DATA = 'INIT_SPEC_DATA';

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

export const SHOW_ALERT_MODAL = 'SHOW_ALERT_MODAL';
export const HIDE_ALERT_MODAL = 'HIDE_ALERT_MODAL';

// upgrade model.
export const SHOW_UPGRADE = 'SHOW_UPGRADE';
export const HIDE_UPGRADE = 'HIDE_UPGRADE';

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

export const CLEAR_ORDER_INFO = 'CLEAR_ORDER_INFO';

export const SHOW_CLONE_MODAL = 'SHOW_CLONE_MODAL';
export const HIDE_CLONE_MODAL = 'HIDE_CLONE_MODAL';


// --------------------- project actions ------------------------------
export const SET_COVER = 'SET_COVER';
export const SET_PAGE_ARRAY = 'SET_PAGE_ARRAY';
export const SET_VARIABLE_MAP = 'SET_VARIABLE_MAP';
export const SET_PARAMETER_MAP = 'SET_PARAMETER_MAP';
export const SET_IMAGE_ARRAY = 'SET_IMAGE_ARRAY';
export const SET_IMAGE_USED_MAP = 'SET_IMAGE_USED_MAP';
export const SET_OPTION_MAP = 'SET_OPTION_MAP';

export const CLEAR_IMAGE_USED_MAP = 'CLEAR_IMAGE_USED_MAP';

export const INIT_CALENDAR_SETTING = 'INIT_CALENDAR_SETTING';
export const CHANGE_CALENDAR_SETTING = 'CHANGE_CALENDAR_SETTING';

export const CREATE_ELEMENTS = 'CREATE_ELEMENTS';
// 更新绘图元素的属性
export const UPDATE_ELEMENT = 'UPDATE_ELEMENT';

export const UPDATE_ELEMENTS = 'UPDATE_ELEMENTS';
// 删除元素
export const DELETE_ELEMENT = 'DELETE_ELEMENT';

export const DELETE_ELEMENTS = 'DELETE_ELEMENTS';

export const DELETE_ALL = 'DELETE_ALL';

export const APPLY_TEMPLATE = 'APPLY_TEMPLATE';
export const APPLY_TEMPLATE_TO_PAGES = 'APPLY_TEMPLATE_TO_PAGES';
export const UPDATE_PAGE_TEMPLATE_ID = 'UPDATE_PAGE_TEMPLATE_ID';

export const MOVE_PAGE_BEFORE = 'MOVE_PAGE_BEFORE';

// 修改项目设置参数
export const INIT_PROJECT_SETTING = 'INIT_PROJECT_SETTING';
export const CHANGE_PROJECT_SETTING = 'CHANGE_PROJECT_SETTING';

export const PROJECT_LOAD_COMPLETED = 'PROJECT_LOAD_COMPLETED';

export const UPDATE_PROJECT_ID = 'UPDATE_PROJECT_ID';

export const CHANGE_PROJECT_TITLE = 'CHANGE_PROJECT_TITLE';

export const CHANGE_PROJECT_PROPERTY = 'CHANGE_PROJECT_PROPERTY';


// --------------------- system actions ------------------------------
// action类型：上传成功
export const UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';
// action类型： 删除图片列表中的图片
export const DELETE_PROJECT_IMAGE = 'DELETE_PROJECT_IMAGE';
// action类型： 更新图片使用次数
export const UPDATE_IMAGE_USED_COUNT = 'UPDATE_IMAGE_USED_COUNT';

// action 类型: 翻页
export const SWITCH_SHEET = 'SWITCH_SHEET';
export const SWITCH_PAGE = 'SWITCH_PAGE';

// action类型：添加上传图片列表
export const ADD_IMAGES = 'ADD_IMAGES';
// action类型： 重新上传指定图片
export const RETRY_IMAGE = 'RETRY_IMAGE';
// action 类型: 是否自动添加当前上传的图片到canvas.
export const AUTO_ADD_PHOTO_TO_CANVAS = 'AUTO_ADD_PHOTO_TO_CANVAS';

export const CHANGE_TAB_IN_SIDEBAR = 'CHANGE_TAB_IN_SIDEBAR';

export const UPDATE_RATIO = 'UPDATE_RATIO';

export const ADD_ALBUM = 'ADD_ALBUM';

export const GET_USER_ALBUM_ID = 'GET_USER_ALBUM_ID';

export const TOGGLE_UPLOAD = 'TOGGLE_UPLOAD';

export const UPDATE_IMAGEID = 'UPDATE_IMAGEID';

export const UPDATE_PERCENT = 'UPDATE_PERCENT';

export const UPDATE_FIELDS = 'UPDATE_FIELDS';

export const CLEAR_IMAGES = 'CLEAR_IMAGES';

export const DELETE_IMAGE = 'DELETE_IMAGE';

export const ERROR_TO_FIRST = 'ERROR_TO_FIRST';

export const SHOW_CONTACT_US_MODAL = 'SHOW_CONTACT_US_MODAL';

export const HIDE_CONTACT_US_MODAL = 'HIDE_CONTACT_US_MODAL';

export const SET_CAPABILITIES = 'SET_CAPABILITIES';

export const SHOW_IMAGE_EDIT_MODAL = 'SHOW_IMAGE_EDIT_MODAL';
export const HIDE_IMAGE_EDIT_MODAL = 'HIDE_IMAGE_EDIT_MODAL';

export const CLEAR_TEMPLATE_LIST = 'CLEAR_TEMPLATE_LIST';
export const ADD_TEMPLATE = 'ADD_TEMPLATE';
export const IS_IN_APPLY_TEMPLATE = 'IS_IN_APPLY_TEMPLATE';

export const SET_TEMPLATE_LIST = 'SET_TEMPLATE_LIST';

export const SHOW_TEXT_EDIT_MODAL = 'SHOW_TEXT_EDIT_MODAL';

export const HIDE_TEXT_EDIT_MODAL = 'HIDE_TEXT_EDIT_MODAL';

