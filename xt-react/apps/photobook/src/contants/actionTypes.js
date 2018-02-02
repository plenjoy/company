// --------------------- test actions ------------------------------
export const ADD_TODO = 'ADD_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const DID_RANDOM = 'DID_RANDOM';
// --------------------- end test actions ------------------------------

// --------------------- redo/undo actions ------------------------------
export const REDO = 'REDO';
export const UNDO = 'UNDO';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';
export const START_UNDO = 'START_UNDO';
export const STOP_UNDO = 'STOP_UNDO';

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

export const INIT_SPEC_DATA = 'INIT_SPEC_DATA';

// parser url querystring
export const PARSER_QUERYSTRING = 'PARSER_QUERYSTRING';
// --------------------- project actions ------------------------------

export const GET_PROJECT_DATA = 'GET_PROJECT_DATA';

export const SET_COVER = 'SET_COVER';
export const SET_PAGE_ARRAY = 'SET_PAGE_ARRAY';
export const SET_VARIABLE_MAP = 'SET_VARIABLE_MAP';
export const SET_PARAMETER_MAP = 'SET_PARAMETER_MAP';
export const SET_IMAGE_ARRAY = 'SET_IMAGE_ARRAY';
export const SET_DECORATION_ARRAY = 'SET_DECORATION_ARRAY';
export const SET_IMAGE_USED_MAP = 'SET_IMAGE_USED_MAP';
export const SET_STICKER_USED_MAP = 'SET_STICKER_USED_MAP';

export const CLEAR_ELEMENT_ARRAY = 'CLEAR_ELEMENT_ARRAY';
export const CLEAR_IMAGE_USED_MAP = 'CLEAR_IMAGE_USED_MAP';
export const CLEAR_STICKER_USED_MAP = 'CLEAR_STICKER_USED_MAP';

export const CREATE_DUAL_PAGE = 'CREATE_DUAL_PAGE';
export const CREATE_MULTIPLE_DUAL_PAGE = 'CREATE_MULTIPLE_DUAL_PAGE';
export const DELETE_DUAL_PAGE = 'DELETE_DUAL_PAGE';
export const DELETE_MULTIPLE_DUAL_PAGE = 'DELETE_MULTIPLE_DUAL_PAGE';

export const PROJECT_LOAD_COMPLETED = 'PROJECT_LOAD_COMPLETED';

// 修改项目设置参数
export const INIT_PROJECT_SETTING = 'INIT_PROJECT_SETTING';
export const CHANGE_PROJECT_SETTING = 'CHANGE_PROJECT_SETTING';

export const INIT_BOOK_SETTING = 'INIT_BOOK_SETTING';
export const CHANGE_BOOK_SETTING = 'CHANGE_BOOK_SETTING';

export const CHANGE_PAGE_BGCOLOR = 'CHANGE_PAGE_BGCOLOR';
export const CHANGE_PAGE_DEFAULT_FONT_COLOR = 'CHANGE_PAGE_DEFAULT_FONT_COLOR';

export const UPDATE_PAGE_TEMPLATE_ID = 'UPDATE_PAGE_TEMPLATE_ID';

// 更新封面/内页素材的actions
export const UPDATE_COVER_MATERIAL = 'UPDATE_COVER_MATERIAL';
export const UPDATE_INNER_MATERIAL = 'UPDATE_INNER_MATERIAL';
export const SET_ORIGINAL_MATERIALS = 'SET_ORIGINAL_MATERIALS';
export const DOWNLOAD_MATERIALS_STATUS = 'DOWNLOAD_MATERIALS_STATUS';

export const CREATE_CONTAINER = 'CREATE_CONTAINER';
export const DELETE_CONTAINER = 'DELETE_CONTAINER';

export const MOVE_PAGE_BEFORE = 'MOVE_PAGE_BEFORE';

export const APPLY_TEMPLATE = 'APPLY_TEMPLATE';
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

export const CLEAR_ORDER_INFO = 'CLEAR_ORDER_INFO';

export const UPDATE_SPINE_WIDTH = 'UPDATE_SPINE_WIDTH';

export const SET_APPLY_BOOK_THEME_ID = 'SET_APPLY_BOOK_THEME_ID';

export const CHOSE_THEME_ITEM = 'CHOSE_THEME_ITEM';

