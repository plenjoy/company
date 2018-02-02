import React, { Component, PropTypes } from 'react';
import { translate } from "react-translate";
import UploadItem from '../UploadItem';
import './index.scss';
const VIEW_COUNT = 5;

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.getPlaceholder = this.getPlaceholder.bind(this);
  }

  getPlaceholder() {
    const { uploadList } = this.props;

    let viewDiff = VIEW_COUNT - uploadList.length;
    const placeholder = [];

    if (viewDiff > 0) {
      while (viewDiff --) {
        placeholder.push(
          (
            <li className="upload-item">
              <div className="file-name">&nbsp;</div>
              <div className="file-progress">&nbsp;</div>
            </li>
          )
        );
      }
    }
    return placeholder;
  }

  render() {
    const { uploadList, t, boundUploadedImagesActions, boundContactUsActions, retryImage, instance } = this.props;

    const placeholder = this.getPlaceholder();
    return (
      <div>
        <ul className="upload-title">
          <li className="upload-title">
            <div className="file-name">
              { t('FILE') }
            </div>
            <div className="file-progress">
              { t('FILE_PROGRESS') }
            </div>
          </li>
        </ul>
        <div className="box-list">
          <ul className="upload-list">
            {
              uploadList && uploadList.map((item, index) => {
                return (
                  <UploadItem
                    key={index}
                    uploadItem={item}
                    instance={instance}
                    retryImage={retryImage}
                    boundContactUsActions={boundContactUsActions}
                    boundUploadedImagesActions={boundUploadedImagesActions}
                  />
                );
              })
            }
            { placeholder }
          </ul>
        </div>
      </div>
    );
  }
}

ItemList.propTypes = {
  uploadList: PropTypes.array.isRequired,
};

export default translate('ItemList')(ItemList);
