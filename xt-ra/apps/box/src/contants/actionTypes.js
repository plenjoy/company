// action类型: 添加新的todo项
export const ADD_TODO = 'ADD_TODO';

// action类型: 完成一个todo项
export const COMPLETE_TODO = 'COMPLETE_TODO';

// action类型: 搜索和过滤todo项列表
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';


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


// --------------------- project actions ------------------------------


// action类型: 获取product数据.
export const GET_PROJECT_DATA = 'GET_PROJECT_DATA';

export const PROJECT_LOAD_COMPLETED = 'PROJECT_LOAD_COMPLETED';

// 修改项目设置参数
export const CHANGE_PROJECT_SETTING = 'CHANGE_PROJECT_SETTING';

// 创建绘图元素
export const CREATE_ELEMENT = 'CREATE_ELEMENT';

// 更新绘图元素的属性
export const UPDATE_ELEMENT = 'UPDATE_ELEMENT';

//
export const ROTATE_COVER = 'ROTATE_COVER';

//
export const INIT_COVER_ROTATE = 'INIT_COVER_ROTATE';

// 删除元素
export const DELETE_ELEMENT = 'DELETE_ELEMENT';

// 选中元素
export const SELECT_ELEMENT = 'SELECT_ELEMENT';

export const CLEAR_ELEMENT_SELECT = 'CLEAR_ELEMENT_SELECT';

// 初始化spread的数据
export const INIT_SPREAD_ARRAY = 'INIT_SPREAD_ARRAY';

export const INIT_IMAGE_USED_COUNT_MAP = 'INIT_IMAGE_USED_COUNT_MAP';

export const UPDATE_IMAGE_USED_COUNT_MAP = 'UPDATE_IMAGE_USED_COUNT_MAP';

// 获取project订单状态
export const SET_PROJECT_ORDERED_STATE = 'SET_PROJECT_ORDERED_STATE';

export const CHANGE_PROJECT_TITLE = 'CHANGE_PROJECT_TITLE';

// Box 2.0
export const INIT_PROJECT_SETTING = 'INIT_PROJECT_SETTING';

export const INIT_COVER = 'INIT_COVER';

export const INIT_PAGE_ARRAY = 'INIT_PAGE_ARRAY';

export const INIT_IMAGE_ARRAY = 'INIT_IMAGE_ARRAY';

export const UPDATE_PROJECT_ID = 'UPDATE_PROJECT_ID';

// --------------------- system actions ------------------------------


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

// action 类型: 保存文字设置
export const SAVE_TEXT_OPTIONS = 'SAVE_TEXT_OPTIONS';

// action 类型: 更新文字位置
export const UPDATE_TEXT_POSITION = 'UPDATE_TEXT_POSITION';

export const NEED_LEAVE_CONFIRM = 'NEED_LEAVE_CONFIRM';

export const NO_NEED_LEAVE_CONFIRM = 'NO_NEED_LEAVE_CONFIRM';

export const SHOW_CLONE_MODAL = 'SHOW_CLONE_MODAL';

export const HIDE_CLONE_MODAL = 'HIDE_CLONE_MODAL';

// --------------------- workspace actions ------------------------------
// action 类型: 更改workspace中的spread
export const CHANGE_WORKSPACE_SPREAD = 'CHANGE_WORKSPACE_SPREAD';

// action 类型: 更改workspace中的spreads
export const UPDATE_WORKSPACE_SPREADS = 'UPDATE_WORKSPACE_SPREADS';

// action 类型: 是否自动添加当前上传的图片到canvas.
export const AUTO_ADD_PHOTO_TO_CANVAS = 'AUTO_ADD_PHOTO_TO_CANVAS';

// action 类型: 显示或隐藏workspace上的操作面板.
export const TOGGLE_OPERATION_PNAEL = 'TOGGLE_OPERATION_PNAEL';

// action 类型: 标记当前的workspace正处于预览状态.
export const IN_PREVIEW_WORKSPACE = 'IN_PREVIEW_WORKSPACE';

// action 类型: 更新当前的工作区域的视口比例.
export const UPDATE_WORKSPACE_RATIO = 'UPDATE_WORKSPACE_RATIO';

// action 类型: 发送埋点请求.
export const ADD_TRACKER = 'ADD_TRACKER';

export const SWITCH_SHEET = 'SWITCH_SHEET';

export const SWITCH_PAGE = 'SWITCH_PAGE';

export const UPDATE_COVER_SNAP = 'UPDATE_COVER_SNAP';

export const SHOW_USE_SPEC_MODAL = 'SHOW_USE_SPEC_MODAL';
export const HIDE_USE_SPEC_MODAL = 'HIDE_USE_SPEC_MODAL';
