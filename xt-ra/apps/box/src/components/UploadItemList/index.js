import React, { Component, PropTypes } from 'react';
import { translate } from "react-translate";
import UploadItem from '../UploadItem';
import './index.scss';

class ItemList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { uploadList, t, boundUploadedImagesActions } = this.props;

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
                    boundUploadedImagesActions={boundUploadedImagesActions}
                  />
                );
              })
            }
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
