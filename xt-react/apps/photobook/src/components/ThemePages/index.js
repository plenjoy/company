import React, { Component } from 'react';
import { get } from 'lodash';
import { translate } from 'react-translate';
import { productTypes } from '../../contants/strings';
import * as handler from './handler';
import PicMagnifier from '../PicMagnifier';
import './index.scss';


class ThemePages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      magnifierParams: {
        isMagnifierShow: false,
        imageUrl: '',
        name: '',
        pixel: '',
        // 不需要下载预览图到本地.
        isIgnore: true,
        offset: {
          x: 0,
          y: 0,
          marginTop: 0
        }
      },
      magnifierShowTime: 500,
      selectedImageIds: []
    };

    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.onThemeDragStarted = (guid, pageIndex, sheetIndex, event) => {
      // 隐藏大图查看器.
      this.onPageOut();

      handler.onThemeDragStarted(guid, pageIndex, sheetIndex, event);
    };
    this.onPageOver = (screenshot, pageIndex, event) => handler.onPageOver(this, screenshot, pageIndex, event);
    this.applyThemePage = (guid, pageIndex, event) => handler.applyThemePage(this, guid, pageIndex, event);
    this.onPageOut = () => handler.onPageOut(this);
  }

  getRenderHtml() {
    const { data, actions, t } = this.props;
    const { currentTheme, isCover, settings, pagination } = data;
    const { applyThemePage } = actions;
    const product = get(settings, 'spec.product');
    const sheetIndex = pagination.get('sheetIndex');
    const html = [];
    if (currentTheme && currentTheme.get('screenshots').size) {
      const avaiableScreenshots = currentTheme.get('screenshots');
      let screenshots = [];
      if (isCover) {
        //todo 暂时禁用封面page
        // screenshots = currentTheme.get('screenshots').slice(0, 1);
        screenshots = [];
      } else {
        if (product === productTypes.PS) {
          if (sheetIndex === 1) {
            screenshots = avaiableScreenshots.slice(1, 2);
          } else if (sheetIndex === avaiableScreenshots.size - 1) {
            screenshots = avaiableScreenshots.slice(sheetIndex, sheetIndex + 1);
          } else {
            screenshots = avaiableScreenshots.slice(2, avaiableScreenshots.size - 1);
          }
        } else {
          screenshots = avaiableScreenshots.slice(1);
        }
      }
      if (screenshots.size) {
        screenshots.forEach((screenshot, index) => {
          let pageIndex = isCover ? index : index + 1;
          if (product === productTypes.PS) {
            if (sheetIndex > 1 && sheetIndex < avaiableScreenshots.size - 1) {
              pageIndex ++;
            } else if (sheetIndex === avaiableScreenshots.size - 1) {
              pageIndex = avaiableScreenshots.size - 1;
            }
          }
          html.push(
            <li onClick={this.applyThemePage.bind(this, currentTheme.get('guid'), pageIndex)}
                ref={pageIndex}
                onMouseOver={this.onPageOver.bind(this, screenshot, pageIndex)}
                onMouseOut={this.onPageOut}
                onDragStart={this.onThemeDragStarted.bind(this, currentTheme.get('guid'), pageIndex, sheetIndex)}>
              <img src={screenshot} />
            </li>
          );
        });
      } else {
        html.push(
          <div className="no-pages">{t('NO_PAGES')}</div>
        );
      }
    } else {
      html.push(
        <div className="no-pages">{t('NO_PAGES')}</div>
      );
    }

    return html;
  }

  render() {
    const { magnifierParams } = this.state;
    return (
      <div className="theme-pages">
        <ul>
          { this.getRenderHtml() }
          <PicMagnifier data={magnifierParams} />
        </ul>
      </div>
    );
  }
}

export default translate('ThemePages')(ThemePages);
