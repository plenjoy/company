import React, { Component, PropTypes } from 'react';
import { merge, maxBy, minBy } from 'lodash';
import classNames from 'classnames';

import './index.scss';

class MultipleActionPanel extends Component {
  constructor(props) {
    super(props);

    this.alignLeft = this.alignLeft.bind(this);
    this.alignRight = this.alignRight.bind(this);
    this.alignTop = this.alignTop.bind(this);
    this.alignBottom = this.alignBottom.bind(this);
    this.alignVertical = this.alignVertical.bind(this);
    this.alignHorizontal = this.alignHorizontal.bind(this);

    this.spaceHorizontally = this.spaceHorizontally.bind(this);
    this.spaceVertically = this.spaceVertically.bind(this);

    this.matchMinWidth = this.matchMinWidth.bind(this);
    this.matchMaxWidth = this.matchMaxWidth.bind(this);
    this.matchMinHeight = this.matchMinHeight.bind(this);
    this.matchMaxHeight = this.matchMaxHeight.bind(this);
  }

  alignPosition(method) {
    const { selectedElementArray, actions } = this.props;
    const outPosition = {};
    switch (method) {
      case 'left': {
        const minLeftElement = minBy(selectedElementArray, o => o.position.x);
        outPosition.x = minLeftElement.position.x;
        break;
      }
      case 'top': {
        const minTopElement = minBy(selectedElementArray, o => o.position.y);
        outPosition.y = minTopElement.position.y;
        break;
      }
      default:
    }

    const newSelectedElementArray = selectedElementArray.map((element) => {
      return merge({}, element, {
        position: outPosition
      });
    });

    actions.updateElementsPosition(newSelectedElementArray);
  }

  alignLeft() {
    this.alignPosition('left');
  }

  alignRight() {
    const { selectedElementArray, actions } = this.props;

    const maxRightElement = maxBy(
      selectedElementArray,
      o => o.position.x + o.width
    );
    const rightX = maxRightElement.position.x + maxRightElement.width;

    const newSelectedElementArray = selectedElementArray.map((element) => {
      return merge({}, element, {
        position: {
          x: rightX - element.width
        }
      });
    });

    actions.updateElementsPosition(newSelectedElementArray);
  }

  alignTop() {
    this.alignPosition('top');
  }

  alignBottom() {
    const { selectedElementArray, actions } = this.props;
    const maxBottomElement = maxBy(selectedElementArray,
      o => o.position.y + o.height
    );

    const rightY = maxBottomElement.position.y + maxBottomElement.height;

    const newSelectedElementArray = selectedElementArray.map((element) => {
      return merge({}, element, {
        position: {
          y: rightY - element.height
        }
      });
    });

    actions.updateElementsPosition(newSelectedElementArray);
  }

  alignVertical() {
    const { selectedElementArray, actions } = this.props;

    const maxWidthElement = maxBy(selectedElementArray, o => o.width);
    const centerX = maxWidthElement.position.x + (maxWidthElement.width / 2);


    const newSelectedElementArray = selectedElementArray.map((element) => {
      return merge({}, element, {
        position: {
          x: centerX - (element.width / 2)
        }
      });
    });

    actions.updateElementsPosition(newSelectedElementArray);
  }

  alignHorizontal() {
    const { selectedElementArray, actions } = this.props;

    const maxHeightElement = maxBy(selectedElementArray, o => o.height);
    const centerY = maxHeightElement.position.y + (maxHeightElement.height / 2);

    const newSelectedElementArray = selectedElementArray.map((element) => {
      return merge({}, element, {
        position: {
          y: centerY - (element.height / 2)
        }
      });
    });

    actions.updateElementsPosition(newSelectedElementArray);
  }


  matchSize(selectedElementArray, sizeObject) {
    const newSelectedElementArray = selectedElementArray.map((element) => {
      return merge({}, element, {
        ...sizeObject
      });
    });

    const { actions } = this.props;

    actions.updateElementsSize(newSelectedElementArray);
  }

  matchMinWidth() {
    const { selectedElementArray } = this.props;
    const minWidthElement = minBy(selectedElementArray, o => o.width);

    this.matchSize(selectedElementArray, {
      width: minWidthElement.width
    });
  }

  matchMaxWidth() {
    const { selectedElementArray } = this.props;
    const maxWidthElement = maxBy(selectedElementArray, o => o.width);

    this.matchSize(selectedElementArray, {
      width: maxWidthElement.width
    });
  }

  matchMinHeight() {
    const { selectedElementArray } = this.props;
    const minHeightElement = minBy(selectedElementArray, o => o.height);

    this.matchSize(selectedElementArray, {
      height: minHeightElement.height
    });
  }

  matchMaxHeight() {
    const { selectedElementArray } = this.props;
    const maxHeightElement = maxBy(selectedElementArray, o => o.height);

    this.matchSize(selectedElementArray, {
      height: maxHeightElement.height
    });
  }

