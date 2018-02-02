import Immutable from 'immutable';

export function getCoverContainerMap(cover) {
  if (!Immutable.Map.isMap(cover)) return Immutable.Map();

  let fullContainer = null;
  let spineContainer = null;
  let backContainer = null;
  let frontContainer = null;

  let fullContainerIndex = -1;
  let spineContainerIndex = -1;
  let backContainerIndex = -1;
  let frontContainerIndex = -1;

  cover.get('containers').forEach((container, index) => {
    const containerType = container.get('type');
    switch (containerType) {
      case 'Full':
        fullContainer = container;
        fullContainerIndex = index;
        break;
      case 'Spine':
        spineContainer = container;
        spineContainerIndex = index;
        break;
      case 'Back':
        backContainer = container;
        backContainerIndex = index;
        break;
      case 'Front':
        frontContainer = container;
        frontContainerIndex = index;
        break;
      default:
    }
  });

  let activateContainer = null;
  let activateContainerIndex = -1;

  if (fullContainer) {
    activateContainer = fullContainer;
    activateContainerIndex = fullContainerIndex;
  }

  if (frontContainer) {
    activateContainer = frontContainer;
    activateContainerIndex = frontContainerIndex;
  }

  return Immutable.Map({
    fullContainer,
    spineContainer,
    backContainer,
    frontContainer,
    activateContainer,

    fullContainerIndex,
    spineContainerIndex,
    backContainerIndex,
    frontContainerIndex,
    activateContainerIndex
  });
}
