import React, { Component, PropTypes } from 'react';
import XModal from '../../../common/ZNOComponents/XModal';
import XButton from '../../../common/ZNOComponents/XButton';
import Spread from '../../components/Spread';
import OutInSide from '../OutInSide';
import WorkSpace from '../WorkSpace';

import { translate } from 'react-translate';
import { merge, template, get, set, isEqual, isUndefined } from 'lodash';
import { getSize } from '../../../common/utils/helper';
import { panelTypes } from '../../contants/strings';
import { IMAGES_CROPPER, IMAGES_CROPPER_PARAMS } from '../../contants/apiUrl';
import './index.scss';


class PreviewModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      onClosed,
      opened,
      hasPreview,
      boundSystemActions,
      boundProjectActions,
      boundWorkspaceActions,
      boundTrackerActions,
      boundUploadedImagesActions,
      setting,
      baseUrls,
      loadingData,
      imageArray,
      toggleModal,
      getImageDetail,
      ratio,
      pagination,
      boundPaginationActions,
      cover,
      pageArray,
      elementArray,
      variableMap,
      paginationSpread,
      coverPageSpread,
      innerPageSpread,
      parameterMap,
      isProjectLoadCompleted,
      userInfo
    } = this.props;
    return (
      <XModal className="preview-modal" onClosed={onClosed}
              isHideIcon={hasPreview}
              opened={opened}
      >
        <div className="box-preview">
          { /* <div className="container-preview" style={{ height: window.innerHeight - 50 }}> */}
          <div className="container-preview">
            <WorkSpace
              boundProjectActions={boundProjectActions}
              boundWorkspaceActions={boundWorkspaceActions}
              boundTrackerActions={boundTrackerActions}
              setting={setting}
              baseUrls={baseUrls}
              loadingData={loadingData}
              imageArray={imageArray}
              boundUploadedImagesActions={boundUploadedImagesActions}
              toggleModal={this.toggleModal}
              getImageDetail={this.getImageDetail}
              ratio={ratio}
              pagination={pagination}
              boundPaginationActions={boundPaginationActions}
              cover={cover}
              pageArray={pageArray}
              elementArray={elementArray}
              variableMap={variableMap}
              paginationSpread={paginationSpread}
              parameterMap={parameterMap}
              coverPageSpread={coverPageSpread}
              innerPageSpread={innerPageSpread}
              isPreview={true}
              isProjectLoadCompleted={isProjectLoadCompleted}
              userInfo ={userInfo}
            />
          </div>
        </div>
      </XModal>
    );
  }
}

PreviewModal.propTypes = {
  onClosed: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired
};

export default translate('PreviewModal')(PreviewModal);
