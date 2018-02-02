import { elementTypes, pageTypes, defaultFontStyle } from '../../../contants/strings';

/**
 * 初始化UsbTextElement
 * @param {*} options 
 */
export const initialUsbTextElement = (options) => {
  const {
    setting,
    pageArray,
    variableMap: { usbTextSize },
    boundProjectActions
  } = options;

  // 从page里面找到usbPage
  const usbPage = pageArray.find(page => page.type === pageTypes.usb);

  // 如果有usbpage有elements，跳出创建
  if(!usbTextSize || !usbPage || usbPage.elements.length !== 0) return;

  const {
    width: pageWidth,
    height: pageHeight
  } = usbPage;

  // 通过spec中定义的usb打字真实范围，计算出真实page的top，left偏移量
  const offsetLeft = (pageWidth - usbTextSize.width) / 2;
  const offsetTop = (pageHeight - usbTextSize.height) / 2;

  // 生成偏移量，长宽与page的拉伸比
  const px =  offsetLeft / pageWidth;
  const py =  offsetTop / pageHeight;
  const pw =  usbTextSize.width / pageWidth;
  const ph =  usbTextSize.height / pageHeight;

  // 准备UsbElement数据
  const usbTextElement = {
    type: elementTypes.usbText,
    elType: 'text',
    px,
    py,
    pw,
    ph,
    x: px * pageWidth,
    y: py * pageHeight,
    height: usbTextSize.height,
    width: usbTextSize.width,
    fontColor: '#000000',
    fontFamilyId: defaultFontStyle.defaultFontFamilyId,
    fontId: defaultFontStyle.defaultFontId,
    fontFamily: defaultFontStyle.defaultFontFamily,
    fontWeight: defaultFontStyle.defaultFontWeight,
    textAlign: 'center',
    dep: 1,
    rot: 0,
    text: ''
  };

  // 给usbPage新建一个usb类型的element
  boundProjectActions.createElement(usbPage.id, usbTextElement);
}