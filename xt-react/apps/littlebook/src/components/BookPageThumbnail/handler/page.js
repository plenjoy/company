import Immutable from 'immutable';
import { elementTypes } from '../../../contants/strings';
import Element from '../../../utils/entries/element';
import { getCropOptions, getCropLRByOptions } from '../../../utils/crop';

function convertElements(that, elements, ratio) {
  let outList = Immutable.List();

  const { elementArray } = that.state;

  elements.forEach((element) => {
    const computed = that.computedElementOptions(element, ratio);

    const stateElement = elementArray.find((o) => {
      return o.get('id') === element.get('id');
    });

    outList = outList.push(
      element.merge({ computed }, {
        // 不需要控制按钮.
        isSelected: false
      })
    );
  });

  return outList;
}

export const componentWillMount = (that) => {
  const { elements, ratio } = that.props.data;
  that.setState({
    elementArray: convertElements(that, elements, ratio.workspace)
  });
};

export const componentWillReceiveProps = (that, nextProps) => {
  const oldElements = that.props.data.elements;
  const newElements = nextProps.data.elements;

  const oldRatio = that.props.data.ratio.workspace;
  const newRatio = nextProps.data.ratio.workspace;

  if (!Immutable.is(oldElements, newElements) || oldRatio !== newRatio) {
    const newElementArray = convertElements(that, newElements, newRatio);

    that.setState({
      elementArray: newElementArray
    });
  }
};
