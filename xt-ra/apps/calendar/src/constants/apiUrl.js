// api的根路径.
export const API_BASE = __DEVELOPMENT__ ? 'https://www.zno.com.tt/' : '/';

// 效果图的根路径
export const materialBasePath = './materials';

// 保存后下单的跳转连接
export const ORDER_PATH =
  '/<%=orderType%>/addShoppingCart.html?projectGUID=<%=projectId%>';

// 获取产品详情.
export const GET_PROJECT_DATA =
  '<%=baseUrl%>userid/<%=userId%>/project/<%=projectId%>?autoRandomNum=<%=autoRandomNum%>';

export const GET_PREVIEW_PROJECT_DATA =
  '<%=uploadBaseUrl%>upload/Preview/GetPhotobookXmlByProjectId?projectId=<%=projectId%>';

export const GET_MAIN_PROJECT_IMAGE =
  '<%=baseUrl%>clientH5/project/imageInfo?projectId=<%=mainProjectUid%>&autoRandomNum=<%=autoRandomNum%>';

// 提交打回的订单.
export const SUBMIT_CHECK_FAIL_PROJECT =
  '<%=baseUrl%>userid/<%=userId%>/submitCheckFailProject/<%=projectId%>?redirectParentBook=false&isParentBook=false';

export const GET_FONTS = '<%=baseUrl%>api/product/text/fontmap';

export const GET_FONT_THUMBNAIL =
  '<%=baseUrl%>prod-assets/static/font_thumbnail/<%=fontName%>.png';

export const NEW_PROJECT =
  '<%=baseUrl%>general/json/<%=userId%>/project/<%=projectType%>';

export const SAVE_PROJECT =
  '<%=baseUrl%>general/json/<%=userId%>/project/<%=projectId%>/<%=projectType%>';

export const GET_PROJECT_TITLE =
  '<%=baseUrl%>web-api/customerId/<%=userId%>/getProjectNameByProjectId?projectId=<%=projectId%>';

export const SAVE_PROJECT_TITLE =
  '<%=baseUrl%>web-api/customerId/<%=userId%>/updateProjectAndAlbumTitle?projectId=<%=projectId%>&projectName=<%=projectName%>';

// 登录接口
export const LOGIN =
  '<%=baseUrl%>phone/nativeLogin.ep?username=<%=username%>&password=<%=password%>';

export const ORDER =
  '<%=baseUrl%>image-box/addShoppingCart.html?projectGUID=<%=projectId%>';

// 上传前获取imageids接口
// export const GET_IMAGE_IDS = '<%=uploadBaseUrl%>upload/UploadServer/GetBatchImageIds?imageIdCount=<%=imageIdCount%>';
export const GET_IMAGE_IDS =
  '<%=baseUrl%>phone/getBatchImageIds.ep?imageIdCount=<%=imageIdCount%>&autoRandomNum=<%=autoRandomNum%>';

// 获取图片库里面的照片；
export const MY_PHOTOS = '<%=baseUrl%>web-api/customer/getMyPhotosInfo';

// 获取接口的base url.
export const GET_ENV = '<%=baseUrl%>userid/getEnv';

// 获取用户的会话信息.
export const GET_SESSION_USER_INFO =
  '<%=baseUrl%>BigPhotoBookServlet/getSessionUserInfo?webClientId=<%=webClientId%>&autoRandomNum=<%=autoRandomNum%>';

export const HEART_BEAT = '<%=baseUrl%>userid/<%=userId%>/heartbeat';

// 获取文字图片地址
export const TEXT_SRC =
  '<%=baseUrl%>api/product/text/textImage?ratio=<%=ratio%>&textAutoWrap=%7B%22autoWrapType%22%3A%22noWrap%22%2C%22autowrapPosition%22%3A%5B%5D%7D&text=<%=text%>&font=<%=fontFamily%>&fontSize=<%=fontSize%>&color=<%=fontColor%>&align=<%=textAlign%>&verticalTextAlign=<%=verticalTextAlign%>&width=<%=width%>&height=<%=height%>&originalWidth=<%=originalWidth%>&originalHeight=<%=originalHeight%>&originalFontSize=<%=originalFontSize%>';
