import React, { Component, PropTypes } from 'react';
import { translate } from "react-translate";
import XSelect from '../../../common/ZNOComponents/XSelect';
import './index.scss';


class SortAndFilter extends Component{
  constructor(props){
    super(props);
      const { t } = props;
      this.state = {
        sortOptions: [
          {
            label: t('DATE_TOKEN_O_T_N'),
            value: '>,shotTime'
          },
          {
            label: t('DATE_TOKEN_N_T_O'),
            value: '<,shotTime'
          },
          {
            label: t('UPLOAD_TIME_O_T_N'),
            value: '>,uploadTime'
          },
          {
            label: t('UPLOAD_TIME_N_T_O'),
            value: '<,uploadTime'
          },
          {
            label: t('TITLE_A_Z'),
            value: '>,name'
          },
          {
            label: t('TITLE_Z_A'),
            value: '<,name'
          },
        ],
        sortValue: '<,uploadTime'
      };
  }

  handleOptionChange(option){
    // console.log(option.value+" selected")
    this.setState({sortValue: option.value});

    const { onSorted } = this.props;
    onSorted({value:option.value});
  }

  handleHideUsedToggle(event){
    const {onToggleHideUsed} = this.props;
    const isChecked = event.target.checked;
    onToggleHideUsed(isChecked);
  }

    render(){
      const { t, isChecked } = this.props;
      return(
        <div className="upload-hide">
          <div className="t-left">
          <XSelect value={this.state.sortValue}
                   onChanged={this.handleOptionChange.bind(this)}
                   searchable={false}
                   options={this.state.sortOptions}/>
          </div>
          <div className="t-right">
            <input type="checkbox" id="hideUsed" onChange={this.handleHideUsedToggle.bind(this)} checked={isChecked} />
              <label htmlFor="hideUsed" className="hide-used">
                { t('HIDE_USED') }
              </label>
          </div>
        </div>

        );
    }
}


export default translate('SortAndFilter')(SortAndFilter);
