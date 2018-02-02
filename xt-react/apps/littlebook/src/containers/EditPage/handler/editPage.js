import { get } from 'lodash';

export const saveProject = (that) => {
  const { env, specVersion, project, boundProjectActions } = that.props;
  const { userInfo } = env;
  boundProjectActions.saveProject(
    project, userInfo, specVersion
  ).then((res) => {
    const isRequestSuccess = (get(res, 'status') === 'success');
    if (isRequestSuccess) {
      boundProjectActions.uploadCoverImage();
    }
  });
};

export const setCenterTop = (that) => {
  const height = window.innerHeight - 130 - 77;
  that.setState({
    centerTop: (height - that.editpageNode.offsetHeight) / 2
  });
};

export const setColorSchemaScaleNumber = (containerHeight) => {
  //右边rightBtn+colorshemy高度
  const rightBtnStyleHight = 445;
  let scaleNumber = ((350 - containerHeight) > 0) ? containerHeight / rightBtnStyleHight : 1;
  scaleNumber = (scaleNumber < 0.3) ? scaleNumber = 0.3 : scaleNumber;
  return scaleNumber;
};
