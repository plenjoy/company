import React, { Component, PropTypes } from 'react';
import XProgress from "../../../common/ZNOComponents/XProgress";
import { PENDING, DONE, PROGRESS, FAIL } from '../../contants/uploadStatus';
import classNames from 'classnames';
import close from './close.png';
import './index.scss';

class UploadItem extends Component {
  constructor(props) {
    super(props);
  }

  handleDelete(){
    const { uploadItem, boundUploadedImagesActions } = this.props;

    uploadItem.xhr.abort();

    boundUploadedImagesActions.deleteImage(uploadItem.imageId);
  }

  handleRetry(){
    const { uploadItem, boundUploadedImagesActions } = this.props;

    boundUploadedImagesActions.retryImage(uploadItem.imageId);
  }

  render() {
    const { uploadItem } = this.props;
    let addedClass = '';
    switch(uploadItem.status){
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
    const className = classNames('upload-item',addedClass);

    const { name, info, status, percent } = uploadItem;
    return (
      <li className={ className }>
        <div className="file-name">
          {
            name ? name.substr(0, 5) + '...' + name.substr(name.length-3) : ''
          }
        </div>
        <div className="file-progress">
          <XProgress percent={ percent } />
          <span className="status" title={ info }>
            {

                status === DONE || status === FAIL
                ? `${percent}`
                : `${percent}%`
           }
          </span>
          <a href="javascript:void(0);"
             className="delete">
            <img width="8px"
                 height="8px"
                 src={ close }
                 onClick = { this.handleDelete.bind(this) }
                 alt="Delete" />
          </a>
          <span className="failed">Failed</span>
          <a href="javascript:void(0);"
             className="retry"
             onClick={ this.handleRetry.bind(this) }>
             Retry
          </a>
        </div>
      </li>
    );
  }
}

UploadItem.propTypes = {
  uploadItem: PropTypes.object.isRequired,
};

export default UploadItem;
