import React, { Component, PropTypes } from 'react';
import './index.scss';

class OptionItem extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const {onClick, id, type } = this.props;

    onClick(type, id);
  }

  render() {
    const { title, isSelected, type, thumbnailUrl } = this.props;
    const isImage = !!thumbnailUrl;

    return (
      <div className={`OptionItem${isImage ? ' isImage' : ''}`}>
        {isImage
          ? <img
            title={title}
            src={thumbnailUrl}
            onClick={this.onClick}
            className={`OptionItem__image${isSelected ? ' isSelected' : ''}`} />
          : null}

        {!isImage
          ? <label className="OptionItem__select" onClick={this.onClick}>
              <input name={type} type="radio" checked={isSelected} onChange={() => {}} />{title}
            </label>
          : null}
      </div>
    );
  }
}

OptionItem.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired
};

export default OptionItem;
