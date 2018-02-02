import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { translate } from 'react-translate';
import './index.scss';

class PageNav extends Component {
  render() {
    const { t, data } = this.props;
    const { allSheets, settings } = data;
    const product = settings.spec.product;
    let usefullPageNum = 0;
    if (allSheets && allSheets.size) {
      allSheets.forEach((sheet, index) => {
        const imageId = sheet.getIn(['pages', '0', 'elements', '0', 'encImgId']);
        if (imageId) {
          usefullPageNum += 1;
        }
      })
    };
    return (<div className="page-nav">
      <div className="page-nav-wrap">
        {
          product ?
          (
            product === 'LPS' ?
            null
            :
            <ul className="list">
                <li className="item">
                  <Link to="/allpages" activeClassName="active">{t('ALLPAGES')}</Link>
                </li>
                <li className="item">
                  <Link to="/onepage" activeClassName="active">{t('ONEPAGE')}</Link>
                </li>
            </ul>
          )
          :null

        }
        {
          allSheets.size
            ? <div className="page-count">{usefullPageNum} / {allSheets.size-1}</div>
            : null
        }
      </div>


      <div className="line" />

      <section className="content">
        {this.props.children}
      </section>
    </div>);
  }
}

PageNav.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('PageNav')(PageNav);
