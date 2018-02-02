import * as settingActions from './settingActions';
import * as propertyActions from './propertyActions';
import * as elementArrayActions from './elementArrayActions';
import * as pageArrayActions from './pageArrayActions';
import * as projectActions from './projectActions';
import * as coverActions from './coverActions';
import * as orderInfoActions from './orderInfoActions';
import * as calendarSettingActions from './calendarSettingActions';
import * as imageArrayActions from './imageArrayActions';

export default {
  ...settingActions,
  ...propertyActions,
  ...elementArrayActions,
  ...pageArrayActions,
  ...projectActions,
  ...coverActions,
  ...orderInfoActions,
  ...calendarSettingActions,
  ...imageArrayActions
};
