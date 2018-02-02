import React, { Component, PropTypes } from 'react';
import { is } from 'immutable';
import classNames from 'classnames';
import './index.scss';
import { getResizeEventType } from '../../../../common/utils/mobile';
import * as themeHandler from './handle/main';

export default class ThemesList extends Component {
  constructor(props) {
    super(props);

    this.getThemeHtml = () => themeHandler.getThemeHtml(this);
    this.onResize = () => themeHandler.onResize(this);
    this.onClickTheme = theme => themeHandler.onClickTheme(this, theme);
    this.applyTheme = theme => themeHandler.applyTheme(this, theme);

    this.state = {
      // theme的宽,
      itemWidth: 0,
      itemMargin: 27,
      itemCount: 1
    };
  }

  componentDidMount() {
    this.onResize();

    const resizeEventType = getResizeEventType();
    window.addEventListener(resizeEventType, this.onResize);
  }

  componentWillUnmount() {
    const resizeEventType = getResizeEventType();
    window.removeEventListener(resizeEventType, this.onResize);
  }

  render() {
    const { actions, data, children } = this.props;
    const {
      className,
      style
    } = data;
    const customClass = classNames('themes-list', className);

    return (
      <div
        ref={node => this.node = node}
        style={style}
        className={customClass}
      >
        { this.getThemeHtml() }
      </div>
    );
  }
}

ThemesList.propTypes = {
  actions: PropTypes.shape({
  }),
  data: PropTypes.shape({
    style: PropTypes.object,
    className: PropTypes.object
  })
};
