import { get } from 'lodash';
import { createSelector } from 'reselect';

const env = (state) => get(state, 'system.env');
const capabilities = (state) => get(state, 'system.capabilities');

/**
 * 创建具有可记忆的selector
 */
const getEnvData = createSelector(env, items => items);
const getCapabilitiesData = createSelector(capabilities, items => items);

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  env: getEnvData(state),
  capabilities: getCapabilitiesData(state)
});
