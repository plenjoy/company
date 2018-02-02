// api的根路径.
export const API_BASE = __DEVELOPMENT__ ? 'https://www.zno.com.t/' : '/';

// 效果图的根路径
export const materialBasePath = './materials';

// 获取todo列表的api接口
export const GET_TODO_LIST = '../../imagebox/src/sources/data.json';

// 获取产品spec详情: http://api.zno.com/product/spec/product-spec?productType=1
export const GET_SPEC_VERSION_DATA =
  '<%=productBaseURL%>product/spec/product-spec?productType=1';
export const GET_DEV_SPEC = `./spec.xml?timestamp=${Date.now()}`;

// 获取产品详情.
export const GET_PROJECT_DATA =
  '<%=baseUrl%>userid/<%=userId%>/project/<%=projectId%>?webClientId=<%=webClientId%>&autoRandomNum=<%=autoRandomNum%>';

export const GET_PROJECT_TITLE =
  '<%=baseUrl%>web-api/customerId/<%=userId%>/getProjectNameByProjectId?projectId=<%=projectId%>';

export const GET_PREVIEW_PROJECT_DATA =
  '<%=uploadBaseUrl%>upload/Preview/GetPhotobookXmlByProjectId?projectId=<%=projectId%>';

export const GET_FONTS = '<%=baseUrl%>api/product/text/fontmap';

export const GET_FONT_THUMBNAIL =
  '<%=baseUrl%>prod-assets/static/font_thumbnail/<%=fontName%>.png';

export const GET_BOX_SPEC =
  '<%=baseUrl%>template-resources/h5Client/data/<%=size%>SPEC_<%=type%>_<%=spineThickness%>.zip';

export const NEW_PROJECT =
  '<%=baseUrl%>general/json/<%=userId%>/project/<%=projectType%>';

export const SAVE_PROJECT =
  '<%=baseUrl%>general/json/<%=userId%>/project/<%=projectId%>/<%=projectType%>';

// 获取项目的订单信息.
export const GET_PROJECT_ORDERED_STATUS =
  '<%=baseUrl%>userid/<%=userId%>/getProjectOrderedState/<%=projectId%>?isParentBook=false';

// 提交打回的订单.
export const SUBMIT_CHECK_FAIL_PROJECT =
  '<%=baseUrl%>userid/<%=userId%>/submitCheckFailProject/<%=projectId%>?redirectParentBook=false&isParentBook=false';

// 登录接口
export const LOGIN =
  '<%=baseUrl%>phone/nativeLogin.ep?username=<%=username%>&password=<%=password%>';

export const ORDER =
  '<%=baseUrl%>image-box/addShoppingCart.html?projectGUID=<%=projectId%>';

// 上传前获取imageids接口
// export const GET_IMAGE_IDS = '<%=uploadBaseUrl%>upload/UploadServer/GetBatchImageIds?imageIdCount=<%=imageIdCount%>';
export const GET_IMAGE_IDS =
  '<%=baseUrl%>phone/getBatchImageIds.ep?imageIdCount=<%=imageIdCount%>&autoRandomNum=<%=autoRandomNum%>';

// 图片上传接口
export const UPLOAD_IMAGES = '<%=uploadBaseUrl%>upload/UploadServer/uploadImg';
// 图片上传接口
export const AUTH_UPLOAD_IMAGES =
  '<%=uploadBaseUrl%>upload/UploadServer/uploadImg';

// 图片裁剪接口
export const IMAGES_CROPPER = '<%=baseUrl%>imgservice/op/crop';
export const IMAGES_CROPPER_PARAMS = '?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>&timestamp=<%=timestamp%>&customerId=<%=customerId%>&token=<%=token%>&encProjectId=<%=encProjectId%>';

// 图片滤镜接口
export const IMAGES_API = '<%=baseUrl%>imgservice/op/crop';
export const IMAGES_FILTER_PARAMS = '?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>&effectId=<%=effectId%>&opacity=<%=opacity%>&flop=<%=imgFlip%>&shape=<%=shape%>&timestamp=<%=timestamp%>&customerId=<%=customerId%>&token=<%=token%>&encProjectId=<%=encProjectId%>';

// 获取接口的base url.
export const GET_ENV = '<%=baseUrl%>userid/getEnv';

// 获取用户的会话信息.
export const GET_SESSION_USER_INFO =
  '<%=baseUrl%>BigPhotoBookServlet/getSessionUserInfo?webClientId=<%=webClientId%>&autoRandomNum=<%=autoRandomNum%>';

export const HEART_BEAT = '<%=baseUrl%>userid/<%=userId%>/heartbeat';

// 获取用户的album id.
export const GET_USER_ALBUM_ID =
  '<%=baseUrl%>userid/<%=userId%>/getAlbumId?projectId=<%=projectId%>';

export const ADD_ALBUM =
  '<%=baseUrl%>userid/<%=userId%>/addOrUpdateAlbum?albumName=<%=albumName%>&projectId=<%=projectId%>&webClientId=<%=webClientId%>&autoRandomNum=<%=autoRandomNum%>';

export const SAVE_PROJECT_TITLE =
  '<%=baseUrl%>web-api/customerId/<%=userId%>/updateProjectAndAlbumTitle?projectId=<%=projectId%>&projectName=<%=projectName%>';

