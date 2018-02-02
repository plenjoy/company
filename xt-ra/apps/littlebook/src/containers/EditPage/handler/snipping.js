import { get } from 'lodash';
import { smallViewWidthInMyProjects } from '../../../contants/strings';
import { checkIsSetCoverAsInnerBg } from '../../../utils/cover';

import { toCanvas } from '../../../utils/snippingHelper';
import { getImageDataByBase64, imageDataHRevert, getBase64ByImageData, toObjectUrl } from '../../../../../common/utils/draw';

let timer = null;
