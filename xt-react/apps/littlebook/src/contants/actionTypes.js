// --------------------- test actions ------------------------------
export const ADD_TODO = 'ADD_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const DID_RANDOM = 'DID_RANDOM';
// --------------------- end test actions ------------------------------


// --------------------- redo/undo actions ------------------------------
export const REDO = 'REDO';
export const UNDO = 'UNDO';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';
// --------------------- end redo/undo actions ------------------------------

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

// parser url querystring
export const PARSER_QUERYSTRING = 'PARSER_QUERYSTRING';
// --------------------- project actions ------------------------------

// action类型: 获取product数据.
export const GET_PROJECT_DATA = 'GET_PROJECT_DATA';

export const PROJECT_LOAD_COMPLETED = 'PROJECT_LOAD_COMPLETED';


// 修改项目设置参数
export const CHANGE_PROJECT_SETTING = 'CHANGE_PROJECT_SETTING';

export const CHANGE_BOOK_SETTING = 'CHANGE_BOOK_SETTING';

export const INIT_PROJECT_SETTING = 'INIT_PROJECT_SETTING';

export const INIT_PROJECT_TITLE = 'INIT_PROJECT_TITLE';

export const CHANGE_PAGE_BGCOLOR = 'CHANGE_PAGE_BGCOLOR';

export const UPDATE_PAGE_TEMPLATE_ID = 'UPDATE_PAGE_TEMPLATE_ID';


export const INIT_COVER = 'INIT_COVER';

export const INIT_PAGE_ARRAY = 'INIT_PAGE_ARRAY';

// 初始化image的数据
export const INIT_IMAGE_ARRAY = 'INIT_IMAGE_ARRAY';

export const INIT_DECORATION_ARRAY = 'INIT_DECORATION_ARRAY';

export const INIT_IMAGE_USED_COUNT_MAP = 'INIT_IMAGE_USED_COUNT_MAP';

export const UPDATE_IMAGE_USED_COUNT_MAP = 'UPDATE_IMAGE_USED_COUNT_MAP';

export const RESET_PROJECT_ORDERED_STATUS = 'RESET_PROJECT_ORDERED_STATUS';

// 更新封面/内页素材的actions
export const UPDATE_COVER_MATERIAL = 'UPDATE_COVER_MATERIAL';
export const UPDATE_INNER_MATERIAL = 'UPDATE_INNER_MATERIAL';
export const SET_ORIGINAL_MATERIALS = 'SET_ORIGINAL_MATERIALS';
export const DOWNLOAD_MATERIALS_STATUS = 'DOWNLOAD_MATERIALS_STATUS';

export const CREATE_CONTAINER = 'CREATE_CONTAINER';
export const DELETE_CONTAINER = 'DELETE_CONTAINER';

export const CREATE_DUAL_PAGE = 'CREATE_DUAL_PAGE';
export const CREATE_MULTIPLE_DUAL_PAGE = 'CREATE_MULTIPLE_DUAL_PAGE';
export const DELETE_DUAL_PAGE = 'DELETE_DUAL_PAGE';
export const DELETE_MULTIPLE_DUAL_PAGE = 'DELETE_MULTIPLE_DUAL_PAGE';

export const MOVE_PAGE_BEFORE = 'MOVE_PAGE_BEFORE';

export const APPLY_TEMPLATE = 'APPLY_TEMPLATE';
export const APPLY_TEMPLATE_WITHOUT_UNDOABLE = 'APPLY_TEMPLATE_WITHOUT_UNDOABLE';
export const APPLY_TEMPLATE_TO_PAGES = 'APPLY_TEMPLATE_TO_PAGES';
export const IS_IN_APPLY_TEMPLATE = 'IS_IN_APPLY_TEMPLATE';

// 创建绘图元素
export const CREATE_ELEMENT = 'CREATE_ELEMENT';
export const CREATE_ELEMENT_WITHOUT_UNDO = 'CREATE_ELEMENT_WITHOUT_UNDO';

export const CREATE_ELEMENTS = 'CREATE_ELEMENTS';
export const CREATE_ELEMENTS_WITHOUT_UNDO = 'CREATE_ELEMENTS_WITHOUT_UNDO';

// 更新绘图元素的属性
export const UPDATE_ELEMENT = 'UPDATE_ELEMENT';

export const UPDATE_ELEMENTS = 'UPDATE_ELEMENTS';

// 删除元素
export const DELETE_ELEMENT = 'DELETE_ELEMENT';

export const DELETE_ELEMENTS = 'DELETE_ELEMENTS';

export const DELETE_ALL = 'DELETE_ALL';

export const UPDATE_PROJECT_ID = 'UPDATE_PROJECT_ID';

export const CHANGE_PROJECT_TITLE = 'CHANGE_PROJECT_TITLE';

export const RESET_PROJECT_INFO = 'RESET_PROJECT_INFO';

export const AUTO_SAVE_PROJECT = 'AUTO_SAVE_PROJECT';

// --------------------- system actions ------------------------------

export const SET_CAPABILITIES = 'SET_CAPABILITIES';

// action类型: 显示modal
export const SHOW_MODAL = 'SHOW_MODAL';

