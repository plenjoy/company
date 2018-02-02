import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { get, merge } from 'lodash';
import ApprovalPageHeader from '../ApprovalPageHeader';
import ApprovalPageSideBar from '../ApprovalPageSideBar';
import ApprovalPageActionBar from '../ApprovalPageActionBar';
import PreviewSheetRender from '../PreviewSheetRender';

import * as handler from './handler';

import './index.scss';

class ApprovalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sheetIndex: 0
    };

    this.changeStateSheetIndex = index => handler.changeStateSheetIndex(this, index);
    this.onSwitchSheet = pagination => this.changeStateSheetIndex(pagination.sheetIndex);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldData = this.props.data;
    const newData = nextProps.data;

    // order page: orderCoverWorkspace
    const oldOrderCoverWorkspace = get(oldData, 'previewModalData.ratios.orderCoverWorkspace');
    const newOrderCoverWorkspace = get(newData, 'previewModalData.ratios.orderCoverWorkspace');

    if (this.props.data.isShown === nextProps.data.isShown &&
          this.state.sheetIndex === nextState.sheetIndex &&
          oldOrderCoverWorkspace === newOrderCoverWorkspace &&
          Immutable.is(oldData.previewModalData, newData.previewModalData)) {
      return false;
    }

    return true;
  }

  render() {
    const { actions, data } = this.props;
    const {
      env,
      project,
      isShown,
      reviewResult,
      previewModalData,
      spec,
      parentBook
    } = data;

    const {
      deleteElement,
      onSaveProject,
      closeApprovalPage,
      boundTrackerActions,
      previewModalActions,
      boundConfirmModalActions,
      boundCloneModalActions,
      boundNotificationActions
    } = actions;

    const newPagination = previewModalData.pagination.merge({
      sheetIndex: this.state.sheetIndex
    });

    // preview
    const newPreviewModalActions = merge({}, previewModalActions, {
      onSwitchSheet: this.onSwitchSheet
    });

    const scopePreviewModalData = merge({}, previewModalData, {
      isShown: true,
      isInPreviewModel: true,
      ignoreEmpty: true
    }, {
      pagination: newPagination,
      parentBook
    });

    const approvalPageHeaderActions = {
      onSaveProject,
      closeApprovalPage,
      boundTrackerActions,
      boundCloneModalActions,
      boundConfirmModalActions,
      boundNotificationActions
    };
    const approvalPageHeaderData = {
      env,
      project,
      reviewResult,
      parentBook
    };

    const approvalPageActionBarActions = {
      deleteElement,
      changeStateSheetIndex: this.changeStateSheetIndex
    };
    const approvalPageActionBarData = {
      sheetIndex: this.state.sheetIndex,
      errorItems: reviewResult && reviewResult.get('errorItems')
    };

    return (
      <div>
        {
          isShown
          ? (
            <div className="approval-page">
              <ApprovalPageHeader
                actions={approvalPageHeaderActions}
                data={approvalPageHeaderData}
              />
              <div className="approval-preview">
                <PreviewSheetRender
                  actions={newPreviewModalActions}
                  data={scopePreviewModalData}
                />
              </div>
              <div className="approval-actionbar">
                <ApprovalPageActionBar
                  actions={approvalPageActionBarActions}
                  data={approvalPageActionBarData}
                />
              </div>
              <div className="approval-right-content">
                <ApprovalPageSideBar
                  setting={project.setting}
                  allOptionMap={spec.allOptionMap}
                  parentBook={parentBook}
                />
              </div>
            </div>
          )
          : null
        }
      </div>
    );
  }
}

ApprovalPage.propTypes = {
  actions: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default ApprovalPage;
