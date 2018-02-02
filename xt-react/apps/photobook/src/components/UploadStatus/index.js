import React, { Component } from 'react';
import classNames from 'classnames';
import { translate } from 'react-translate';
import loading from './loading.gif';
import './index.scss';

class UploadStatus extends Component {
  constructor(props) {
    super(props);
    this.handleViewMoreClick = this.handleViewMoreClick.bind(this);
  }

  handleViewMoreClick() {
    const { actions, data } = this.props;
    const { toggleModal, boundTrackerActions } = actions;
    const { total, uploaded, errored } = data;
    toggleModal('upload', true);
    boundTrackerActions.addTracker(`RecallUploadPhotos,${total},${uploaded},${errored}`);
  }

  render() {
    const { data, t } = this.props;
    const { uploaded, total, errored } = data;

    const statusClass = classNames('upload-status', {
      isShown: !!total
    });

    const completedWithError = errored > 0 && (errored + uploaded === total);

    const errorClass = classNames('', {
      only: completedWithError
    });

    const detailText = total > 100 ? t('DETAILS') : t('VIEW_DETAIL');

    return (
      <div className={statusClass}>
        <div className="left">
          {
            !completedWithError ?
              (
                <div>
                  <img src={loading} />
                  {t('UPLOADING_STATUS', {
                    m: uploaded,
                    n: total
                  })}
                </div>
              ) : null
          }
          {
            errored > 0 ?
              (
                <b className={errorClass}>{t('FAILED_STATUS', {
                  m: errored
                })}</b>
              ) : null
          }
        </div>
        <div className="right">
          <a href="javascript:;" onClick={this.handleViewMoreClick}>
            { detailText }
          </a>
        </div>
      </div>
    );
  }
}

export default translate('UploadStatus')(UploadStatus);
