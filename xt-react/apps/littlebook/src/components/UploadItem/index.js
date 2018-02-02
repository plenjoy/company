import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import XProgress from '../../../../common/ZNOComponents/XProgress';
import { PENDING, DONE, PROGRESS, FAIL } from '../../contants/uploadStatus';
import { translate } from 'react-translate';
import classNames from 'classnames';
import close from './close.png';
import './index.scss';

class UploadItem extends Component {
  constructor(props) {
    super(props);
  }

  handleDelete() {
    const { uploadItem, boundUploadedImagesActions } = this.props;

    uploadItem.xhr.abort();

    boundUploadedImagesActions.deleteImage(uploadItem.imageId);
  }

  handleRetry() {
    const { uploadItem, retryImage } = this.props;

    retryImage(uploadItem.guid);
  }

  render() {
    const { uploadItem, boundContactUsActions, t, instance } = this.props;

    const { name, info, percent, reducer = {} } = uploadItem;
    const newReducer = instance.find(reducer.id) || reducer;

    const uploadStatus = get(newReducer, 'status');
    const errorText = get(newReducer, 'errorText');
    const retryCount = get(newReducer, 'retryCount');
    const isAccept = get(newReducer, 'isAccept');

    const canRetry = isAccept;
    let addedClass = '';

    switch (uploadStatus) {
      case PROGRESS:
        addedClass = 'progress';
        break;
      case DONE:
        addedClass = 'done';
        break;
      case FAIL:
        addedClass = 'fail';
        break;
      default:
        addedClass = '';
        break;
    }
    const className = classNames('upload-item', addedClass);

    return (
      <li className={className}>
        <div className="file-name">
          {name
            ? name.length < 10
              ? name
              : `${name.substr(0, 5)}...${name.substr(name.length - 3)}`
            : ''}
        </div>
        <div className="file-progress">
          <XProgress percent={percent} />
          <span className="status" title={info}>
            {uploadStatus === DONE
              ? `${percent}`
              : uploadStatus === FAIL ? `${errorText}` : `${percent}%`}
          </span>
          <a href="javascript:void(0);" className="delete">
            <img
              width="8px"
              height="8px"
              src={close}
              onClick={this.handleDelete.bind(this)}
              alt="Delete"
            />
          </a>
          {!canRetry ? <span className="failed">{t('FAILED')}</span> : null}
          {retryCount < 2 && canRetry ? (
            <a
              href="javascript:void(0);"
              className="retry"
              onClick={this.handleRetry.bind(this)}
            >
              {t('RETRY')}
            </a>
          ) : null}
          {retryCount >= 2 ? (
            <a
              href="javascript:void(0);"
              className="help"
              onClick={boundContactUsActions.showContactUsModal}
            >
              {t('HELP')}
            </a>
          ) : null}
        </div>
      </li>
    );
  }
}

UploadItem.propTypes = {
  uploadItem: PropTypes.object.isRequired
};

export default translate('UploadItem')(UploadItem);
