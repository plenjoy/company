import Immutable from 'immutable';

import * as types from '../../constants/actionTypes';
import elements from './elementArrayReducer';

const coverReducer = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case types.SET_COVER: {
      const { cover } = action;
      if (Immutable.Map.isMap(cover)) {
        return cover;
      }

      return state;
    }
    case types.CREATE_ELEMENTS: {
      const { pageId } = action;

      const containers = state.get('containers');

      const theContainerIndex = containers.findIndex(o => o.get('id') === pageId);
      if (theContainerIndex !== -1) {
        const oldElements = containers.getIn(
          [String(theContainerIndex), 'elements']
        );

        return state.setIn(
          ['containers', String(theContainerIndex), 'elements'],
          elements(oldElements, action)
        );
      }

      return state;
    }
    // 删除封面元素时，会遍历封面所有container进行删除
    case types.DELETE_ELEMENTS: {
      const { elementIds } = action;

      let newState = state;

      elementIds.forEach((elementId) => {
        const containers = newState.get('containers');

        const theContainerIndex = containers.findIndex((container) => {
          return container.get('elements')
            .map(o => o.get('id'))
            .indexOf(elementId) !== -1;
        });

        if (theContainerIndex !== -1) {
          const oldElements = containers.getIn(
            [String(theContainerIndex), 'elements']
          );

          newState = newState.setIn(
            ['containers', String(theContainerIndex), 'elements'],
            elements(oldElements, action)
          );
        }
      });

      return newState;
    }
    case types.UPDATE_ELEMENTS: {
      const { updateObjectArray } = action;

      let newState = state;
      updateObjectArray.forEach((updateObject) => {
        const pageId = updateObject.get('pageId');
        const updateElements = updateObject.get('elements');

        const containers = newState.get('containers');
        const theContainerIndex = containers.findIndex(o => o.get('id') === pageId);
        if (theContainerIndex !== -1) {
          const oldElements = containers.getIn([String(theContainerIndex), 'elements']);

          newState = newState.setIn(
            ['containers', String(theContainerIndex), 'elements'],
            elements(oldElements, action, updateElements)
          );
        }
      });

      return newState;
    }

    case types.CHANGE_CALENDAR_SETTING: {
      const { calendarSetting } = action;
      if(calendarSetting.get('startYear')){
        const oldYear = state.getIn(['containers', '0', 'year']);
        const newStartYear = calendarSetting.get('startYear');
        if(oldYear && oldYear != newStartYear) {
          return state.setIn(['containers', '0', 'year'], newStartYear);
        }
      }
      return state;
    }

    case types.APPLY_TEMPLATE_TO_PAGES: {
      const { templateDataArray } = action;
      let newContainers = state.get('containers');

      templateDataArray.forEach((templateData) => {
        const pageId = templateData.get('pageId');
        const templateId = templateData.get('templateId');
        const templateElements = templateData.get('elements');

        const theContainerIndex = newContainers.findIndex(o => o.get('id') === pageId);

        if (theContainerIndex !== -1) {
          const theContainer = newContainers.get(theContainerIndex);
          newContainers = newContainers.set(
            String(theContainerIndex),
            theContainer.merge({
              template: {
                tplGuid: templateId
              },
              elements: templateElements
            })
          );
        }
      });

      return state.set('containers', newContainers);
    }
    case types.UPDATE_PAGE_TEMPLATE_ID: {
      const { pageId, templateId } = action;
      const containers = state.get('containers');

      const theContainerIndex = containers.findIndex(o => o.get('id') === pageId);
      if (theContainerIndex !== -1) {
        return state.setIn(
          ['containers', String(theContainerIndex), 'template', 'tplGuid'], templateId
        );
      }

      return state;
    }
    case types.DELETE_ALL: {
      let newContainers = state.get('containers');

      newContainers.forEach((container, index) => {
        const oldElements = container.get('elements');

        newContainers = newContainers.set(
          String(index),
          container.merge({
            elements: elements(oldElements, action),
            template: {
              tplGuid: ''
            }
          })
        );
      });

      return state.set('containers', newContainers);
    }
    default:
      return state;
  }
};

export default coverReducer;
