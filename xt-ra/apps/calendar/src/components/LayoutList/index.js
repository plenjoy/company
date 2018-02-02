import Loader from 'react-loader';
import Immutable from 'immutable';
import classNames from 'classnames';
import { translate } from 'react-translate';
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { template, merge, isEqual, get } from 'lodash';

import { addMouseWheelEvent } from '../../../../common/utils/mouseWheel';

import * as handler from './handler/handler';
import * as layoutHandler from './handler/layout';

import './index.scss';

class LayoutList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      templateList: [],

      // layout 图片的大小.
      imageSize: {
        width: 0,
        height: 0
      },

      // 每行显示的个数.
      colNumber: 0
    };

    this.getTemplateHTML = () => handler.getTemplateHTML(this);
    this.groupTemplateByNum = list => handler.groupTemplateByNum(this, list);
    this.onLayoutDragStarted = (guid, e) => handler.onLayoutDragStarted(this, guid, e);
    this.handlerMouseWheel = (dir) => handler.handlerMouseWheel(this, dir);
    this.receiveProps = nextProps => handler.receiveProps(this, nextProps);
    this.applyTemplate = guid => layoutHandler.applyTemplate(this, guid);
    this.didMount = () => handler.didMount(this);
  }

  componentWillReceiveProps(nextProps) {
    this.receiveProps(nextProps);
  }

  componentDidMount() {
    const list = get(this.props, 'data.templateList');

    this.didMount();

    // 绑定鼠标滚轮事件
    addMouseWheelEvent(this.layoutList, (dir) => {
      this.handlerMouseWheel(dir);
    }, true);
  }

  shouldComponentUpdate(nextProps){
    const oldIsShow = this.props.data.isShow;
    const newIsShow = nextProps.data.isShow;
    if (!oldIsShow && !newIsShow) {
      return false;
    }
    return true;
  }

  render() {
    const { data, actions, t } = this.props;
    const { isLoaded, pagination, userInfo, isShow } = data;
    const { templateList } = this.state;

    const isCover = pagination.sheetIndex === 0;

    const layoutWidthStyle = {
      width: 'auto'
    };
    const containerClassName = classNames('layout-list', {
      show: isShow
    });

    // 当模板列表为空时, 就是用flex布局.
    const listClassName = classNames('list', {
      'display-flex': !templateList.length
    });

    return (
      <div className={containerClassName}>
        <div className={listClassName} ref={layoutList => this.layoutList = layoutList}>
          {
            templateList.length
            ? this.getTemplateHTML()
            : <span className="no-layouts" style={layoutWidthStyle}>{ isCover ? t('NO_LAYOUTS') : t('NO_LAYOUTS_INNER') }</span>
          }
        </div>
      </div>
    );
  }
}

export default translate('LayoutList')(LayoutList);
