import { fromJS } from 'immutable';
import * as types from '../../constants/actionTypes';
import {
  selectVolume,
  updateVolumeArray,
  generateVolumeArray,
  generatePreviewVolume
} from '../../utils/projectGenerator';
import {
  getParams
} from '../../utils/specParser';

const initialState = fromJS({
  volumes: [],
  selectedVolume: null,
  summary: {
    client: 'H5',
    cover: 'TLBSC',
    product: 'TLB',
    size: '6X6',
    paper: 'SP',
    paperThickness: 'TLBthin',
    leatherColor: 'none',
    settings: {
      isShowDate: true,
      isShowLocation: true,
      isShowCaption: true
    }
  },
  price: {
    oriPrice: 0,
    sPrice: 0
  },
  pageInfo: {
    max: 0,
    min: 0
  },
  isProjectRending: true
});

const projects = (state = initialState, action) => {
  switch (action.type) {
    case types.GENERATE_VOLUMES: {

      const params = getParams(state.get('summary'), action.spec);
      const volumeLength = params.sheetNumberRange.max * 2 - 1;
      const settings = state.getIn(['summary', 'settings']);

      const volumes = fromJS(generateVolumeArray(action.oAuthUser, action.photoArray, volumeLength, action.preVolumeArray, settings));
      const selectedVolume = volumes.find(volume => volume.get('isSelected'));

      return state.merge(fromJS({
        volumes,
        selectedVolume
      }));
    }
    case types.CHANGE_PAGE_TO_COVER:
    case types.UPDATE_VOLUMES: {

      const params = getParams(state.get('summary'), action.spec);
      const volumeLength = params.sheetNumberRange.max * 2 - 1;
      const volumes = state.get('volumes');
      const settings = state.getIn(['summary', 'settings']);

      const newVolumes = fromJS(generateVolumeArray(null, action.photoArray, volumeLength, volumes, settings, action.coverPhotoId));
      const selectedVolume = newVolumes.find(volume => volume.get('isSelected'));

      return state.merge({
        volumes: newVolumes,
        selectedVolume
      });
    }

    case types.SELECT_VOLUME: {
      const volumes = selectVolume(state.get('volumes'), action.volumeIdx);
      const selectedVolume = volumes.find(volume => volume.get('isSelected'));

      return state.merge(fromJS({
        volumes,
        selectedVolume
      }));
    }

    case types.ORDER_VOLUMES: {
      let newState = state;

      // 遍历volumes
      state.get('volumes').forEach((volume, volumeIdx) => {
        // 当前volume是否在下单列表里面
        const isVolumeInOrderList = action.volumeIds.some(volumeId => volumeId === volume.get('idx'));

        if(isVolumeInOrderList) {
          // 确认下单
          newState = newState.setIn(['volumes', String(volumeIdx), 'isOrder'], true);
        }
      });

      return newState;
    }

    case types.ORDER_ALL_VOLUMES: {
      let newState = state;

      state.get('volumes').forEach((volume, volumeIdx) => {
        if(volume.get('isComplete')) {
          newState = newState.setIn(['volumes', String(volumeIdx), 'isOrder'], true);
        }
      });

      return newState;
    }

    case types.CANCEL_ALL_ORDERED_VOLUMES: {
      let newState = state;

      state.get('volumes').forEach((volume, volumeIdx) => {
        if(volume.get('isComplete')) {
          newState = newState.setIn(['volumes', String(volumeIdx), 'isOrder'], false);
        }
      });

      return newState;
    }

    case types.CHANGE_SETTINGS: {
      let newState = state;
      for(const key in action.settings) {
        newState = newState.setIn(['summary', 'settings', key], action.settings[key]);
      }
      return newState;
    }

    case types.CHANGE_SUMMARY: {
      let newState = state;
      for(const key in action.summary) {
        newState = newState.setIn(['summary', key], action.summary[key]);
      }
      return newState;
    }

    case types.TOGGLE_COVER: {
      return state.getIn(['summary', 'cover']) === 'TLBHC'
        ? state.setIn(['summary', 'cover'], 'TLBSC')
        : state.setIn(['summary', 'cover'], 'TLBHC');
    }

    case types.CHANGE_PRICE: {
      let newState = state;

      if(!state.getIn(['price', 'softCoverOriPrice'])) {
        newState = newState.setIn(['price', 'softCoverOriPrice'], action.price.oriPrice);
      }

      for(const key in action.price) {
        newState = newState.setIn(['price', key], action.price[key]);
      }
      return newState;
    }

    case types.CHANGE_PAGE_INFO: {
      let newState = state;

      for(const key in action.pageInfo) {
        newState = newState.setIn(['pageInfo', key], action.pageInfo[key]);
      }

      return newState;
    }

    case types.SHOW_PROJECT_IS_RENDING: {
      return state.merge({
        isProjectRending: true
      });
    }

    case types.HIDE_PROJECT_IS_RENDING: {
      return state.merge({
        isProjectRending: false
      });
    }

    case types.GET_PREVIEW_PROJECT: {
      let newState = state;

      const projectSpec = fromJS(action.projectSpec);
      const projectCover = fromJS(action.projectCover);
      const projectPages = fromJS(action.projectPages);

      const params = getParams(projectSpec, action.spec);
      const volumeLength = params.sheetNumberRange.max * 2 - 1;

      const volume = generatePreviewVolume(projectSpec, projectCover, projectPages);

      // 设置summary值
      projectSpec.map((value, key) => {
        newState = newState.setIn(['summary', key], value);
      });

      newState = newState.set('volumes', fromJS([volume]));
      newState = newState.set('selectedVolume', fromJS(volume));

      return newState;
    }
    default:
      return state;
  }
};

export default projects;