export const PAINETEXT_SRC =
  '<%=baseUrl%>api/product/text/textImage?&ratio=<%=ratio%>&color=<%=color%>&align=center&font=<%=fontFamily%>&height=<%=height%>&text=<%=text%>&width=<%=width%>';

// 图片裁剪接口
export const IMAGES_CROPPER = '<%=baseUrl%>imgservice/op/crop';
export const IMAGES_CROPPER_PARAMS = '?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>&timestamp=<%=timestamp%>&customerId=<%=customerId%>&token=<%=token%>&encProjectId=<%=encProjectId%>';

// 图片滤镜接口
export const IMAGES_API = '<%=baseUrl%>imgservice/op/crop';
export const IMAGES_FILTER_PARAMS = '?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>&effectId=<%=effectId%>&opacity=<%=opacity%>&flop=<%=imgFlip%>&shape=<%=shape%>&timestamp=<%=timestamp%>&customerId=<%=customerId%>&token=<%=token%>&encProjectId=<%=encProjectId%>';

// 获取日历图片接口
export const CALENDAR_IMAGE =
  '<%=baseUrl%>artwork/dateimage/<%=dateStyle%>/<%=productType%>_<%=size%>_<%=year%>-<%=month%>_<%=imageSize%>.png';

// 获取在线的spec.
export const GET_SPEC_VERSION_DATA =
  '<%=productBaseURL%>product/spec/product-spec?productType=4';

// 获取项目的订单信息.
export const GET_PROJECT_ORDERED_STATUS =
  '<%=baseUrl%>userid/<%=userId%>/getProjectOrderedState/<%=projectId%>';

export const GET_USER_ALBUM_ID =
  '<%=baseUrl%>userid/<%=userId%>/getAlbumId?projectId=<%=projectId%>';

export const ADD_ALBUM =
  '<%=baseUrl%>userid/<%=userId%>/addOrUpdateAlbum?albumName=<%=albumName%>&projectId=<%=projectId%>&webClientId=<%=webClientId%>&autoRandomNum=<%=autoRandomNum%>';

export const CONTACT_US = '<%=baseUrl%>userid/service/feedback';

// 图片上传接口
export const UPLOAD_IMAGES = '<%=uploadBaseUrl%>upload/UploadServer/uploadImg';

// 获取图片地址
export const IMAGE_SRC = 'upload/UploadServer/PicRender';

// 将imageIds转换成encImageIds
export const GET_ENCODE_IMAGE_IDS = '<%=baseUrl%>userid/getEncImgIds';

export const GET_TEMPLATE_LIST =
  '<%=baseUrl%>template/global/list?designSize=<%=designSize%>&imageNum=0&autoRandomNum=<%=autoRandomNum%>&customerId=<%=customerId%>&webClientId=1&productType=<%=productType%>';

export const APPLY_LAYOUT = '<%=baseUrl%>/template/global/item/guid/viewData';

export const GET_STYLE_LIST =
  '<%=baseUrl%>calendarStyle/getCalendarStyleList?size=<%=size%>&autoRandomNum=<%=autoRandomNum%>&webClientId=1&type=<%=productType%>';

// 模板图片地址 更新缓存的图片
export const TEMPLATE_SRC =
  '<%=templateThumbnailPrefx%>TemplateThumbnail/<%=size%>/<%=guid%>.jpg?size=<%=size%>&randomMumber=<%=randomMumber%>';

export const GET_PRODUCT_PRICE =
  '<%=baseUrl%>clientH5/product/book/price?product=<%=product%>&options=<%=options%>';

// 校验 title 可用性的接口
export const CHECK_PROJECT_TITLE = '<%=baseUrl%>frontPages/checkProjectName.ep';

// 上传 缩略图的 接口
export const UPLOAD_COVER_IMAGE =
  '<%=uploadBaseUrl%>upload/servlet/UploadCoverImgServlet?timestamp=<%=timestamp%>&customerId=<%=customerId%>&token=<%=token%>';

// 同步删除服务端已上传图片的接口
export const DELETE_SERVER_PHOTOS = '<%=baseUrl%>web-api/album/deleteImages';
