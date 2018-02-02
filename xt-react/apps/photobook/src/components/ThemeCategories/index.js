import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import XRadio from '../../../../common/ZNOComponents/XRadio';

import './index.scss';

class ThemeCategories extends Component {
  constructor(props) {
    super(props);

    this.getHtml = this.getHtml.bind(this);
  }

  getHtml() {
    const { actions, data } = this.props;
    const { changeCategory } = actions;
    const { categories, currentCategoryCode } = data;

    const html = [];

    if (categories && categories.size) {
      categories.forEach((c, i) => {
        const isChecked = c.get('code') === currentCategoryCode;
        html.push(<XRadio
          text={(String(c.get('displayName')).toLowerCase())}
          checked={isChecked}
          name="theme-categories"
          value={c}
          onClicked={changeCategory}
        />);
      });
    }

    return html;
  }

  render() {
    const { actions, data } = this.props;
    const { className, style } = data;

    const customClass = classNames('theme-categories', className);

    return (
      <div
        style={style}
        className={customClass}
      >
        { this.getHtml() }
      </div>
    );
  }
}

ThemeCategories.propTypes = {
  actions: PropTypes.shape({
  }),
  data: PropTypes.shape({
    style: PropTypes.object,
    className: PropTypes.object
  })
};

export default ThemeCategories;
