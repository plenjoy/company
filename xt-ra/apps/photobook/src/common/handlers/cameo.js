import { get, merge, forIn } from 'lodash';
import Element from '../../utils/entries/element';
import {
  elementTypes,
  DEFAULT_CAMEO_SIZE,
  DEFAULT_CAMEO_SHAPE
} from '../../contants/strings';
import { computedCameoElementOptions } from '../../utils/cameo';

/**
 * 创建一个新的cameo 元素.
 * @param  that editPage组件的this指向.
 */
const createNewCameoElement = (that) => {
  const {
    parameters,
    size,
    paginationSpread,
    boundProjectActions,
    allSheets,
    settings
  } = that.props;

  const cameoSize = parameters.get('cameoSize').toJS();
  const cameoBleed = parameters.get('cameoBleed').toJS();

  // 计算新的天窗的基本属性: { x, y, px, py, pw, ph }
  const options = computedCameoElementOptions(size.coverSpreadSize, cameoSize, cameoBleed, size.spineSize.width);

  const newElement = new Element(merge({}, options, {
    type: elementTypes.cameo,
    elType: 'cameo'
  }));

  // cameoelement始终添加在封面上
  if (allSheets.getIn([0, 'pageIds', 0])) {
    boundProjectActions.createElement(
      Object.assign({}, newElement, {
        cameo: DEFAULT_CAMEO_SIZE,
        cameoShape: DEFAULT_CAMEO_SHAPE
      }),
      allSheets.getIn([0, 'pageIds', 0])
    );
    showCameoActionBar(that);
  }
};

/**
 * 显示天窗的action bar
 */
const showCameoActionBar = (that) => {
  that.setState({
    isCameoActionBarShow: true
  });
};

/**
 * 隐藏天窗的action bar
 */
export const hideCameoActionBar = (that) => {
  that.setState({
    isCameoActionBarShow: false
  });
};

/**
 * 添加cameo天窗
 * @param  that editPage组件的this指向.
 */
export const onAddCameo = (that, event) => {
  //  添加天窗的埋点。
  const e = event || window.event;
  const { boundTrackerActions } = that.props;
  const { cameo } = that.state;
  boundTrackerActions.addTracker('AddCameo');
  if (cameo.cameo && cameo.cameoShape) {
    restoreCameoSetting(that, () => {
      createNewCameoElement(that);
    });
  }
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
};

/**
 * 删除cameo天窗
 * @param  that editPage组件的this指向.
 */
export const onRemoveCameo = (that) => {
  // 删除天窗的埋点。
  const { boundTrackerActions } = that.props;
  boundTrackerActions.addTracker('RemoveCameo');

  const { paginationSpread, boundProjectActions } = that.props;
  const summary = paginationSpread.get('summary');
  const elements = paginationSpread.getIn(['pages', 0, 'elements']);

  let elementId = null;

  elements.forEach((ele, index) => {
    if (ele.get('type') === elementTypes.cameo) {
      elementId = ele.get('id');
    }
  });

  if (elementId) {
    boundProjectActions.deleteElement(elementId, summary.get('pageId'));
  }
};

/**
 * 重置cameo setting
 */
const restoreCameoSetting = (that, next) => {
  const { boundProjectActions } = that.props;
  const { cameo } = that.state;
  boundProjectActions.changeProjectSetting(cameo).then(() => {
    next();
  });
};
