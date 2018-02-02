import * as settingActions from './settingActions';
import * as propertyActions from './propertyActions';
import * as elementArrayActions from './elementArrayActions';
import * as pageArrayActions from './pageArrayActions';
import * as projectActions from './projectActions';
import * as coverActions from './coverActions';
import * as orderInfoActions from './orderInfoActions';
import * as bookSettingActions from './bookSettingActions';
import * as imageArrayActions from './imageArrayActions';
import * as backgroundArrayActions from './backgroundArrayActions';
import * as stickerArrayActions from './stickerArrayActions';

export default {
  ...settingActions,
  ...propertyActions,
  ...elementArrayActions,
  ...pageArrayActions,
  ...projectActions,
  ...coverActions,
  ...orderInfoActions,
  ...bookSettingActions,
  ...imageArrayActions,
  ...backgroundArrayActions,
  ...stickerArrayActions
};
