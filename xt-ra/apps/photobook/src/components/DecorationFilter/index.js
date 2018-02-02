import React, { Component, PropTypes } from 'react';
import { translate } from 'react-translate';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import * as handler from './handler.js';
import './index.scss';

class DecorationFilter extends Component {
  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      filterOptions: [
        {
          label: '',
          value: ''
        }
      ],
      filterValue: {
        label: '',
        value: ''
      }
    };
    this.onFilterChange = this.onFilterChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  onFilterChange(obj) {
    const { t, data, actions } = this.props;
    const { themestickerList } = data;
    // actions.setThemeType(obj.value);
    // actions.fetchThemeList(obj.value);
    // if (!themestickerList.list[obj.value]) {
    //   actions.boundThemeStickerActions.getThemeStickerList(obj.value);
    // }
  }

  getOptions(nextProps) {
    const { data } = nextProps;
    const { themesCategories, themestickerList, currentThemeType } = data;
    const filterOptions = [];
    let filterValue = {};
    themesCategories.forEach((theme) => {
      const obj = {};
      obj.label = theme.get('displayName');
      obj.value = theme.get('code');
      filterOptions.push(obj);
      if (currentThemeType == theme.get('code')) {
        filterValue = obj;
      }
    });
    this.setState({
      filterOptions,
      filterValue
    });
  }

  componentWillReceiveProps(nextProps) {
    this.getOptions(nextProps);
  }

  render() {
    const { t } = this.props;
    return (
      <div className="decoration-filter">
        <div className="filter-content">
          <label>{ t('FILTER_BY_THEME') }</label>
          <XSelect
            value={this.state.filterValue}
            onChanged={this.onFilterChange}
            searchable={false}
            options={this.state.filterOptions}
          />
          <div className="clear" />
        </div>
      </div>
    );
  }
}

DecorationFilter.proptype = {

};

export default translate('DecorationFilter')(DecorationFilter);
