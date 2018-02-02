import {
	CALL_API
} from '../../middlewares/api';
import {
	API_BASE,
	GET_STYLE_LIST
} from '../../constants/apiUrl';

import {
	webClientId
} from '../../../../common/utils/strings';

import {
	getRandomNum
} from '../../../../common/utils/math';

export function getStyleList(size, productType) {
	return (dispatch) => {
		return dispatch({
			[CALL_API]: {
				apiPattern: {
					name: GET_STYLE_LIST,
					params: {
						baseUrl: API_BASE,
						autoRandomNum: getRandomNum(),
						size: size,
						productType: productType
					}
				}
			}
		});
	};
}