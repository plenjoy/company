import { invalidElementKeys } from './strings';

/**
 * 过滤element中无效的key
 * @param  {Immutable.List} element
 * @return {Immutable.List}  过滤后的element.
 */
export const filterInvalidKeys = (elements) => {
  return elements.map((element) => {
    let newElement = element;

    invalidElementKeys.forEach((key) => {
      newElement = newElement.delete(key);
    });

    return newElement;
  });
};

/**
 * 过滤photobook中element无效的key
 * @param  {Immutable.List} list 结构为: [ { elements: [{Map}, {Map}] }, ... ]
 * @return {[type]}      [description]
 */
export const filterInvalidKeysOfPhotobook = (list) => {
  const newList = list.map((item) => {
    let newItem = item;
    let newElements = item.get('elements');

    if (newElements) {
      newElements = filterInvalidKeys(newElements);
      newItem = item.set('elements', newElements);
    }

    return newItem;
  });

  return newList;
};
