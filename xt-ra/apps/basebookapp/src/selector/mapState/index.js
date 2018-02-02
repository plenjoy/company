import { Map, fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

const env = state => get(state, 'system.env');
const confirmModal = state => get(state, 'system.modals.confirmModal');
const upgradeModal = state => get(state, 'system.modals.upgradeModal');

// projects
const projects = state => get(state, 'projects.data');

// spec
const spec = state => get(state, 'spec.data');

// 1. env
const getEnvData = createSelector(env, items => items);
const getConfirmModal = createSelector(confirmModal, items => items);
const getUpgradeModal = createSelector(upgradeModal, items => items);

// projects
const getProjectData = createSelector(projects, items => items);
const getProjectSummary = createSelector(getProjectData, project => {
  return project.get('summary');
});

const getVolumes = createSelector(getProjectData, project => {
  return project.get('volumes');
});

// spec
const getSpecData = createSelector(spec, items => items);
const getCurrentSpec = createSelector(getSpecData, getProjectSummary, (spec, summary) => {
  const size = summary.get('size');
  const cover = summary.get('cover');

  return spec.getIn([size, cover]);
});

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  // projects
  originalProjects: getProjectData(state),
  summary: getProjectSummary(state),
  volumes: getVolumes(state),

  // spec
  originalSpec: getSpecData(state),
  currentSpec: getCurrentSpec(state),

  // system
  env: getEnvData(state),
  confirmModal: getConfirmModal(state),
  upgradeModal: getUpgradeModal(state)
});
