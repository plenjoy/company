import React, { Component, PropTypes } from 'react';
import { fromJS, is } from 'immutable';
import classNames from 'classnames';
import './index.scss';

import ColorScheme0 from './icons/ColorScheme0.svg';
import ColorScheme1 from './icons/ColorScheme1.svg';
import ColorScheme2 from './icons/ColorScheme2.svg';
import ColorScheme3 from './icons/ColorScheme3.svg';
import ColorScheme4 from './icons/ColorScheme4.svg';
import ColorScheme5 from './icons/ColorScheme5.svg';
import ColorScheme6 from './icons/ColorScheme6.svg';
import ColorScheme7 from './icons/ColorScheme7.svg';
import ColorScheme8 from './icons/ColorScheme8.svg';
import ColorScheme9 from './icons/ColorScheme9.svg';

const allColorSchemesObjs = {
  ColorScheme0,
  ColorScheme1,
  ColorScheme2,
  ColorScheme3,
  ColorScheme4,
  ColorScheme5,
  ColorScheme6,
  ColorScheme7,
  ColorScheme8,
  ColorScheme9
};

class ColorSchemas extends Component {
  constructor(props) {
    super(props);

    this.getSelectedIndex = this.getSelectedIndex.bind(this);
    this.getRenderHtml = this.getRenderHtml.bind(this);
    this.onClickedBtn = this.onClickedBtn.bind(this);

    const { schemas, currentSchemaId } = props;
    this.state = {
      schemas, currentSchemaId
    };
  }

  componentWillReceiveProps(nextProps) {
    const { schemas, currentSchemaId } = this.props;

    const newSchemas = nextProps.schemas;
    const newCurrentSchemaId = nextProps.currentSchemaId;

    if (!is(fromJS(schemas), fromJS(newSchemas))) {
      this.setState({
        schemas: newSchemas
      });
    }

    if (currentSchemaId !== newCurrentSchemaId) {
      this.setState({
        currentSchemaId: newCurrentSchemaId
      });
    }
  }

  getSelectedIndex() {
    const { currentSchemaId, schemas } = this.state;

    return schemas.findIndex(s => s.id === currentSchemaId);
  }

  onClickedBtn(schema, index) {
    const { onClicked } = this.props;
    const { currentSchemaId } = this.state;

    if (currentSchemaId !== index) {
      this.setState({
        currentSchemaId: schema.id
      });

      onClicked && onClicked(schema, index);
    }
  }

  getRenderHtml() {
    const { className, style } = this.props;
    const { schemas } = this.state;
    const selectedIndex = this.getSelectedIndex();
    const html = [];

    schemas.forEach((s, i) => {
      const schemasId = s.id;
      const newWrapClass = classNames('color-wrap', className, {
        selected: i === selectedIndex
      });
      const newClass = classNames('color-item');
      const itemStyle = {
        background: `url(${allColorSchemesObjs[schemasId]}) center no-repeat`,
      };

      html.push(<div
        key={s.id}
        className={newWrapClass}
        onClick={() => this.onClickedBtn(s, i)}
      >
        <span style={itemStyle} className={newClass} />
      </div>);
    });

    return html;
  }

  render() {
    const { className, style } = this.props;
    const newClass = classNames('color-schema', className);

    return (
      <div className={newClass} style={style}>
        { this.getRenderHtml() }
      </div>
    );
  }
}

ColorSchemas.propTypes = {
  schemas: PropTypes.array,
  style: PropTypes.object,
  className: PropTypes.string,
  currentSchemaId: PropTypes.string,
  onClicked: PropTypes.func
};

ColorSchemas.defaultProps = {
  schemas: [],
  currentSchemaId: '',
  onClicked: () => {}
};

export default ColorSchemas;
