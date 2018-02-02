import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';
import '../../../../common/utils/extension';

import * as envActions from '../../actions/envActions';
import * as projectActions from '../../actions/projectActions';
import * as fontActions from '../../actions/fontActions';
import * as textEditModalActions from '../../actions/textEditModalActions';
import * as specActions from '../../actions/specActions';

import PageHeader from '../../components/PageHeader';
import BasicInfo from '../../components/BasicInfo';
import ControlPanel from '../../components/ControlPanel';

import LayoutContainer from '../../components/LayoutContainer';
import TextEditModal from '../../components/TextEditModal';

class App extends Component {
  constructor(props) {
    super(props);

    this.closeTextEditModal = this.closeTextEditModal.bind(this);
  }

  closeTextEditModal() {
    const { boundTextEditModalActions } = this.props;
    boundTextEditModalActions.hideTextEditModal();
  }

  render() {
    const {
      baseUrls,
      uidpk,
      fontList,
      tagList,
      elements,
      setting,
      selectedElementIndex,
      spreadOptions,
      textEditModalData,
      isCardProject,
      boundEnvActions,
      boundProjectActions,
      boundElementActions,
      boundFontActions,
      boundTextEditModalActions,
      boundSpecActions
    } = this.props;
    const layoutProps = {
      elements,
      setting,
      bgUrl: spreadOptions.bgUrl,
      baseUrls,
      spreadOptions,
      actions: {
        deleteElements: boundProjectActions.deleteElements,
        updateElement: boundProjectActions.updateElement,
        updateMultiElement: boundProjectActions.updateMultiElement,
        elementToFront: boundProjectActions.elementToFront,
        elementToBack: boundProjectActions.elementToBack,
        onEditText: boundTextEditModalActions.showTextEditModal
      }
    };

    const pageheaderProps = {
      uidpk,
      actions: {
        getEnv: boundEnvActions.getEnv,
        getFontList: boundFontActions.getFontList,
        getProjectData: boundProjectActions.getProjectData,
        getStyleList: boundProjectActions.getStyleList,
        getSpecData: boundSpecActions.getSpecData
      }
    };

    const pannelProps = {
      selectedElementIndex,
      elements,
      setting,
      canSubmit: isCardProject,
      actions: {
        saveProject: boundProjectActions.saveProject,
        copyProject: boundProjectActions.copyProject,
        updateSetting: boundProjectActions.updateSetting,
        createElement: boundProjectActions.createElement
      }
    };

    const textEditModalProps = {
      fontList,
      baseUrl: baseUrls.baseUrl,
      isShown: textEditModalData.get('isShown'),
      element: textEditModalData.get('element'),
      closeTextEditModal: this.closeTextEditModal,
      pageHeight: spreadOptions.originalHeight,
      ratio: spreadOptions.ratio,
      updateElement: boundProjectActions.updateElement,
      tagList
    };

    return (
      <div className="app-container">
        <PageHeader {...pageheaderProps} />
        <BasicInfo setting={setting} />
        <ControlPanel {...pannelProps} />

        {Object.keys(spreadOptions).length ? (
          <LayoutContainer {...layoutProps} />
        ) : null}

        {fontList.length ? <TextEditModal {...textEditModalProps} /> : null}
      </div>
    );
  }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
const mapStateToProps = state => ({
  uidpk: get(state, 'project.uidpk'),
  baseUrls: get(state, 'system.env.urls'),
  fontList: get(state, 'system.fontList'),
  tagList: get(state, 'system.tagList'),
  textEditModalData: get(state, 'textEditModalData'),

  setting: get(state, 'project.setting'),
  selectedElementIndex: get(state, 'project.selectedElementIndex'),
  elements: get(state, 'project.spread.elements.element'),
  spreadOptions: get(state, 'project.spreadOptions'),
  isCardProject: get(state, 'project.category') === 'CARD'
});

const mapDispatchToProps = dispatch => ({
  boundEnvActions: bindActionCreators(envActions, dispatch),
  boundProjectActions: bindActionCreators(projectActions, dispatch),
  boundFontActions: bindActionCreators(fontActions, dispatch),
  boundTextEditModalActions: bindActionCreators(textEditModalActions, dispatch),
  boundSpecActions: bindActionCreators(specActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
