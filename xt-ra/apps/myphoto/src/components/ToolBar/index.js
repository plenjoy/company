import React from 'react';
import {observer} from 'mobx-react';
import Select from '../Select';
import Search from '../Search';

import './style.scss';

@observer
class ToolBar extends React.Component {
  render() {
    return (
      <div className='ToolBar'>
        <Select label='Display' options={[{ text: 'Show all projects' }]} />
        <Select label='Sort By' options={[{ text: 'Date Modified' }]} />
        <Search label='Search' placeholder='Project Title' />
      </div>
    )
  }
}

ToolBar.propTypes = {
};

export default ToolBar;
