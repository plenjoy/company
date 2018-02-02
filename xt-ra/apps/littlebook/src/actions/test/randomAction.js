import { DID_RANDOM } from '../../contants/actionTypes';

export function random(value) {
  return {
    type: DID_RANDOM,
    value
  };
}

