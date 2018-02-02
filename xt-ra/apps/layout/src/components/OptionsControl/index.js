import React, { Component, PropTypes } from 'react';
import { isEqual } from 'lodash';
import './index.scss';

class OptionsControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      rot: 0
    };

    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
    this.handleXChange = this.handleXChange.bind(this);
    this.handleYChange = this.handleYChange.bind(this);
    this.handleRotationChange = this.handleRotationChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldSelectedElementArray = this.props.selectedElementArray;
    const newSelectedElementArray = nextProps.selectedElementArray;

    const oldIsShowOriginalParams = this.props.isShowOriginalParams;
    const newIsShowOriginalParams = nextProps.isShowOriginalParams;

    if (
      (newSelectedElementArray.length === 1 &&
        !isEqual(oldSelectedElementArray, newSelectedElementArray)) ||
      oldIsShowOriginalParams !== newIsShowOriginalParams
    ) {
      const { spreadOptions } = this.props;
      const firstElement = newSelectedElementArray[0];

      if (newIsShowOriginalParams) {
        this.setState({
          width: firstElement.width / spreadOptions.ratio,
          height: firstElement.height / spreadOptions.ratio,
          x: firstElement.position.x / spreadOptions.ratio,
          y: firstElement.position.y / spreadOptions.ratio,
          rot: firstElement.rot
        });
      } else {
        this.setState({
          width: firstElement.width,
          height: firstElement.height,
          x: firstElement.position.x,
          y: firstElement.position.y,
          rot: firstElement.rot
        });
      }
    }
  }

  handleWidthChange(event) {
    const { spreadOptions } = this.props;

    let width = +event.target.value;
    if (!this.props.isShowOriginalParams) {
      width /= spreadOptions.ratio;
    }
    const pw = width / spreadOptions.originalWidth;
    this.editElement({
      width,
      pw
    });
  }

  handleHeightChange(event) {
    const { spreadOptions } = this.props;
    let height = +event.target.value;
    if (!this.props.isShowOriginalParams) {
      height /= spreadOptions.ratio;
    }
    const ph = height / spreadOptions.originalHeight;
    this.editElement({
      height,
      ph
    });
  }

  handleRotationChange(event) {
    const rot = +event.target.value;
    this.editElement({
      rot
    });
  }

  handleXChange(event) {
    const { spreadOptions } = this.props;
    let x = +event.target.value;
    if (!this.props.isShowOriginalParams) {
      x /= spreadOptions.ratio;
    }
    const px = x / spreadOptions.originalWidth;
    this.editElement({
      x,
      px
    });
  }

  handleYChange(event) {
    const { spreadOptions } = this.props;
    let y = +event.target.value;
    if (!this.props.isShowOriginalParams) {
      y /= spreadOptions.ratio;
    }
    const py = y / spreadOptions.originalHeight;
    this.editElement({
      y,
      py
    });
  }

  editElement(newAttribute) {
    const { selectedElementArray } = this.props;
    const element = selectedElementArray[0];
    const { actions } = this.props;
    actions.updateElement(element.id, newAttribute);
  }

  render() {
    const { selectedElementArray, actions, isShowOriginalParams } = this.props;
    const showParamsMode = ['View Size', 'Original Size'];

    const isSelectSingleElement = selectedElementArray.length === 1;

    const Style = {
      display: isSelectSingleElement ? 'block' : 'none'
    };

    const { width, height, x, y, rot } = this.state;

    return isSelectSingleElement
      ? <div className="element-info" style={Style}>
        <div id="box-info">
          <button
            type="button"
            className="btn btn-default btn-sm"
            onClick={actions.toggleParamsMode}
          >
            {isShowOriginalParams ? showParamsMode[1] : showParamsMode[0]}
          </button>
          <div className="label-detail">
            <i className="glyphicon glyphicon-resize-horizontal" /> Width
            </div>
          <div className="label-item" id="inputbox-width">
            <input
              type="number"
              className="form-control"
              id="input-width"
              onChange={this.handleWidthChange}
              value={Math.round(width)}
            />
          </div>
          <div className="label-detail">
            <i className="glyphicon glyphicon-resize-vertical" /> Height
            </div>
          <div className="label-item" id="inputbox-height">
            <input
              type="number"
              className="form-control"
              id="input-height"
              onChange={this.handleHeightChange}
              value={Math.round(height)}
            />
          </div>
          <div className="label-detail">
            <i className="glyphicon glyphicon-repeat" /> Rotation
            </div>
          <div className="label-item" id="inputbox-rotate">
            <input
              type="number"
              className="form-control"
              id="input-rotate"
              onChange={this.handleRotationChange}
              value={Math.round(rot)}
            />
          </div>

          <div className="label-detail">
            <i className="glyphicon glyphicon-arrow-left" /> Left (x)
            </div>
          <div className="label-item" id="inputbox-ox">
            <input
              type="number"
              className="form-control"
              id="input-ox"
              onChange={this.handleXChange}
              value={Math.round(x)}
            />
          </div>
          <div className="label-detail">
            <i className="glyphicon glyphicon-arrow-up" /> Top (y)
            </div>
          <div className="label-item" id="inputbox-oy">
            <input
              type="number"
              className="form-control"
              id="input-oy"
              onChange={this.handleYChange}
              value={Math.round(y)}
            />
          </div>
        </div>
      </div>
      : null;
  }
}

OptionsControl.propTypes = {
  selectedElementArray: PropTypes.array.isRequired,
  spreadOptions: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    updateElement: PropTypes.func.isRequired,
    toggleParamsMode: PropTypes.func.isRequired
  }),
  isShowOriginalParams: PropTypes.bool.isRequired
};

export default OptionsControl;
