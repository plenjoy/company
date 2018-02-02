import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Immutable from 'immutable';
import { editTextOperateType } from '../../contants/strings';


import './index.scss';

const TextActionBar = ({ actions, element, t, isSpine }) => {
  const onEditText = () => {
    actions.onEditText(element, editTextOperateType);
  };

  const textActionClass = classNames('text-action-bar');
  return (
    <ul className={textActionClass} data-html2canvas-ignore="true">
      <li className="icon-item item-edit">
        <a onClick={onEditText} title={t('EDIT_TEXT')} />
      </li>
    </ul>
  );
};

TextActionBar.propTypes = {
  actions: PropTypes.shape({
    onEditText: PropTypes.func,
    onRemoveText: PropTypes.func,
    onBringToFront: PropTypes.func,
    onSendToback: PropTypes.func,
    onBringForward: PropTypes.func,
    onSendBackward: PropTypes.func,
  }).isRequired,
  element: PropTypes.instanceOf(Immutable.Map).isRequired,
  t: PropTypes.func.isRequired
};

export default TextActionBar;
