import React, { Component, PropTypes } from 'react';
import { template, merge } from 'lodash';
import Immutable from 'immutable';

import XHeader from '../../../common/ZNOComponents/XHeader';
import { ORDER, GET_BOX_SPEC } from '../../../src/contants/apiUrl';
import { elementTypes } from '../../contants/strings';
import {
  ClickSave,
  ClickOrder,
  ClickPreview,
  ClickDownloadSpec
} from '../../contants/trackerConfig';
import './index.scss';
import XTitleEditor from '../../../../common/ZNOComponents/XTitleEditor';

const specNameFields = ['cover', 'dvdType', 'type', 'spineThickness'];

class PageHeader extends Component {
  constructor(props) {
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  generateSpecPackageName() {
    const { setting } = this.props;

    let specName = `${setting.size}SPEC`;

    specName += specNameFields.reduce((specName, field) => {
      return specName + (setting[field] !== 'none' ? `_${setting[field]}` : '');
    }, '');

    return specName;
  }

  handleDownload() {
    const {
      setting,
      baseUrls,
      boundTrackerActions,
      useSpecModal,
      boundUseSpecActions
    } = this.props;

    const downloadUrl = template(GET_BOX_SPEC)({
      baseUrl: baseUrls.baseUrl,
      product: setting.product,
      specName: this.generateSpecPackageName()
    });
    boundUseSpecActions.showUseSpecModal({ url: downloadUrl });
    // window.open(downloadUrl, '_blank');
    boundTrackerActions.addTracker(ClickDownloadSpec);
  }

  handleSetOption() {
    alert('handleSetOption');
  }

  handlePreview() {
    const { boundSystemActions } = this.props;
    boundSystemActions.showConfirm({
      confirmMessage:
        'Your current project was already orderd or added to cart.You need to save your addtional changes into a new project.',
      okButtonText: 'Save as',
      cancelButtonText: 'Cancel',
      onOkClick: () => {},
      onCancelClick: () => {}
    });
    // alert('handlePreview');
  }

  handleSave() {
    const {
      projectId,
      onSaveProject,
      boundSystemActions,
      boundTrackerActions
    } = this.props;

    if (!projectId) {
      return;
    }
    boundTrackerActions.addTracker(ClickSave);
    onSaveProject(() => {
      boundSystemActions.showNotify('Saved successfully!');
    });
  }

  /**
   * 检查element是否不为空，空的返回false
   * @param {*} element
   */
  isElementEmpty(element) {
    return !(
      Boolean(element.encImgId) ||
      Boolean(element.imageid) ||
      Boolean(element.text)
    );
  }

  isCameoEmpty(elements) {
    const cameoElement = elements.find(
      element => element.type === elementTypes.cameo
    );
    const IS_EMPTY = true;

    return cameoElement && this.isElementEmpty(cameoElement);
  }

  isAllElementsEmpty(elements) {
    return elements.every(element => this.isElementEmpty(element));
  }

  orderProject() {
    const { onSaveProject, baseUrls, projectId } = this.props;

    onSaveProject(() => {
      window.onbeforeunload = null;
      window.location.href = template(ORDER)({
        baseUrl: baseUrls.baseUrl,
        projectId
      });
    });
  }

  isSomeDvdElementEmpty(elements) {
    return elements.some(element => {
      return element.type === elementTypes.dvd && this.isElementEmpty(element);
    });
  }

  handleOrder() {
    const {
      onSaveProject,
      baseUrls,
      projectId,
      boundTrackerActions,
      boundSystemActions,
      boundPaginationActions,
      elementArray,
      setting
    } = this.props;

    // 如果project id为空, 就不做任何事情.
    if (!projectId) {
      return;
    }

    boundTrackerActions.addTracker(ClickOrder);

    if (this.isCameoEmpty(elementArray)) {
      boundSystemActions.showConfirm({
        confirmTitle: 'ERROR',
        confirmMessage:
          'You added a cameo window in your box, please place image in it.',
        okButtonText: 'Back to edit',
        onOkClick: () => {
          boundSystemActions.hideConfirm();
          boundPaginationActions.switchSheet(0);
        }
      });
    } else if (this.isAllElementsEmpty(elementArray)) {
      boundSystemActions.showConfirm({
        confirmMessage:
          'Do you really want to add a blank product to your cart?',
        okButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        onOkClick: () => {
          this.orderProject();
        }
      });
    } else if (
      setting.product === 'dvdCase' &&
      this.isSomeDvdElementEmpty(elementArray)
    ) {
      boundSystemActions.showConfirm({
        confirmMessage:
          'Do you really want to add a blank product to your cart?',
        okButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        onOkClick: () => {
          this.orderProject();
        }
      });
    } else {
      this.orderProject();
    }
  }

  handleSubmit() {
    const {
      boundProjectActions,
      boundSystemActions,
      orderState,
      projectId,
      userId,
      onSaveProject
    } = this.props;

    if (orderState.checkFailed) {
      onSaveProject(() => {
        boundProjectActions
          .updateCheckStatus(userId, projectId)
          .then(result => {
            if (result) {
              boundProjectActions.getProjectOrderedState(userId, projectId);
              boundSystemActions.showConfirm({
                confirmMessage:
                  'Thank you for submitting your changes to this ordered frame project. ' +
                  'We will review this frame project again. If no issue is found, ' +
                  'we will proceed with your order processing.',
                onOkClick: () => {
                  boundSystemActions.hideConfirm();
                },
                okButtonText: 'OK'
              });
            } else {
              boundSystemActions.showConfirm({
                confirmMessage:
                  'Submit failed, please try again or contact us.',
                onOkClick: () => {
                  boundSystemActions.hideConfirm();
                },
                okButtonText: 'OK'
              });
            }
          });
      });
    }
  }

  render() {
    const {
      boundProjectActions,
      boundTrackerActions,
      boundSystemActions,
      setting,
      onLoginHandle,
      onPreviewHandle,
      isProjectEdited,
      showCloneModal,
      onSaveProject,
      baseUrls,
      typeText,
      orderState,
      projectId,
      userId,
      env,
      spec,
      project
    } = this.props;

    let projectDescString = '';
    const title = project ? project.title : '';

    const { product, size } = setting;
    if (product && size) {
      const productName = product === 'IB' ? 'Image Box' : '';
      const sizeString = size.replace('X', '*');

      projectDescString = `Customize your ${productName} - ${sizeString} - ${typeText}`;
    }

    const TitleEditorData = {
      title,
      projectId,
      userId,
      orderInfo: Immutable.Map({
        isOrdered: orderState.ordered,
        isCheckFailed: orderState.checkFailed
      })
    };
    const TitleEditorActions = {
      boundProjectActions,
      boundTrackerActions,
      boundSystemActions
    };

    return (
      <XHeader
        boundSystemActions={boundSystemActions}
        isProjectEdited={isProjectEdited}
        onSaveProject={onSaveProject}
        baseUrls={baseUrls}
        dontStopPropagation
      >
        <XTitleEditor
          data={TitleEditorData}
          actions={TitleEditorActions}
          projectSettings={setting}
        />

        <div className="head-nav">
          <span className="nav-item" onClick={this.handleDownload}>
            Box Spec
          </span>
          <span className="nav-item" onClick={showCloneModal}>
            Clone
          </span>
          <span className="nav-item" onClick={onPreviewHandle}>
            Preview
          </span>
          <span className="nav-item" onClick={this.handleSave}>
            Save
          </span>
          {orderState.checkFailed ? (
            <span className="nav-item" onClick={this.handleSubmit}>
              Submit
            </span>
          ) : (
            <span className="nav-item" onClick={this.handleOrder}>
              Order
            </span>
          )}
          {/* __DEVELOPMENT__
            ? <span className="nav-item" onClick={ onLoginHandle }>Login</span>
            : null */}
        </div>
      </XHeader>
    );
  }
}

PageHeader.propTypes = {
  onLoginHandle: PropTypes.func.isRequired,
  onPreviewHandle: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
  baseUrls: PropTypes.object.isRequired,
  setting: PropTypes.object.isRequired,
  typeText: PropTypes.string.isRequired,
  onSaveProject: PropTypes.func.isRequired,
  boundSystemActions: PropTypes.object.isRequired,
  isProjectEdited: PropTypes.bool.isRequired,
  boundTrackerActions: PropTypes.object.isRequired
};

export default PageHeader;
