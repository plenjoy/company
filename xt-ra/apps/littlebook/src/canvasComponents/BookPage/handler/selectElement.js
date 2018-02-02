import Immutable from 'immutable';

function getSingleSelectedElementArray(elementArray, id) {
  return elementArray.map((element) => {
    return element.merge({
      isSelected: element.get('id') === id
    });
  });
}


export const onMouseUp = (that, data, e) => {
  const { elementArray } = that.state;
  const { element } = data;
  const elementId = element.get('id');

  let newElementArray = elementArray;

  if (!e.ctrlKey && !e.metaKey) {
    if (!element.get('isSelected')) {
      newElementArray = getSingleSelectedElementArray(
        elementArray, elementId
      );
    }
  } else {
    newElementArray = elementArray.map((o) => {
      if (elementId === o.get('id')) {
        return o.merge({
          isSelected: !o.get('isSelected')
        });
      }
      return o;
    });
  }

  that.setState({
    elementArray: newElementArray
  });
};

export function unSelectElements(that) {
  const { elementArray } = that.state;

  let newElementArray = Immutable.List();
  elementArray.forEach((element) => {
    newElementArray = newElementArray.push(
      element.set('isSelected', false)
    );
  });

  if (!Immutable.is(elementArray, newElementArray)) {
    that.setState({
      elementArray: newElementArray
    });
  }
}

export function reSelectElement(that, elementId) {
  const { elementArray } = that.state;
  const newElementArray = getSingleSelectedElementArray(elementArray, elementId);
  that.setState({
    elementArray: newElementArray
  });
}
