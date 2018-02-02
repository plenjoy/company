import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import classNames from 'classnames';

import './index.scss';

const PhotoActionBar = ({ actions, element, isOnlyExpandFull, t }) => {
  const onEditImage = () => {
    actions.onEditImage(element);
  };

  const onRotateImage = () => {
    actions.onRotateImage(element);
  };

  const onUploadImage = () => {
    actions.onUploadImage(element);
  };

  const hasImage = Boolean(element.get('encImgId'));

  const photoActionBarClassName = classNames('photo-action-bar', {
    'has-image': hasImage
  });

  return (
    <ul
      className={photoActionBarClassName}
      data-html2canvas-ignore="true"
    >
      {
        hasImage
        ? (
          <div>
            <li className="icon-item item-crop">
              <a onClick={onEditImage} title={t('EDIT_ITEM')} />
            </li>
            <li className="icon-item item-rotate">
              <a onClick={onRotateImage} title={t('ROTATE_ITEM')} />
            </li>
          </div>
        )
        : null
      }
    </ul>
  );
};

PhotoActionBar.propTypes = {
  actions: PropTypes.shape({
    onEditImage: PropTypes.func,
    onRotateImage: PropTypes.func,
    onFlipImage: PropTypes.func,
    onExpandToFullSheet: PropTypes.func,
    onExpandToLeftPage: PropTypes.func,
    onExpandToRightPage: PropTypes.func,
    onBringToFront: PropTypes.func,
    onSendToback: PropTypes.func,
    onBringForward: PropTypes.func,
    onSendBackward: PropTypes.func,
    onFilter: PropTypes.func,
    onRemoveImage: PropTypes.func
  }).isRequired,
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  t: PropTypes.func.isRequired,
  isOnlyExpandFull: PropTypes.bool.isRequired
};

PhotoActionBar.defaultProps = {
  hasImage: true
};


export default PhotoActionBar;
