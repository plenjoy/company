import { Map, fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

import { getRenderVolume } from '../../utils/computedSize';
import * as materials from '../../sources/material';

const env = state => get(state, 'system.env');
const oAuth = state => get(state, 'system.oAuth');
const photoArray = state => get(state, 'system.photoArray');

const confirmModal = state => get(state, 'system.modals.confirmModal');
const orderModal = state => get(state, 'system.modals.orderModal');
const upgradeModal = state => get(state, 'system.modals.upgradeModal');
const oAuthPage = state => get(state, 'system.modals.oAuthPage');
const oAuthLoading = state => get(state, 'system.modals.oAuthLoading');
const fontCalculator = state => get(state, 'system.modals.fontCalculator');
const incompleteModal = state => get(state, 'system.modals.incompleteModal');
const previewModal = state => get(state, 'system.modals.previewModal');
const sidebar = state => get(state, 'system.sidebar');
const managePhotoFilterPhotoTab = state =>get(state, 'system.sidebar.managePhotoTabIndex');
const ratio = state => get(state, 'system.global.ratio');
const viewProperties = state => get(state, 'system.global.viewProperties');
const isProjectRending = state => get(state, 'system.global.isProjectRending');

// projects
const projects = state => get(state, 'projects.data');

// spec
const spec = state => get(state, 'spec.data');

// system
const getEnvData = createSelector(env, items => items);
const getOAuth = createSelector(oAuth, items => items);
const getPhotoArray = createSelector(photoArray, items => {
  return items || fromJS([]);
});
const getConfirmModal = createSelector(confirmModal, items => items);
const getOrderModal = createSelector(orderModal, items => items);
const getUpgradeModal = createSelector(upgradeModal, items => items);
const getOAuthPage = createSelector(oAuthPage, items => items);
const getOAuthLoading = createSelector(oAuthLoading, items => items);
const getIncompleteModal = createSelector(incompleteModal, items => items);
const getPreviewModal = createSelector(previewModal, items => items);
const getFontCalculator = createSelector(fontCalculator, items => items);
const getSidebarData = createSelector(sidebar, items => items);
const getManagePhotoFilterPhotoTab = createSelector(managePhotoFilterPhotoTab, items => items);
const getRatio = createSelector(ratio, items => items);
const getViewProperties = createSelector(viewProperties, items => items);
const getIsViewRending = createSelector(getViewProperties, viewProperties => {
  return viewProperties.get('isViewRending');
});

// projects
const getProjectData = createSelector(projects, items => items);
const getProjectSummary = createSelector(getProjectData, project => {
  return project.get('summary');
});

const getPrice = createSelector(getProjectData, project => {
  return project.get('price');
});

const getPageInfo = createSelector(getProjectData, project => {
  return project.get('pageInfo');
});

// spec
const getSpecData = createSelector(spec, items => items);
const getCurrentSpec = createSelector(getSpecData, getProjectSummary, (spec, summary) => {
  const size = summary.get('size');
  const cover = summary.get('cover');

  return spec.getIn([size, cover]);
});

const getCurrentMaterials = createSelector(getCurrentSpec, (currentSpec) => {
  let currentMaterials = {};

  if(currentSpec) {
    const cover = currentSpec.getIn(['spec', 'cover']);
    const size = currentSpec.getIn(['spec', 'size']);
    currentMaterials = materials[cover][size];
  }

  return fromJS(currentMaterials);
});

const getVolumes = createSelector(
  getProjectData,
  getRatio,
  getViewProperties,
  getCurrentSpec,
  getCurrentMaterials,
  getEnvData,
  (project, ratio, viewProperties, currentSpec, currentMaterials, env) => {
    const newRatio = ratio.set('coverWorkspace', 0.3);
    let volumes = project.get('volumes');
    volumes.forEach((volumn, idx) => {
      const currentVolumn = getRenderVolume(volumn, newRatio, viewProperties, currentSpec, currentMaterials, env.urls);
      volumes = volumes.set(idx, currentVolumn);
    });
    return volumes;
});

const getSelectedVolume = createSelector(
  getProjectData,
  getRatio,
  getViewProperties,
  getCurrentSpec,
  getCurrentMaterials,
  getEnvData,
  (project, ratio, viewProperties, currentSpec, currentMaterials, env) => {
    const selectedVolume = project.get('selectedVolume');
    return getRenderVolume(selectedVolume, ratio, viewProperties, currentSpec, currentMaterials, env.urls);
});

const getIsPreview = createSelector(getEnvData, (env) => {
  return env.qs.get('isPreview');
});

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export const mapStateToProps = state => ({
  // projects
  originalProjects: getProjectData(state),
  summary: getProjectSummary(state),
  volumes: getVolumes(state),
  selectedVolume: getSelectedVolume(state),
  price: getPrice(state),
  pageInfo: getPageInfo(state),
  isViewRending: getIsViewRending(state),
  isPreview: getIsPreview(state),

  // spec
  originalSpec: getSpecData(state),
  currentSpec: getCurrentSpec(state),

  // system
  env: getEnvData(state),
  oAuth: getOAuth(state),
  photoArray: getPhotoArray(state),
  sidebar: getSidebarData(state),
  managePhotoFilterPhotoTab:getManagePhotoFilterPhotoTab(state),
  confirmModal: getConfirmModal(state),
  orderModal: getOrderModal(state),
  upgradeModal: getUpgradeModal(state),
  oAuthPage: getOAuthPage(state),
  oAuthLoading: getOAuthLoading(state),
  fontCalculator: getFontCalculator(state),
  incompleteModal: getIncompleteModal(state),
  previewModal: getPreviewModal(state),
  ratio: getRatio(state),
  viewProperties: getViewProperties(state),
  materials: getCurrentMaterials(state)
});
