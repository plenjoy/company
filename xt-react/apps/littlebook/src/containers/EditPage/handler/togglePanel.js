import { get } from 'lodash';
import { updateWorkspaceRatio, computedWorkSpaceOffset } from '../../../utils/computedRatio';

/**
 * 当改变显示档时触发.
 * @param  {[type]} that [description]
 * @param  {number} step 0/1/2
 * @return {[type]}      [description]
 */
export const onChangeStep = (that, step) => {
  const { boundRatioActions, boundTogglePanelActions, size, settings } = that.props;

  // 判断当前的书是landscape/square/portrait
  const productSize = get(settings, 'spec.size');
  const offset = computedWorkSpaceOffset(productSize, step);

  updateWorkspaceRatio(boundRatioActions, size, offset);
  boundTogglePanelActions.changePanelStep(step);

  that.setState({
    panelStep: step
  });
};
