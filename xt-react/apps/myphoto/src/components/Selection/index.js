import React from 'react';
import {observer} from 'mobx-react';

import './style.scss';
import SelectionStore from '../../stores/SelectionStore';

@observer
class Selection extends React.Component {
  render() {
    const { style } = SelectionStore;

    if(style.area < 4) return null;

    return (
      <div className="Selection" style={style}></div>
    );
  }

  componentDidMount() {
    SelectionStore.bindWindowEvents();
  }

  componentWillUnmount() {
    SelectionStore.removeWindowEvents();
  }
}

export default Selection;
