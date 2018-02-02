import Immutable from 'immutable';

import * as types from '../../contants/actionTypes';
import undoable from '../../utils/undoable';
import { getSpineTextRect } from '../../utils/spine';
import { elementTypes } from '../../contants/strings';
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

      const theContainerIndex = containers.findIndex(
        o => o.get('id') === pageId
      );
      if (theContainerIndex !== -1) {
        const oldElements = containers.getIn([
          String(theContainerIndex),
          'elements'
        ]);

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
          return (
            container
              .get('elements')
              .map(o => o.get('id'))
              .indexOf(elementId) !== -1
          );
        });

        if (theContainerIndex !== -1) {
          const oldElements = containers.getIn([
            String(theContainerIndex),
            'elements'
          ]);

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
        const theContainerIndex = containers.findIndex(
          o => o.get('id') === pageId
        );
        if (theContainerIndex !== -1) {
          const oldElements = containers.getIn([
            String(theContainerIndex),
            'elements'
          ]);

          newState = newState.setIn(
            ['containers', String(theContainerIndex), 'elements'],
            elements(oldElements, action, updateElements)
          );
        }
      });

      return newState;
    }
    case types.UPDATE_SPINE_WIDTH: {
      const { spineWidth } = action;
      const containers = state.get('containers');

      if (containers) {
        const spineContainerIndex = containers.findIndex((o) => {
          return o.get('type') === 'Spine';
        });

        const backContainerIndex = containers.findIndex((o) => {
          return o.get('type') === 'Back';
        });

        const fullContainerIndex = containers.findIndex((o) => {
          return o.get('type') === 'Full';
        });

        let newState = state;

        if (spineContainerIndex !== -1) {
          const spineContainer = containers.get(spineContainerIndex);
          const newSpineWidth = spineContainer.get('width') + spineWidth;
          const newSpineContainer = spineContainer.set('width', newSpineWidth);

          const spineElements = newSpineContainer.get('elements');
          let newSpineElement = spineElements.first();

          // 这里表示spine里面第一个element 这里可能有2种情况 一种是 painetext 或 spineText
          // spineText需要计算出血，paineText没有出血
          if (newSpineElement) {
            const { x, y, width, height } = getSpineTextRect(newSpineContainer);

            const spineHeight = newSpineContainer.get('height');

            newSpineElement = newSpineElement.merge({
              x,
              y,
              width,
              height,
              px: x / newSpineWidth,
              py: y / spineHeight,
              pw: width / newSpineWidth,
              ph: height / spineHeight
            });
          }

          const newSpineContainerProperty = {
            width: newSpineWidth
          };

          if (newSpineElement) {
            newSpineContainerProperty.elements = Immutable.List([
              newSpineElement
            ]);
          }

          newState = newState.setIn(
            ['containers', String(spineContainerIndex)],
            spineContainer.merge(newSpineContainerProperty)
          );

          if (fullContainerIndex !== -1) {
            const newCoverWidth = newState.get('width') + spineWidth;
            newState = newState.set('width', newCoverWidth);

            newState = newState.setIn(
              ['containers', String(fullContainerIndex), 'width'],
              newCoverWidth
            );
          }

          return newState;
        }
      }
      return state;
    }
    case types.CHANGE_BOOK_SETTING: {
      const { bookSetting } = action;

      const isApplyBackground = bookSetting.get('applyBackground');

      const bgColor = bookSetting.getIn(['background', 'color']);
      if (bgColor && isApplyBackground) {
        const containers = state.get('containers');
        return state.set(
          'containers',
          containers.map((container) => {
            return container.set('bgColor', bgColor);
          })
        );
      }

      return state;
    }
    case types.CHANGE_PAGE_BGCOLOR: {
      const { pageId, bgColor } = action;
      const containers = state.get('containers');

      const theContainerIndex = containers.findIndex(
        o => o.get('id') === pageId
      );
      if (theContainerIndex !== -1) {
        return state.setIn(
          ['containers', String(theContainerIndex), 'bgColor'],
          bgColor
        );
      }

      return state;
    }
    case types.CHANGE_PAGE_DEFAULT_FONT_COLOR: {
      const { pageId, fontColor } = action;
      const containers = state.get('containers');

      const theContainerIndex = containers.findIndex(
        o => o.get('id') === pageId
      );
      if (theContainerIndex !== -1) {
        return state.setIn(
          ['containers', String(theContainerIndex), 'fontColor'],
          fontColor
        );
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

        const theContainerIndex = newContainers.findIndex(
          o => o.get('id') === pageId
        );

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

      const theContainerIndex = containers.findIndex(
        o => o.get('id') === pageId
      );
      if (theContainerIndex !== -1) {
        return state.setIn(
          ['containers', String(theContainerIndex), 'template', 'tplGuid'],
          templateId
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

const includeActionTypes = [
  types.CHANGE_PAGE_BGCOLOR,

  types.CREATE_ELEMENT,
  types.CREATE_ELEMENTS,

  types.UPDATE_ELEMENT,
  types.UPDATE_ELEMENTS,

  types.DELETE_ELEMENTS,
  types.DELETE_ALL,

  types.APPLY_TEMPLATE_TO_PAGES,

  types.CHANGE_BOOK_SETTING
];

const undoableCover = undoable(coverReducer, {
  filter: includeActionTypes,
  limit: 10
});

export default undoableCover;
