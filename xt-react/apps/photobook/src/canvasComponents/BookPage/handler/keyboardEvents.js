import keycode from 'keycode';
import { get, intersection } from 'lodash';

import Immutable from 'immutable';

import { elementTypes, pageTypes } from '../../../contants/strings';

import { filterInvalidKeys } from '../../../../../common/utils/elements';

function filter(event) {
  const tagName = (event.target || event.srcElement).tagName;
  // ignore keypressed in any elements that support keyboard data input
  return !(
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  );
}

const NOT_MANIPULATE_ELEMENT_TYPES = [elementTypes.spine, elementTypes.cameo];

export function KeyboardEventsFactory(that) {
  const { actions, data } = that.props;

  const {
    boundUndoActions,
    boundClipboardActions,
    boundProjectActions,
    boundTrackerActions
  } = actions;

  const UPDATE_DELAY = 200;
  let updateElementsPositionTimer = null;
  let lastUpdateElementsPositionTime = null;

  return {
    onKeyDown: e => {
      if (!filter(e)) return;

      const { data } = that.props;
      const { pagination, page } = data;

      const pageElementIds = page.get('elements').map(o => o.get('id'));

      // 当前选中的元素需要在当前操作的page之中
      const selectedElementArray = that.state.elementArray.filter(o => {
        return (
          o.get('isSelected') && pageElementIds.indexOf(o.get('id')) !== -1
        );
      });

      const redrawElementControls = () => {
        if (that.elementControlsNode) {
          that.elementControlsNode.redrawElementControlsRect();
        }
      };

      if (pagination.pageId === page.get('id')) {
        if (e.ctrlKey || e.metaKey) {
          switch (e.keyCode) {
            // ctrl + shift + z redo
            case keycode('z'):
              if (e.shiftKey) {
                that.keyboardEvents.redo();
              } else {
                that.keyboardEvents.undo();
              }
              redrawElementControls();
              break;

            case keycode('y'):
              that.keyboardEvents.redo();
              redrawElementControls();
              e.preventDefault();
              break;

            case keycode('c'):
              if (!selectedElementArray.size) return;
              that.keyboardEvents.copy();
              break;

            case keycode('x'):
              if (!selectedElementArray.size) return;
              that.keyboardEvents.cut();
              break;

            case keycode('v'):
              that.keyboardEvents.paste();
              break;

            case keycode('a'):
              that.keyboardEvents.selectAll();
              e.preventDefault();
              break;

            default:
          }
        }

        let moveX = 0;
        let moveY = 0;

        switch (e.keyCode) {
          case keycode('up'):
            moveX = 0;
            moveY = -1;
            break;

          case keycode('down'):
            moveX = 0;
            moveY = 1;
            break;

          case keycode('left'):
            moveX = -1;
            moveY = 0;
            break;

          case keycode('right'):
            moveX = 1;
            moveY = 0;
            break;

          case keycode('delete'):
          case keycode('backspace'): {
            const { elementArray } = that.state;
            const selectedElementArray = elementArray.filter(o =>
              o.get('isSelected')
            );
            that.props.actions.boundProjectActions.deleteElements(
              selectedElementArray.map(o => o.get('id')).toArray()
            );

            boundTrackerActions.addTracker('ShortCut,Delete,EditPage');
            break;
          }

          case keycode('esc'): {
            that.unSelectElements();

            boundTrackerActions.addTracker('ShortCut,Esc,EditPage');
            break;
          }

          default:
        }

        if (moveX || moveY) {
          const newElementArray = that.state.elementArray
            .filter(o => {
              return o.get('isSelected');
            })
            .map(o => {
              const computed = o.get('computed');
              return o.set(
                'computed',
                computed.merge({
                  left: computed.get('left') + moveX,
                  top: computed.get('top') + moveY
                })
              );
            });

          that.onElementArrayChange(newElementArray);
          redrawElementControls();

          lastUpdateElementsPositionTime = Date.now();
          window.clearTimeout(updateElementsPositionTimer);
        }
      }
    },
    onKeyUp: e => {
      if (!filter(e)) return;

      const { data } = that.props;
      const { pagination, page } = data;
      const moveKeys = [
        keycode('up'),
        keycode('down'),
        keycode('left'),
        keycode('right')
      ];

      if (
        pagination.pageId === page.get('id') &&
        moveKeys.indexOf(e.keyCode) !== -1
      ) {
        updateElementsPositionTimer = window.setTimeout(() => {
          if (Date.now() - lastUpdateElementsPositionTime < UPDATE_DELAY) {
            window.clearTimeout(updateElementsPositionTimer);
            return;
          }

          const selectedElementArray = that.state.elementArray.filter(o => {
            return o.get('isSelected');
          });
          that.submitElementArray(selectedElementArray, 'move');
        }, UPDATE_DELAY);
      }
    },
    undo: () => {
      const pastCount = get(that.props.data, 'undoData.pastCount');
      if (pastCount) {
        boundUndoActions.undo();
        boundTrackerActions.addTracker('ShortCut,Undo,EditPage');
      }
    },
    redo: () => {
      const futureCount = get(that.props.data, 'undoData.futureCount');
      if (futureCount) {
        boundUndoActions.redo();
        boundTrackerActions.addTracker('ShortCut,Redo,EditPage');
      }
    },
    copy: () => {
      const { data } = that.props;
      const { page } = data;

      const selectedElementArray = that.state.elementArray.filter(o => {
        return (
          o.get('isSelected') &&
          NOT_MANIPULATE_ELEMENT_TYPES.indexOf(o.get('type')) === -1
        );
      });
      if (selectedElementArray.size) {
        boundClipboardActions.setClipboardData(
          Immutable.Map({
            sourcePageId: page.get('id'),
            elementArray: selectedElementArray
          })
        );

        boundTrackerActions.addTracker('ShortCut,Copy,EditPage');
      }
    },
    cut: () => {
      const { data } = that.props;
      const { page } = data;

      const selectedElementArray = that.state.elementArray.filter(o => {
        return (
          o.get('isSelected') &&
          NOT_MANIPULATE_ELEMENT_TYPES.indexOf(o.get('type')) === -1
        );
      });

      if (selectedElementArray.size) {
        boundProjectActions.deleteElements(
          selectedElementArray.map(o => o.get('id')).toArray()
        );

        boundClipboardActions.setClipboardData(
          Immutable.Map({
            sourcePageId: page.get('id'),
            elementArray: selectedElementArray
          })
        );

        boundTrackerActions.addTracker('ShortCut,Cut,EditPage');
      }
    },
    paste: () => {
      const { data } = that.props;
      const { clipboardData, page, summary } = data;

      const isCover = summary.get('isCover');

      const sourcePageId = clipboardData.get('sourcePageId');
      const elementArray = clipboardData.get('elementArray');

      const doPaste = () => {
        const canPasteElementArray = elementArray.filter(element => {
          if (isCover) {
            return element;
          } else {
            const notAcceptElementTypesInPage = [
              elementTypes.paintedText,
              elementTypes.cameo,
              elementTypes.spine
            ];

            return (
              notAcceptElementTypesInPage.indexOf(element.get('type')) === -1
            );
          }
        });
        if (canPasteElementArray.size) {
          const maxDepElement = that.state.elementArray.maxBy(o => {
            return o.get('dep');
          });
          const maxDep = maxDepElement ? maxDepElement.get('dep') : 0;
          boundProjectActions.createElements(
            canPasteElementArray.map((element, index) => {
              return element.merge({
                x: element.get('x') + 300,
                y: element.get('y') + 300,
                dep: maxDep + index + 1
              });
            })
          );
          boundTrackerActions.addTracker('ShortCut,Paste,EditPage');
        }
      };

      if (elementArray) {
        if (isCover) {
          if (sourcePageId === page.get('id')) {
            doPaste();
          }
        } else {
          doPaste();
        }
      }
    },
    selectAll: () => {
      const { elementArray } = that.state;
      const { data } = that.props;
      const { summary } = data;

      if (!summary.get('isCover')) {
        that.setState({
          elementArray: elementArray.map(o => {
            switch (o.get('type')) {
              case elementTypes.photo:
              case elementTypes.text:
              case elementTypes.paintedText:
              case elementTypes.sticker:
                return o.set('isSelected', true);

              default:
                return o;
            }
          })
        });

        boundTrackerActions.addTracker('ShortCut,SelectAll,EditPage');
      }
    }
  };
}
