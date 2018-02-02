// api的根路径.
export const API_BASE = __DEVELOPMENT__ ? 'http://www.zno.com.dd/' : '/';

// 效果图的根路径
export const materialBasePath = './materials';

// 保存后下单的跳转连接
export const ORDER_PATH = '/<%=orderType%>/addShoppingCart.html?projectGUID=<%=projectId%>';

// 获取产品详情.
export const GET_PROJECT_DATA = '<%=baseUrl%>userid/<%=userId%>/project/<%=projectId%>?webClientId=<%=webClientId%>&autoRandomNum=<%=autoRandomNum%>';

export const GET_PREVIEW_PROJECT_DATA = '<%=uploadBaseUrl%>upload/Preview/GetPhotobookXmlByProjectId?projectId=<%=projectId%>';

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
export const PAINETEXT_SRC = '<%=baseUrl%>api/product/text/textImage?&ratio=<%=ratio%>&color=<%=color%>&align=center&font=<%=fontFamily%>&height=<%=height%>&text=<%=text%>&width=<%=width%>';

// 图片裁剪接口
export const IMAGES_CROPPER = '<%=baseUrl%>imgservice/op/crop';
export const IMAGES_CROPPER_PARAMS = '?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>';

// 图片滤镜接口
export const IMAGES_API = '<%=baseUrl%>imgservice/op/crop';
export const IMAGES_FILTER_PARAMS = '?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>&effectId=<%=effectId%>&opacity=<%=opacity%>&flop=<%=imgFlip%>&shape=<%=shape%>';

// 获取在线的spec.
export const GET_SPEC = '<%=productBaseURL%>product/ProductSpec/parseParametersAll?productType=11&product=TLB&leatherColor=none&paper=SP&paperThickness=TLBthin&client=H5&cover=<%=cover%>&size=<%=size%>&autoRandomNum=<%=autoRandomNum%>';
