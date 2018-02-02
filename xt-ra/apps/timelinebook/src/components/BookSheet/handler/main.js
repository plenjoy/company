import React from 'react';
import Immutable from 'immutable';
import { elementTypes } from '../../../constants/strings';
import PhotoElement from '../../PhotoElement';
import TextElement from '../../TextElement';
import SheetHandler from '../../SheetHandler';

/**
 * 获取Sheet Handler事件区
 */
export function getSheetHandlers() {
  const { data, actions } = this.props;

  const { computedPage, isPreview } = data;
  const computedSize = computedPage.get('computed');
  const elements = computedSize.get('elements');

  const leftPhotoId = computedPage.getIn(['left', 'photo', 'id']);
  const rightPhotoId = computedPage.getIn(['right', 'photo', 'id']);

  if(isPreview) return null;

  return elements
    .filter(element => element.get('type') === elementTypes.photoElement)
    .map((element, index) => {
      const isLeft = element.get('isLeft');
      const photoId = isLeft ? leftPhotoId : rightPhotoId;

      const handlerData = { isLeft, element, photoId };
      const handlerActions = { ...actions };

      return (
        <SheetHandler
          key={index}
          data={handlerData}
          actions={handlerActions}
        />
      );
    });
}

/**
 * 生成BookSpread的所有元素
 */
export function getSpreadElements() {
  const { data } = this.props;
  
  const { env, computedPage } = data;
  const computedSize = computedPage.get('computed');
  const elements = computedSize.get('elements');

  return elements
    .filter((element) => {
      if(element.get('type') === elementTypes.textElement && !element.getIn(['computedSize', 'textParams', 'text'])) {
        return false;
      } else {
        return true;
      }
    })
    .map((element, index) => {
      const elementData = { env, element };
      const elementActions = {};
      const elementId = element.get('guid');

      return (
        <ElementComponent
          key={elementId}
          data={elementData}
          actions={elementActions}
        />
      );
    });
}

/**
 * HOC Element组件
 * @param {*} props 
 */
export function ElementComponent(props) {
  const { data, actions } = props;
  const elementType = data.element.get('type');

  switch(elementType) {
    case elementTypes.photoElement:
      return <PhotoElement data={data} actions={actions} />;
    case elementTypes.textElement:
      return <TextElement data={data} actions={actions} />;
  }
}

export function isComponentShouldUpdate({data: nextData}) {
  const { computedPage: nextComputedPage } = nextData;
  const { computedPage } = this.props.data;

  return !Immutable.is(computedPage, nextComputedPage);
}