  spaceVertically() {
    const { selectedElementArray, actions } = this.props;
    const sortedSelectedElementArray = selectedElementArray.sort((a, b) => {
      return a.position.y - b.position.y;
    });

    let totalGutter = 0;
    sortedSelectedElementArray.forEach((element, index) => {
      const prevElement = sortedSelectedElementArray[index - 1];
      if (prevElement) {
        const gutter = element.position.y -
          (prevElement.position.y + prevElement.height);
        totalGutter += gutter;
      }
    });

    const length = sortedSelectedElementArray.length;
    const averageGutter = totalGutter / (length - 1);

    const newSelectedElementArray = [];

    selectedElementArray.forEach((element, index) => {
      if (index === 0 || index === (length - 1)) {
        newSelectedElementArray.push(null);
      } else {
        const prevElement = sortedSelectedElementArray[index - 1];
        const updatedPrevElement = newSelectedElementArray[index - 1];
        let updatedPrevElementPositionY = prevElement.position.y;
        if (updatedPrevElement) {
          updatedPrevElementPositionY = updatedPrevElement.position.y;
        }

        newSelectedElementArray.push({
          id: element.id,
          position: {
            x: element.position.x,
            y: updatedPrevElementPositionY + prevElement.height + averageGutter
          }
        });
      }
    });

    actions.updateElementsPosition(newSelectedElementArray);
  }

  spaceHorizontally() {
    const { selectedElementArray, actions } = this.props;
    const sortedSelectedElementArray = selectedElementArray.sort((a, b) => {
      return a.position.x - b.position.x;
    });

    let totalGutter = 0;
    sortedSelectedElementArray.forEach((element, index) => {
      const prevElement = sortedSelectedElementArray[index - 1];
      if (prevElement) {
        const gutter = element.position.x -
          (prevElement.position.x + prevElement.width);
        totalGutter += gutter;
      }
    });

    const length = sortedSelectedElementArray.length;
    const averageGutter = totalGutter / (length - 1);

    const newSelectedElementArray = [];

    selectedElementArray.forEach((element, index) => {
      if (index === 0 || index === (length - 1)) {
        newSelectedElementArray.push(null);
      } else {
        const prevElement = sortedSelectedElementArray[index - 1];
        const updatedPrevElement = newSelectedElementArray[index - 1];
        let updatedPrevElementPositionX = prevElement.position.x;
        if (updatedPrevElement) {
          updatedPrevElementPositionX = updatedPrevElement.position.x;
        }

        newSelectedElementArray.push({
          id: element.id,
          position: {
            x: updatedPrevElementPositionX + prevElement.width + averageGutter,
            y: element.position.y
          }
        });
      }
    });

    actions.updateElementsPosition(newSelectedElementArray);
  }

  render() {
    const { selectedElementArray } = this.props;

    const multipleActionPanelClassName = classNames('multiple-action-panel', {
      isShown: selectedElementArray && selectedElementArray.length > 1
    });

    return (
      <div
        className={multipleActionPanelClassName}
      >
        <fieldset className="form-group">
          <legend>Align</legend>
          <div className="align-buttons">
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.alignLeft}
            >
              <span className="glyphicon glyphicon-object-align-left" />
              Align Left
            </button>
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.alignRight}
            >
              <span className="glyphicon glyphicon-object-align-right" />
              Align Right
            </button>
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.alignTop}
            >
              <span className="glyphicon glyphicon-object-align-top" />
              Align Top
            </button>
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.alignBottom}
            >
              <span className="glyphicon glyphicon-object-align-bottom" />
              Align Bottom
            </button>
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.alignVertical}
            >
              <span className="glyphicon glyphicon-object-align-vertical" />
              Align Vertical
            </button>
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.alignHorizontal}
            >
              <span className="glyphicon glyphicon-object-align-horizontal" />
              Align Horizontal
            </button>
          </div>
        </fieldset>
        {
          selectedElementArray.length > 2
          ? (
            <fieldset className="form-group">
              <legend>Space</legend>
              <div className="align-buttons">
                <button
                  type="button"
                  className="btn btn-default btn-block btn-sm"
                  onClick={this.spaceHorizontally}
                >
                  Space Horizontally
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-block btn-sm"
                  onClick={this.spaceVertically}
                >
                  Space Vertically
                </button>
              </div>
            </fieldset>
          )
          : null
        }
        <fieldset className="form-group">
          <legend>Match</legend>
          <div className="align-buttons">
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.matchMinWidth}
            >
              Match Min Width
            </button>
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.matchMaxWidth}
            >
              Match Max Width
            </button>
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.matchMinHeight}
            >
              Match Min Height
            </button>
            <button
              type="button"
              className="btn btn-default btn-block btn-sm"
              onClick={this.matchMaxHeight}
            >
              Match Max Height
            </button>
          </div>
        </fieldset>
      </div>
    );
  }
}

MultipleActionPanel.propTypes = {
  selectedElementArray: PropTypes.array.isRequired,
  actions: PropTypes.shape({
    updateElementsSize: PropTypes.func.isRequired,
    updateElementsPosition: PropTypes.func.isRequired
  }).isRequired,
};

export default MultipleActionPanel;