// --------------------- system actions ------------------------------

// action类型: 显示modal
export const SHOW_MODAL = 'SHOW_MODAL';

// 设置组件中操作权限.
export const SET_CAPABILITIES = 'SET_CAPABILITIES';

// action类型: 关闭modal
export const CLOSED_MODAL = 'CLOSED_MODAL';

// action类型: 关闭alert
export const CLOSED_ALERT = 'CLOSED_ALERT';

// action类型: 显示alert
export const SHOW_ALERT = 'SHOW_ALERT';

// action类型: 关闭和显示新手指引.
export const SHOW_XTRO_MODAL = 'SHOW_XTRO_MODAL';
export const HIDE_XTRO_MODAL = 'HIDE_XTRO_MODAL';
export const GOTO_INTRO_STEP = 'GOTO_INTRO_STEP';

// action类型：添加上传图片列表
export const ADD_IMAGES = 'ADD_IMAGES';

// action类型：更新ImageId
export const UPDATE_IMAGEID = 'UPDATE_IMAGEID';

// action类型：更新percent
export const UPDATE_PERCENT = 'UPDATE_PERCENT';

// action类型：上传成功
export const UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';

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

// action 类型: 是否自动添加当前上传的图片到canvas.
export const AUTO_ADD_PHOTO_TO_CANVAS = 'AUTO_ADD_PHOTO_TO_CANVAS';

export const TOGGLE_PANEL = 'TOGGLE_PANEL';
export const CHANGE_BOTTOM_PANEL_TAB = 'CHANGE_BOTTOM_PANEL_TAB';
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

// --------------------- themes actions ------------------------------
export const GET_THEMES_CATEGORIES = 'GET_THEMES_CATEGORIES';
export const GET_CATEGORY_THEMES = 'GET_CATEGORY_THEMES';

export const SET_CURRENT_THEME_TYPE = 'SET_CURRENT_THEME_TYPE';
export const HIDE_THEME_OVERLAY_MODAL = 'HIDE_THEME_OVERLAY_MODAL';
export const SHOW_THEME_OVERLAY_MODAL = 'SHOW_THEME_OVERLAY_MODAL';
// --------------------- end themes actions ------------------------------

export const SHOW_SCREENSHOT_MODAL = 'SHOW_SCREENSHOT_MODAL';
export const HIDE_SCREENSHOT_MODAL = 'HIDE_SCREENSHOT_MODAL';

export const SHOW_GLOBAL_LOADING = 'SHOW_GLOBAL_LOADING';
export const HIDE_GLOBAL_LOADING = 'HIDE_GLOBAL_LOADING';

export const SET_THEME_TYPE = 'SET_THEME_TYPE';
export const CHOSE_THEME_CATEGORIES = 'CHOSE_THEME_CATEGORIES';

export const ADD_PROJECT_BACKGROUND = 'ADD_PROJECT_BACKGROUND';
export const DELETE_PROJECT_BACKGROUND = 'DELETE_PROJECT_BACKGROUND';

export const ADD_PROJECT_STICKER = 'ADD_PROJECT_STICKER';
export const DELETE_PROJECT_STICKER = 'DELETE_PROJECT_STICKER';

export const SET_BACKGROUND_ARRAY = 'SET_BACKGROUND_ARRAY';
export const SET_STICKER_ARRAY = 'SET_STICKER_ARRAY';

export const SET_CLIPBOARD_DATA = 'SET_CLIPBOARD_DATA';
export const CLEAR_CLIPBOARD_DATA = 'CLEAR_CLIPBOARD_DATA';

export const ADD_STATUS_COUNT = 'ADD_STATUS_COUNT';
export const UPDATE_STATUS_COUNT = 'UPDATE_STATUS_COUNT';
export const RESET_STATUS_COUNT = 'RESET_STATUS_COUNT';

export const SHOW_GUIDE_lINE_MODAL = 'SHOW_GUIDE_lINE_MODAL';

export const HIDE_GUIDE_lINE_MODAL = 'HIDE_GUIDE_lINE_MODAL';

export const HIDE_USE_SPEC_MODAL = 'HIDE_USE_SPEC_MODAL';
export const SHOW_USE_SPEC_MODAL = 'SHOW_USE_SPEC_MODAL';
