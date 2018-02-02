import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import './index.scss';

export class StepDescription extends Component {
  constructor(props) {
    super(props);

    this.renderIcons = this.renderIcons.bind(this);
  }

  renderIcons() {
    const {
      activeIcon,
      iconsCount
    } = this.props;

    const html = [];

    if (iconsCount) {
      for (let i = 0; i < iconsCount; i++) {
        const iconClassName = classNames('icon', {
          active: activeIcon === i
        });

        html.push(<span key={i} className={iconClassName}>{ i+1 }</span>);

        // 如果不是最后一个, 那么就添加3个小点.
        if (i !== iconsCount - 1) {
          html.push(<span key={`${i}-0`} className="dotted"></span>);
          html.push(<span key={`${i}-1`} className="dotted"></span>);
          html.push(<span key={`${i}-2`} className="dotted"></span>);
        }
      }
    }

    return (<div className="icons-list">
      { html }
    </div>);
  }

  render() {
    const {
      t,
      children,
      className,
      style,
      current,
      iconsCount,
      title,
      description
    } = this.props;

    const stepClassName = classNames('step-description', className);

    return (
      <div className={stepClassName} style={style} >
        { this.renderIcons() }

        <div className="title">{t(title)}</div>
        <div className="description">{t(description)}</div>
      </div>
    );
  }
}

StepDescription.defaultProps = {
  activeIcon: 0,
  iconsCount: 6,

  title: '',
  description: ''
};

StepDescription.propTypes = {
   // 当前激活的icon
  activeIcon: PropTypes.number,

   // 显示icons的总数.
  iconsCount: PropTypes.number,

  title: PropTypes.string,
  description: PropTypes.string
};

export default translate('StepDescription')(StepDescription);