// action类型: 关闭modal
export const CLOSED_MODAL = 'CLOSED_MODAL';

// action类型: 关闭alert
export const CLOSED_ALERT = 'CLOSED_ALERT';

// action类型: 显示alert
export const SHOW_ALERT = 'SHOW_ALERT';

// action类型：添加上传图片列表
export const ADD_IMAGES = 'ADD_IMAGES';

// action类型：更新ImageId
export const UPDATE_IMAGEID = 'UPDATE_IMAGEID';

// action类型：更新percent
export const UPDATE_PERCENT = 'UPDATE_PERCENT';

// action类型：上传成功
export const UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';
export const UPLOAD_ALL_COMPLETED = 'UPLOAD_ALL_COMPLETED';

// action类型：清空上传图片列表
export const CLEAR_IMAGES = 'CLEAR_IMAGES';

// action类型： 取消指定图片上传
export const DELETE_IMAGE = 'DELETE_IMAGE';

// action类型： 重新排序上传成功的图片
export const SORT_IMAGE = 'SORT_IMAGE';

// action类型： 删除图片列表中的图片
export const DELETE_PROJECT_IMAGE = 'DELETE_PROJECT_IMAGE';

// action类型： 更新图片使用次数
export const UPDATE_IMAGE_USED_COUNT = 'UPDATE_IMAGE_USED_COUNT';

// action类型： 将上传失败的图片放到第一个
export const ERROR_TO_FIRST = 'ERROR_TO_FIRST';

// action类型： 重新上传指定图片
export const RETRY_IMAGE = 'RETRY_IMAGE';

// aciton类型： 更新指定字段数据
export const UPDATE_FIELDS = 'UPDATE_FIELDS';

// action类型: 登录成功
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

// action类型: 登录失败
export const LOGIN_FAIL = 'LOGIN_FAIL';

// 显示图片编辑弹窗
export const SHOW_IMAGE_EDIT_MODAL = 'SHOW_IMAGE_EDIT_MODAL';

// 隐藏图片编辑弹窗
export const HIDE_IMAGE_EDIT_MODAL = 'HIDE_IMAGE_EDIT_MODAL';


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

// action 类型: 显示 item  loading
export const SHOW_LOADING = 'SHOW_LOADING';

// action 类型: 隐藏 item loading
export const HIDE_LOADING = 'HIDE_LOADING';

// action 类型: 显示/隐藏preview modal
export const SHOW_PREVIEW = 'SHOW_PREVIEW';
export const HIDE_PREVIEW = 'HIDE_PREVIEW';

// action 类型: 保存文字设置
export const SAVE_TEXT_OPTIONS = 'SAVE_TEXT_OPTIONS';

// action 类型: 更新文字位置
export const UPDATE_TEXT_POSITION = 'UPDATE_TEXT_POSITION';

export const NEED_LEAVE_CONFIRM = 'NEED_LEAVE_CONFIRM';

export const NO_NEED_LEAVE_CONFIRM = 'NO_NEED_LEAVE_CONFIRM';

// action 类型: 更新workspace或preview的ratio
export const UPDATE_RATIO = 'UPDATE_RATIO';

export const TOGGLE_UPLOAD = 'TOGGLE_UPLOAD';

// action 类型: 翻页
export const SWITCH_SHEET = 'SWITCH_SHEET';
export const SWITCH_PAGE = 'SWITCH_PAGE';

export const UPDATE_SNIPPING_THUMBNAIL = 'UPDATE_SNIPPING_THUMBNAIL';

export const SHOW_BOOK_SETTINGS_MODAL = 'SHOW_BOOK_SETTINGS_MODAL';

export const HIDE_BOOK_SETTINGS_MODAL = 'HIDE_BOOK_SETTINGS_MODAL';

export const SHOW_PAINTED_TEXT_MODAL = 'SHOW_PAINTED_TEXT_MODAL';

export const HIDE_PAINTED_TEXT_MODAL = 'HIDE_PAINTED_TEXT_MODAL';

export const SAVE_PAINTED_TEXT_MODAL_INPUT = 'SAVE_PAINTED_TEXT_MODAL_INPUT';

export const SHOW_TEXT_EDIT_MODAL = 'SHOW_TEXT_EDIT_MODAL';

export const HIDE_TEXT_EDIT_MODAL = 'HIDE_TEXT_EDIT_MODAL';

export const SHOW_HOW_THIS_WORKS_MODAL = 'SHOW_HOW_THIS_WORKS_MODAL';

export const HIDE_HOW_THIS_WORKS_MODAL = 'HIDE_HOW_THIS_WORKS_MODAL';

export const SHOW_QUICK_START_MODAL = 'SHOW_QUICK_START_MODAL';

export const HIDE_QUICK_START_MODAL = 'HIDE_QUICK_START_MODAL';

export const SHOW_CONTACT_US_MODAL = 'SHOW_CONTACT_US_MODAL';

export const HIDE_CONTACT_US_MODAL = 'HIDE_CONTACT_US_MODAL';

export const SHOW_SHARE_PROJECT_MODAL = 'SHOW_SHARE_PROJECT_MODAL';

