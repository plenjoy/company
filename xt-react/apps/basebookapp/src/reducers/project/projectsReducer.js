import { fromJS } from 'immutable';
import { SHOW_LOADING, HIDE_LOADING } from '../../constants/actionTypes';

const initialState = fromJS({
  volumes: [],
  summary: {
    client: 'H5',
    cover: 'TLBSC',
    product: 'TLB',
    size: '6X6'
  }
});

const projects = (state = initialState, action) => {
  return state;
};

export default projects;
