import React, { Component } from 'react';
import { defaultTextLength } from '../../contants/strings';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import { toDecode, toEncode } from '../../../../common/utils/encode';

import './index.scss';

class TextEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      lastRequestTime: null,
      isShowIllegalCharTip: false,
      isShowTextNotFit: false,
      hideTipTimer: null,
      lastAppearIllegalCharTime: null,
      maxLength: false
    };

    this.onTextAreaChange = this.onTextAreaChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.initData(this.props.element);
  }

  componentWillReceiveProps(nextProps) {
    const oldIsShown = this.props.isShown;
    const newIsShown = nextProps.isShown;

    if (oldIsShown !== newIsShown && newIsShown) {
      this.initData(nextProps.element);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const oldIsShown = prevProps.isShown;
    const newIsShown = this.props.isShown;
    if (oldIsShown !== newIsShown && newIsShown) {
      const { inputText } = this.refs;
      inputText.focus();
      if (inputText.setSelectionRange) {
        inputText.setSelectionRange(
          inputText.value.length,
          inputText.value.length
        );
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.isShown !== nextProps.isShown ||
      this.state.inputText !== nextState.inputText ||
      this.state.isShowIllegalCharTip !== nextState.isShowIllegalCharTip ||
      this.state.isShowTextNotFit !== nextState.isShowTextNotFit
    ) {
      return true;
    }

    return false;
  }

  initData(element) {
    if (element) {
      const inputText = element.get('text')
        ? toDecode(element.get('text'))
        : '';

      this.setState({
        inputText,
        isShowTextNotFit: false
      });
    }
  }

  onTextAreaChange(e) {
    const rLegalKeys = /[^\u000d\u000a\u0020-\u007e]*/g;
    const inputString = e.target.value;
    const filteredInputString = inputString.replace(rLegalKeys, '');
    const { hideTipInterval } = this.props;
    const { hideTipTimer, lastAppearIllegalCharTime } = this.state;

    if (filteredInputString !== inputString) {
      if (
        !lastAppearIllegalCharTime ||
        Date.now() - lastAppearIllegalCharTime < hideTipInterval
      ) {
        window.clearTimeout(hideTipTimer);
        const newTimer = window.setTimeout(() => {
          this.setState({
            isShowIllegalCharTip: false
          });
        }, hideTipInterval);

        this.setState({
          hideTipTimer: newTimer
        });
      } else {
        this.setState({
          lastAppearIllegalCharTime: Date.now()
        });
      }

      this.setState({
        isShowIllegalCharTip: true
      });
    } else {
      this.setState({
        isShowIllegalCharTip: false
      });
    }

    if (filteredInputString.length > defaultTextLength) {
      this.setState({
        maxLength: true
      });
    } else {
      this.setState({
        maxLength: false,
        inputText: filteredInputString
      });
    }
  }

  onSubmit() {
    const { inputText } = this.state;

    const { updateElement, closeTextEditModal, element } = this.props;

    const text = inputText || '';

    updateElement({
      text: toEncode(text),
      id: element.get('id')
    });

    this.setState({
      inputText: ''
    });

    closeTextEditModal();
  }

  render() {
    const { inputText } = this.state;

    const { isShown, closeTextEditModal } = this.props;

    return (
      <XModal
        className="text-edit-modal"
        onClosed={closeTextEditModal}
        opened={isShown}
      >
        <h2 className="modal-title">Edit Text</h2>

        <div className="modal-content">
          <div className="text-box">
            <p className="illegal-char-tip">
              {
                <span>
                  {`Text should be less than ${defaultTextLength} characters, extra character removed.`}
                </span>
              }
            </p>

            <input
              className="text-box"
              placeholder="Type here..."
              onInput={this.onTextAreaChange}
              value={inputText}
              maxLength={22}
              ref="inputText"
            />
          </div>

          <p className="button-container">
            <XButton onClicked={this.onSubmit}>Done</XButton>
          </p>
        </div>
      </XModal>
    );
  }
}

TextEditModal.defaultProps = {
  requestInterval: 1000,
  hideTipInterval: 2000
};

export default TextEditModal;