// 获取产品的price
export const GET_PRODUCT_PRICE =
  '<%=baseUrl%>clientH5/product/book/price?product=<%=product%>&options=<%=options%>';

// 获取图片地址
export const IMAGE_SRC = 'upload/UploadServer/PicRender';

// 获取图片库里面的照片；
export const MY_PHOTOS = '<%=baseUrl%>web-api/customer/getMyPhotosInfo';

// 获取文字图片地址
export const TEXT_SRC =
  '<%=baseUrl%>api/product/text/textImage?ratio=<%=ratio%>&textAutoWrap=%7B%22autoWrapType%22%3A%22noWrap%22%2C%22autowrapPosition%22%3A%5B%5D%7D&text=<%=text%>&font=<%=fontFamily%>&fontSize=<%=fontSize%>&color=<%=fontColor%>&align=<%=textAlign%>&verticalTextAlign=<%=verticalTextAlign%>&width=<%=width%>&height=<%=height%>&originalWidth=<%=originalWidth%>&originalHeight=<%=originalHeight%>&originalFontSize=<%=originalFontSize%>';
export const PAINETEXT_SRC =
  '<%=baseUrl%>api/product/text/textImage?&ratio=<%=ratio%>&color=<%=color%>&align=center&font=<%=fontFamily%>&height=<%=height%>&text=<%=text%>&width=<%=width%>';

// 获取模板地址
export const GET_TEMPLATE_LIST =
  '<%=baseUrl%>template/global/getTemplateListByProductInfo?cover=<%=cover%>&size=<%=size%>&isCoverTemplate=1&category=AB&product=V2_LITTLEBLACKBOOK';
export const GET_INNER_TEMPLATE_LIST =
  '<%=baseUrl%>template/global/getTemplateListByProductInfo?size=<%=size%>&isCoverTemplate=0&category=AB&product=V2_LITTLEBLACKBOOK';

// 获取模板详情
export const GET_TEMPLATE_DATA =
  '<%=baseUrl%>template/global/item/guid/viewData';
export const GET_RELATION_TEMPLATE =
  '<%=baseUrl%>template/global/getRelationTemplate.ep?templateGUID=<%=templateGUID%>&size=<%=size%>&coverType=<%=coverType%>&autoRandomNum=<%=autoRandomNum%>';

// 模板图片地址
export const TEMPLATE_SRC =
  '<%=templateThumbnailPrefx%><%=size%>/<%=guid%>.jpg?size=<%=size%>';

// 获取装饰地址
export const GET_STICKER_LIST =
  '<%=productBaseURL%>product/decoration/assetList?webClientId=1&&autoRandomNum=<%=autoRandomNum%>&type=sticker&productType=PB';

// 装饰图片地址
export const STICKER_SRC = '<%=stickerThumbnailPrefix%><%=guid%>.png';

// Download Book Spec的地址
export const DOWNLOAD_BOOKSPEC_URL =
  '<%=baseUrl%>userid/download?photoBookName=<%=bookName%>&cover=<%=cover%>&size=<%=size%>&client=h5';
// book FAQ 地址
export const FAQ_ADDRESS = 'http://zno.instaknowledgebase.com/category?id=29';
// 提交  contact US 的地址
export const CONTACT_US = '<%=baseUrl%>userid/service/feedback';
// 校验 template name 是否重名的接口
export const CHECK_TEMPLATE_NAME =
  '<%=baseUrl%>template/global/isTemplateExist?customerId=<%=userId%>&name=<%=name%>&size=<%=size%>&sheetType=<%=sheetType%>';
// 保存 template 的接口地址
export const SAVE_TEMPLATE = '<%=baseUrl%>template/global/item/save/';
// 保存后下单的跳转连接
export const ORDER_PATH =
  '/<%=orderType%>/addShoppingCart.html?projectGUID=<%=projectId%>';
export const PARENT_BOOK_PATH =
  '/prod-assets/app/photobook/index.html?initGuid=<%=projectId%>&webClientId=1';

// 校验 title 可用性的接口
export const CHECK_PROJECT_TITLE = '<%=baseUrl%>frontPages/checkProjectName.ep';
// 上传 缩略图的 接口
export const UPLOAD_COVER_IMAGE =
  '<%=uploadBaseUrl%>upload/servlet/UploadCoverImgServlet?timestamp=<%=timestamp%>&customerId=<%=customerId%>&token=<%=token%>';

// 获取分享链接的 接口
export const GET_SHARE_URLS =
  '<%=baseUrl%>clientH5/getShareUrls?initGuid=<%=projectid%>&product=<%=projectType%>';

// 查看当前项是否在购物车中和下单情况的接口。
export const CHECK_PROJECT_INFO =
  '<%=baseUrl%>clientH5/projectInfo/<%=projectid%>?<%=autoRandomNum%>';
// 删除自定义模板
// http://www.zno.com.d/template/global/item/delete/83500?customerId=206300
export const DELETE_TEMPLATE =
  '<%=baseUrl%>template/global/item/delete/<%=templateId%>?customerId=<%=userId%>';

export const DELETE_SERVER_PHOTOS = '<%=baseUrl%>web-api/album/deleteImages';
