import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { translate } from 'react-translate';
import './index.scss';

class PageNav extends Component {
  render() {
    const { t, data } = this.props;

    const { isBookthemeOpen } = data;

    return (
      <div className="page-nav">
        <div className="page-nav-wrap">
          {data.isEditParentBook ? null : (
            <ul className="list">
              <li className="item">
                <Link to="/editpage" activeClassName="active">
                  {t('EDITPAGE')}
                </Link>
              </li>
              <li className="item">
                <Link to="/arrangepages" activeClassName="active">
                  {t('ARRANGEPAGES')}
                </Link>
              </li>
              <li className="item hide">
                <Link to="/photogrouping" activeClassName="active">
                  {t('PHOTOGROUPING')}
                </Link>
              </li>
              {isBookthemeOpen ? (
                <li className="item">
                  <Link to="/selectthemes" activeClassName="active">
                    {t('SELECTTHEMES')}
                  </Link>
                </li>
              ) : null}
              <li className="item hide">
                <Link to="/preview" activeClassName="active">
                  {t('PREVIEW')}
                </Link>
              </li>
            </ul>
          )}
        </div>

        {data.isEditParentBook ? null : <div className="line" />}

        <section className="content">{this.props.children}</section>
      </div>
    );
  }
}

PageNav.propTypes = {};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('PageNav')(PageNav);
