import { get, template } from 'lodash';
import React from 'react';
import { is } from 'immutable';
import { TEMPLATE_SRC } from '../../contants/apiUrl';
import { dragTypes } from '../../contants/strings';
import LayoutItem from '../LayoutItem';
import { setTransferData } from '../../../../common/utils/drag';

export const receiveProps = (that, nextProps) => {
  const oldTemplate = get(that.props, 'data.template').get('list');
  const newTemplate = get(nextProps, 'data.template').get('list');

  const oldPage = get(that.props, 'data.page');
  const newPage = get(nextProps, 'data.page');

  if (!is(oldTemplate, newTemplate) || !is(oldPage, newPage)) {
    const { data } = nextProps;
    const { templateThumbnailPrefx, size } = data;

    const selectedTemplateId = newPage
      ? newPage.getIn(['template', 'tplGuid'])
      : 0;

    const templateList = newTemplate.map((tem) => {
      const guid = tem.get('guid');
      const imageUrl = template(TEMPLATE_SRC)({
        templateThumbnailPrefx,
        size,
        guid
      });
      const isSelected = guid === selectedTemplateId;

      return tem.merge({
        imageUrl,
        isSelected
      });
    });
    that.setState({
      templateList
    });
  }
};

export const didMount = (that) => {
  const { data } = that.props;
  const { templateThumbnailPrefx, size, page } = data;

  const newTemplate = get(that.props, 'data.template').get('list');
  const selectedTemplateId = page ? page.getIn(['template', 'tplGuid']) : 0;

  let templateList = newTemplate.map((tem) => {
    const guid = tem.get('guid');
    const imageUrl = template(TEMPLATE_SRC)({
      templateThumbnailPrefx,
      size,
      guid
    });
    const isSelected = guid === selectedTemplateId;

    return tem.merge({
      imageUrl,
      isSelected
    });
  });

  templateList = templateList.sort(
    (a, b) => a.get('ordering') - b.get('ordering')
  );

  that.setState({
    templateList
  });
};

export const getTemplateHTML = (that) => {
  const { templateList } = that.state;
  const { actions } = that.props;
  const { applyTemplate } = actions;

  const itemList = [];

  const layoutItemActions = {
    applyTemplate,
    onLayoutDragStarted: that.onLayoutDragStarted
  };

  templateList.map((template) => {
    const layoutItemData = {
      template
    };
    itemList.push(
      <LayoutItem
        actions={layoutItemActions}
        data={layoutItemData}
        key={template.get('guid')}
      />
    );
  });
  return itemList;
};

export const onLayoutDragStarted = (that, guid, event) => {
  setTransferData(event, {
    type: dragTypes.template,
    guid
  });
  // dragover, dragenter 没法从dataTransfer传值，所以借用window传值
  __app.dragType = dragTypes.template;
};
