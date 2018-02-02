// api的根路径.
export const API_BASE = __DEVELOPMENT__ ? 'https://www.zno.com.t/' : '/';

// 效果图的根路径
export const materialBasePath = './materials';

// 保存后下单的跳转连接
export const ORDER_PATH = '/<%=orderType%>/addShoppingCart.html?projectGUID=<%=projectId%>';

// 获取产品详情.
export const GET_PROJECT_DATA = '<%=baseUrl%>userid/<%=userId%>/project/<%=projectId%>?webClientId=<%=webClientId%>&autoRandomNum=<%=autoRandomNum%>';

export const GET_PREVIEW_PROJECT_DATA = '<%=baseUrl%>web-api/timeline/preview?projectGUID=<%=initGuid%>';

export const GET_FONTS = '<%=baseUrl%>api/product/text/fontmap';

export const GET_FONT_THUMBNAIL = '<%=baseUrl%>prod-assets/static/font_thumbnail/<%=fontName%>.png';

export const SAVE_PROJECT = '<%=baseUrl%>general/json/<%=userId%>/project/<%=projectId%>/<%=projectType%>';

// 登录接口
export const LOGIN = '<%=baseUrl%>phone/nativeLogin.ep?username=<%=username%>&password=<%=password%>';

export const ORDER = '<%=baseUrl%>image-box/addShoppingCart.html?projectGUID=<%=projectId%>';

// 上传前获取imageids接口
// export const GET_IMAGE_IDS = '<%=uploadBaseUrl%>upload/UploadServer/GetBatchImageIds?imageIdCount=<%=imageIdCount%>';
export const GET_IMAGE_IDS = '<%=baseUrl%>phone/getBatchImageIds.ep?imageIdCount=<%=imageIdCount%>&autoRandomNum=<%=autoRandomNum%>';

// 获取接口的base url.
export const GET_ENV = '<%=baseUrl%>userid/getEnv';

// 获取用户的会话信息.
export const GET_SESSION_USER_INFO = '<%=baseUrl%>BigPhotoBookServlet/getSessionUserInfo?webClientId=<%=webClientId%>&autoRandomNum=<%=autoRandomNum%>';

export const HEART_BEAT = '<%=baseUrl%>userid/<%=userId%>/heartbeat';

// 获取文字图片地址
export const TEXT_SRC = '<%=baseUrl%>api/product/text/textImage?ratio=<%=ratio%>&textAutoWrap=%7B%22autoWrapType%22%3A%22noWrap%22%2C%22autowrapPosition%22%3A%5B%5D%7D&text=<%=text%>&font=<%=fontFamily%>&fontSize=<%=fontSize%>&color=<%=fontColor%>&align=<%=textAlign%>&verticalTextAlign=<%=verticalTextAlign%>&width=<%=width%>&height=<%=height%>&originalWidth=<%=originalWidth%>&originalHeight=<%=originalHeight%>&originalFontSize=<%=originalFontSize%>';
export const PAINETEXT_BASESRC = '<%=baseUrl%>api/product/text/textImage';
export const LTB_PRAINTEDTEXT_SRC = '<%=baseUrl%>api/product/text/textImage';

// 图片裁剪接口
export const IMAGES_CROPPER = '<%=baseUrl%>imgservice/op/crop';
export const IMAGES_CROPPER_PARAMS = '?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>';

// 图片滤镜接口
export const IMAGES_API = '<%=baseUrl%>imgservice/op/crop';
export const IMAGES_FILTER_PARAMS = '?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>&effectId=<%=effectId%>&opacity=<%=opacity%>&flop=<%=imgFlip%>&shape=<%=shape%>';

// 获取在线的spec.
export const GET_SPEC = '<%=baseUrl%>prod-assets/app/timelinebook/spec/<%=cover%>_<%=size%>.json?autoRandomNum=<%=autoRandomNum%>';

// LTB Exclude图片接口
export const ADD_EXCLUDE_PHOTOS = '<%=baseUrl%>web-api/timelinebook/excludeTimelinebookImage?autoRandomNum=<%=autoRandomNum%>';
export const GET_EXCLUDE_PHOTOS = '<%=baseUrl%>web-api/timelinebook/timelineExcludeImages?customerId=<%=customerId%>&autoRandomNum=<%=autoRandomNum%>';
export const DELETE_EXCLUDE_PHOTOS = '<%=baseUrl%>web-api/timelinebook/delTimelinebookExcludeImage?autoRandomNum=<%=autoRandomNum%>';

// 价格接口
export const ITEM_PRICE = '<%=baseUrl%>clientH5/product/book/price?product=<%=product%>&options=<%=options%>&autoRandomNum=<%=autoRandomNum%>';

// 保存新项目的接口
export const NEW_PROJECT = '<%=baseUrl%>general/json/<%=userId%>/project/<%=projectType%>';

// 上传 缩略图的 接口
export const UPLOAD_COVER_IMAGE = '<%=uploadBaseUrl%>upload/servlet/UploadCoverImgServlet';

export const UPLOAD_THIRD_PARTY_IMAGES = '<%=baseUrl%>web-api/img/uploadThirdPartyImages';
