import { coverTypes } from '../../../constants/strings';

export const doPrepare = (that) => {
  const {
    boundEnvActions,
    boundSpecActions,
    boundQueryStringActions
  } = that.props;

  // 获取query string并转换成object对象.
  boundQueryStringActions.parser();

  boundEnvActions.getEnv().then(() => {
    boundEnvActions.getUserInfo();

    // 把SC, HC的spec都获取下来.
    boundSpecActions.getSpec(coverTypes.TLBSC, '6X6');
    boundSpecActions.getSpec(coverTypes.TLBHC, '6X6');
  });
};
