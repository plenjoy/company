export function findKonvaObjectById(konvaObject, id) {
  let outChild = null;
  if (konvaObject.children && !outChild) {
    konvaObject.children.forEach((child) => {
      if (child.attrs.id === id) {
        outChild = child;
      } else if (!outChild) {
        outChild = findKonvaObjectById(child, id);
      }
    });
  }

  return outChild;
}
