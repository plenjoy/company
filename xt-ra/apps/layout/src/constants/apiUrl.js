// api的根路径.
export const API_BASE = __DEVELOPMENT__ ? 'https://www.zno.com.t/' : '/';

// 获取接口的base url.
export const GET_ENV = '<%=baseUrl%>userid/getEnv';

// 获取template信息接口
export const GET_TEMPLATE =
  '/portal/templateService/getTemplateInfo.ep?uidpk=<%=uidpk%>';

// 获取spread信息接口
export const GET_SPREAD = '/portal/templateService/getBookInformation.ep';

// save接口
export const SAVE_TEMPLATE = '/portal/templateService/updateOrSubmitTemplate.ep';

// publish接口
// export const PUBLISH_TEMPLATE = '/portal/templateService/publishTemplate.ep';
export const PUBLISH_TEMPLATE = '/portal/templateService/updateOrSubmitTemplate.ep';

// copy接口
export const COPY_TEMPLATE =
  '/portal/templateService/copyTemplate.ep?uidpk=<%=uidpk%>';

// get fonts
export const GET_FONTS =
  '<%=baseUrl%>api/product/font/fontlist?groupIds=base_fonts,card_designer_fonts';
export const GET_FONT_THUMBNAIL =
  '<%=baseUrl%>prod-assets/static/font_thumbnail/<%=fontName%>.png';

// get Style list
export const GET_STYLE_LIST =
  '/portal/templateService/getStyleList.ep?styleSize=<%=styleSize%>&styleType=<%=styleType%>';

// get test image url
export const GET_TEST_IMAGE_URL = '<%=calendarBaseUrl%>styleimage/<%=guid%>/<%=position%>_1000.jpg';

// get live image url
export const GET_LIVE_IMAGE_URL = '<%=calendarBaseUrl%>styleimage/<%=guid%>/<%=position%>_1000.jpg';

// 获取文字图片地址
export const TEXT_SRC =
  '<%=baseUrl%>api/product/text/textImage?ratio=<%=ratio%>&textAutoWrap=%7B%22autoWrapType%22%3A%22noWrap%22%2C%22autowrapPosition%22%3A%5B%5D%7D&text=<%=text%>&font=<%=fontFamily%>&fontSize=<%=fontSize%>&color=<%=fontColor%>&align=<%=textAlign%>&verticalTextAlign=<%=verticalTextAlign%>&width=<%=width%>&height=<%=height%>&originalWidth=<%=originalWidth%>&originalHeight=<%=originalHeight%>&originalFontSize=<%=originalFontSize%>&lineSpacing=<%=lineSpacing%>';

export const GET_TAG_LIST = '<%=wwwBaseUrl%>web-api/decoration/getCardTagList';