export const HIDE_SHARE_PROJECT_MODAL = 'HIDE_SHARE_PROJECT_MODAL';

export const SHOW_SAVE_TEMPLATE_MODAL = 'SHOW_SAVE_TEMPLATE_MODAL';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export const HIDE_SAVE_TEMPLATE_MODAL = 'HIDE_SAVE_TEMPLATE_MODAL';

export const SHOW_CLONE_MODAL = 'SHOW_CLONE_MODAL';

export const HIDE_CLONE_MODAL = 'HIDE_CLONE_MODAL';

export const SHOW_ALERT_MODAL = 'SHOW_ALERT_MODAL';

export const HIDE_ALERT_MODAL = 'HIDE_ALERT_MODAL';

export const SHOW_PAGE_LOADING_MODAL = 'SHOW_PAGE_LOADING_MODAL';

export const HIDE_PAGE_LOADING_MODAL = 'HIDE_PAGE_LOADING_MODAL';

export const SHOW_CHANGE_BGCOLOR_MODAL = 'SHOW_CHANGE_BGCOLOR_MODAL';

export const HIDE_CHANGE_BGCOLOR_MODAL = 'HIDE_CHANGE_BGCOLOR_MODAL';

export const SHOW_APPROVAL_PAGE = 'SHOW_APPROVAL_PAGE';

export const HIDE_APPROVAL_PAGE = 'HIDE_APPROVAL_PAGE';

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export const INIT_NOTIFICATION_SYSTEM = 'INIT_NOTIFICATION_SYSTEM';

export const SAVE_COVER_ELEMENTS = 'SAVE_COVER_ELEMENTS';

// action 类型: 是否自动添加当前上传的图片到canvas.
export const AUTO_ADD_PHOTO_TO_CANVAS = 'AUTO_ADD_PHOTO_TO_CANVAS';

export const TOGGLE_PANEL = 'TOGGLE_PANEL';
// --------------------- sidebar actions ------------------------------
export const CHANGE_TAB_IN_SIDEBAR = 'CHANGE_TAB_IN_SIDEBAR';

// --------------------- end sidebar actions ------------------------------


export const UPDATE_IMAGE_CACHE = 'UPDATE_IMAGE_CACHE';

export const CACHE_IMAGE_SUCCESS = 'CACHE_IMAGE_SUCCESS';

export const CACHE_IMAGE_COMPLETED = 'CACHE_IMAGE_COMPLETED';

export const SHOW_PROPERTY_MODAL = 'SHOW_PROPERTY_MODAL';
export const HIDE_PROPERTY_MODAL = 'HIDE_PROPERTY_MODAL';


export const ADD_TEMPLATE = 'ADD_TEMPLATE';

export const ADD_TRACKER = 'ADD_TRACKER';

export const CLEAR_TEMPLATE_LIST = 'CLEAR_TEMPLATE_LIST';

// global loading.
export const SHOW_GLOBAL_LOADING = 'SHOW_GLOBAL_LOADING';
export const HIDE_GLOBAL_LOADING = 'HIDE_GLOBAL_LOADING';
export const COMPLETE_CHANGE_SETTING ='COMPLETE_CHANGE_SETTING';
export const ON_CHANGE_SETTING = 'ON_CHANGE_SETTING'

// action 类型：第三方授权认证
export const SHOW_OAUTH_PAGE = 'SHOW_OAUTH_PAGE';   // 打开第三方授权页
export const HIDE_OAUTH_PAGE = 'HIDE_OAUTH_PAGE';   // 关闭第三方授权页

export const SHOW_OAUTH_LOADING = 'SHOW_OAUTH_LOADING';
export const HIDE_OAUTH_LOADING = 'HIDE_OAUTH_LOADING';

export const SET_OAUTH_USER = 'SET_OAUTH_USER';   // 打开第三方授权页
export const SET_OAUTH_TOKEN = 'SET_OAUTH_TOKEN';   // 关闭第三方授权页
export const ADD_OAUTH_PHOTOS = 'ADD_OAUTH_PHOTOS';

export const SAVE_IMGS_HAS_DOWN = 'SAVE_IMGS_HAS_DOWN';// facebook 存储 ALBUMS
export const GET_FACEBOOK_ALBUMS = 'GET_FACEBOOK_ALBUMS';

export const HIDE_AUTO_UPGRADE_MODAL = 'HIDE_AUTO_UPGRADE_MODAL';
export const SHOW_AUTO_UPGRADE_MODAL = 'SHOW_AUTO_UPGRADE_MODAL';
export const SET_SELECT_PHOTOS = 'SET_SELECT_PHOTOS';
export const DELETE_SELECT_PHOTOS = 'DELETE_SELECT_PHOTOS';
export const MOVE_ALL_PHOTOS_TO_Add_IMAGES = 'MOVE_ALL_PHOTOS_TO_Add_IMAGES';
export const REMOVE_ALL_IMAGES ='REMOVE_ALL_IMAGES';

export const SHOW_SELECT = 'SHOW_SELECT';
export const HIDE_SELECT = 'HIDE_SELECT';

